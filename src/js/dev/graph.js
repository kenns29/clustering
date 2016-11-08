function graph(){
	/*
	* node {id, name}
	* edge {source, target, value}
	*/
	var nodes, edges;

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
			node.all_neighbors = all_neighbors_OF_Node;
			node.all_in_neighbors = all_in_neighbors_OF_Node;
			node.all_out_neighbors = all_out_neighbors_OF_Node;
			node.neighbor = neighbor_OF_Node;
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

	function neighbor_OF_Node(edge){
		return neighbor(this, edge);
	}
}