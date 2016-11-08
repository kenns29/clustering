function shortest_path_dikstra(){
	var graph;
	var source, target;
	/*
	* 1) in
	* 2) out
	* 3) double
	* 4) undirected
	*/
	var direction = 'undirected';

	function edge_value(edge){
		return value;
	}
	function value_comparator(v1, v2){
		return v2 - v1;
	}
	//this is testing the undirected only
	function single_source_single_target(){
		var i, j;
		var edge;
		var cur_node = source;
		var neighbor;
		var neighbor_value;
		var value;
		var v_comp;
		for(i = 0; i < cur_node.edges.length; i++){
			edge = cur_node.edges[i];
			neighbor = cur_node.neighbor(edge);
			value = edge_value(edge);
			neighbor_value = neighbor.dk_status.value;
			v_comp = value_comparator(value, neighbor_value);
			if(v_comp > 0){
				neighbor.dk_status.value = value;
				neighbor.dk_status.backtracker = cur_node;
			}
		}
	}

	function init_nodes(){
		var nodes = graph.nodes();
		nodes.forEach(function(d){
			d.dk_status = {
				value : Infinity,
				backtracker: d,
			};
		});
	}

	function ret(){

	}

	ret.graph = function(_){
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	ret.source = function(_){
		return arguments.length > 0 ? (source =  _, ret) : source;
	};

	ret.target = function(_){
		return arguments.length > 0 ? (target = _, ret) : target;
	};

	ret.direction = function(_){
		return arguments.length > 0 ? (direction = _, ret) : direction;
	};

	return ret;
}

