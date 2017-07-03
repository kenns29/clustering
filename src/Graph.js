import {array2map} from './utils.js';
export default function(){
	/*
	* node {id, name}
	* edge {source, target, value}
	*/
	var nodes, edges;
    var directed = true;

	var edge_map = new Map();
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

		edges.forEach(function(edge){
			edge.id = edge_key_from_nodes(edge.source, edge.target);
		});
		edges.forEach(function(edge){
			edge_map.set(edge.id, edge);
		});

		for(i = 0; i < nodes.length; i++){
			node = nodes[i];
			node._edges = [];
			node._in_edges = [];
			node._out_edges = [];
			node.edges = function(){return this._edges;};
			node.in_edges = function(){return this._in_edges;};
			node.out_edges = function(){return this.out_edges;};
		}

		for(i = 0; i < edges.length; i++){
			edge = edges[i];
			source = edge.source;
			target = edge.target;

			source._edges.push(edge);
			target._edges.push(edge);
			source._out_edges.push(edge);
			target._in_edges.push(edge);
		}

		for(i = 0; i < nodes.length; i++){
			node = nodes[i];
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
		return ret;
	}

	function sub_graph(_nodes){
		nodes = _nodes;
		var node_map = array2map(nodes, function(d){
			return d.id;
		});
		edges = edges.filter(function(edge){
			return node_map.has(edge.source.id) || node_map.has(edge.target.id);
		});
		return create();
	}

    function remove_edge(edge){
    	var i;
    	for(i = 0; i < edge.source._edges.length; i++){
    		if(edge.id === edge.source._edges[i].id){
    			edge.source._edges.splice(i, 1);
    			break;
    		}
    	}

    	for(i = 0; i < edge.target._edges.length; i++){
    		if(edge.id === edge.target._edges[i].id){
    			edge.target._edges.splice(i, 1);
    			break;
    		}
    	}

    	for(i = 0; i < edge.source._out_edges.length; i++){
    		if(edge.id === edge.source._out_edges[i].id){
    			edge.source._out_edges.splice(i, 1);
    			break;
    		}
    	}

    	for(i = 0; i < edge.target._in_edges.length; i++){
    		if(edge.id === edge.target._in_edges[i].id){
    			edge.target._in_edges.splice(i, 1);
    			break;
    		}
    	}
    	edge.source._all_neighbors = all_neighbors(edge.source);
    	edge.target._all_neighbors = all_neighbors(edge.target);

    	edge.source._all_out_neighbors = all_out_neighbors(edge.source);
    	edge.target._all_in_neighbors = all_in_neighbors(edge.target);

    	for(i = 0; i < edges.length; i++){
    		if(edge === edges[i]){
    			edges.splice(i, 1);
    			break;
    		}
    	}

    	edge_map.delete(edge.id);
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

    function undirected_edge(n1, n2){
    	return undirected_edge_from_nodes(n1,n2);
    }

    function undirected_edge_from_nodes(n1, n2){
    	var key = edge_key_from_nodes(n1, n2);
    	var edge = edge_map.get(key);
    	if(edge) return edge;
    	return edge_map.get(edge_key_from_nodes(n2, n1));
    }

    function undirected_edge_from_ids(id1, id2){
    	var key = edge_key_from_ids(id1, id2);
    	var edge = edge_map.get(key);
    	if(edge) return edge;
    	return edge_map.get(edge_key_from_ids(id2, id1));
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
		return node._in_edges.map(function(d, i){
			return d.source;
		});
    }

    function all_out_neighbors(node){
    	return node._out_edges.map(function(d, i){
    		return d.target;
    	});
    }

    function all_neighbors(node){
    	var neighbors = [];
    	var edge;
    	var i;
    	for(i = 0; i < node._edges.length; i++){
    		edge = node._edges[i];
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
		'edge' : edge,
		'undirected_edge' : undirected_edge,
		'remove_edge' : remove_edge,
		'sub_graph' : sub_graph
	};

	return ret;
};