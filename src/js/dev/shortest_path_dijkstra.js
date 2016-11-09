function shortest_path_dikstra(){
	var graph;
	var source, target;
	/*
	* 1) in
	* 2) out
	* 3) undirected
	*/
	var direction = 'undirected';

	function value_comparator(v1, v2){
		return v1 - v2;
	}
	function node_comparator(n1, n2){
		return value_comparator(n1.dk_status.metric, n2.dk_status.metric); 
	}
	function init_metric(){
		return Infinity;
	}
	function init_source_metric(){
		return 0;
	}
	//this is testing the undirected only
	function single_source_undirected(){
		var i, j;
		var nodes = graph.nodes();
		var edges = graph.edges();
		var cur_node;
		var alt;
		var neighbor;
		var edge;

		init_nodes(nodes);

		var Q = new PriorityQueue({comparator: node_comparator});
		
		for(i = 0; i < nodes.length; i++){
			Q.queue(nodes[i]);
		}
		
		while(Q.length && Q.length> 0){
			cur_node = Q.dequeue();
			
			for(i = 0; i < cur_node.edges.length; i++){
				edge = cur_node.edges[i];
				neighbor = cur_node.neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if(value_comparator(alt, neighbor.dk_status.metric) < 0){
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
	}

	function single_source_in(){
		var i, j;
		var nodes = graph.nodes();
		var edges = graph.edges();
		var cur_node;
		var alt;
		var neighbor;
		var edge;

		init_nodes(nodes);

		var Q = new PriorityQueue({comparator: node_comparator});
		
		for(i = 0; i < nodes.length; i++){
			Q.queue(nodes[i]);
		}

		while(Q.length && Q.length > 0){
			cur_node = Q.dequeue();
			for(i = 0; i < cur_node.in_edges.length; i++){
				edge = cur_node.in_edges[i];
				neighbor = cur_node.in_neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if(value_comparator(alt, neighbor.dk_status.metric) < 0){
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
	}

	function single_source_out(){
				var i, j;
		var nodes = graph.nodes();
		var edges = graph.edges();
		var cur_node;
		var alt;
		var neighbor;
		var edge;

		init_nodes(nodes);

		var Q = new PriorityQueue({comparator: node_comparator});
		
		for(i = 0; i < nodes.length; i++){
			Q.queue(nodes[i]);
		}

		while(Q.length && Q.length > 0){
			cur_node = Q.dequeue();
			for(i = 0; i < cur_node.out_edges.length; i++){
				edge = cur_node.out_edges[i];
				neighbor = cur_node.out_neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if(value_comparator(alt, neighbor.dk_status.metric) < 0){
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
	}
	function init_nodes(nodes){
		for(i = 0; i < nodes.length; i++){
			nodes[i].dk_status = {};
			nodes[i].dk_status.backpointer = null;
			if(nodes[i] === source){
				nodes[i].dk_status.metric = init_source_metric();
			}
			else{
				nodes[i].dk_status.metric = init_metric();
			}
		}
	}

	function all_paths(){
		var i, j;
		var nodes = graph.nodes();
		var node;
		var paths = [];
		var path;
		for(i = 0; i < nodes.length; i++){
			path = [];
			node = nodes[i];
			do{
				path.unshift(node);
			}while(node = node.dk_status.backpointer);

			paths.push(path);
		}
		return paths;
	}

	function ret(){
		if(direction === 'undirected')
			single_source_undirected();
		else if(direction === 'in')
			single_source_in();
		else if(direction === 'out')
			single_source_out();
		else
			single_source_out();
		return all_paths();
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

	ret.comparator = function(_){
		if(arguments.length > 0) value_comparator = _;
		return ret;
	};

	ret.init_metric = function(_){
		if(arguments.length > 0) init_metric = _;
		return ret;
	};

	ret.init_source_metric = function(_){
		if(arguments.length > 0) init_source_metric = _;
		return ret;
	};
	
	return ret;
}

