function graph(){
	/*
	* node {id, name}
	* edge {source, target, value}
	*/
	var nodes, edges;
    var directed = true;

	var edge_map = d3.map();
	var init_id = false;

	function id_accessor(d){
		return d.id;
	}

	/*
	* Init the graph given edges and nodes
	*/
	function create(){
		var i;
		var node, edge;
		var source, target;

		if(init_id){
			for(i = 0; i < nodes.length; i++){
				nodes[i].id = i;
			}
		}

		edge_map = d3.map(edges, function(d){
			return id_accessor(d.source.id) + '-' + id_accessor(d.target.id); 
		});

		for(i = 0; i < nodes.length; i++){
			node = nodes[i];
			node.edges = [];
			node.in_edges = [];
			node.out_edges = [];

			node._all_neighbors = all_neighbors(node);
			node._all_in_neighbors = all_in_neighbors(node);
			node._all_out_neighbors = all_out_neighbors(node);

			node.all_neighbors = function(){return this._all_neighbors;};
			node.all_in_neighbors = function(){return this._all_in_neighbors;};
			node.all_out_neighbors = function(){return this._all_out_neighbors;};
			node.neighbor = function(){return neighbor(this, edge);};
			node.in_neighbor = function(){return in_neighbor(this, edge);};
			node.out_neighbor = function(){return out_neighbor(this, edge);};
		}

		for(i = 0; i < edges.length; i++){
			edge = edges[i];
			source = edge.source;
			target = edge.target;

			source.edges.push(edge);
			target.edges.push(edge);
			source.out_edges.push(edge);
			target.in_edges.push(edge);
		}
		return ret;
	}
    
    function edge(n1, n2){
    	return edge_from_nodes(n1, n2);
    }

    function edge_from_nodes(n1, n2){
    	var key = edge_key_from_nodes(n1, n2);
    	return edge_map.get(key);
    }

    function edge_from_ids(id1, id2){
    	var key = edge_key_from_ids(id1, id2);
    	return edge_map.get(key);
    }

    function edge_key_from_ids(id1, id2){
    	return id1 + '-' + id2;
    }

    function edge_key_from_nodes(n1, n2){
    	var id1 = id_accessor(n1);
    	var id2 = id_accessor(n2);
    	return edge_key_from_ids(id1, id2);
    }

    function all_in_neighbors(node){
		return node.in_edges.map(function(d, i){
			return d.source;
		});  	
    }

    function all_out_neighbors(node){
    	return node.out_edges.map(function(d, i){
    		return d.target;
    	});
    }

    function all_neighbors(node){
    	var neighbors = [];
    	var edge;
    	var i;
    	for(i = 0; i < node.edges.length; i++){
    		edge = node.edges[i];
    		neighbors.push(neighbor(node, edge));
    	}
    	return neighbors;
    } 

    function neighbor(node, edge){
    	if(edge.source === node){
    		return edge.target;
    	}
    	else if(edge.target === node){
    		return edge.source;
    	}
    	else{
    		return null;
    	}
    }

    function in_neighbor(node, edge){
    	if(edge.target === node){
    		return edge.source;
    	}
    	else{
    		return null;
    	}
    }

    function out_neighbor(node, edge){
    	if(edge.source === node){
    		return edge.target;
    	}
    	else{
    		return null;
    	}
    }

	var ret = {
		'nodes' : function(_){
			return arguments.length > 0 ? (nodes = _, this) : nodes;
		},
		'edges' : function(_){
			return arguments.length > 0 ? (edges = _, this) : edges;
		}, 
		'id' : function(_){
			if(arguments.length > 0) id_accessor = _;
			return this;
		},
		'init_id' : function(_){
			init_id = _; return this;
		},
		'directed' : function(_){
			return arguments.length > 0 ? (directed = _, this) : directed;
		},
		'create' : create,
		'edge' : edge
	};

	return ret;


	//Utilities

	//Template function for node
	function all_in_neighbors_OF_Node(){
		return all_in_neighbors(this);
	}

	function all_out_neighbors_OF_Node(){
		return all_out_neighbors(this);
	}

	function all_neighbors_OF_Node(){
		return all_neighbors(this);
	}

	
}

dm.graph = graph;