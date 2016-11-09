function breadth_first_search(){
	var graph;
	var source;
	var direction = 'undirected';

	function visit(d){
		console.log(d.id, d.bs_status.visited, d.bs_status.level, d.all_neighbors().map(function(d){return d.id;}));
	}

	function init_nodes(nodes){
		nodes.forEach(function(d){
			d.bs_status = {
				visited : false,
				level : 0
			};
		});
	}

	function search(){
		var node;
		var Q = queue();
		var nodes = graph.nodes();
		init_nodes(nodes);

		source.bs_status.visited = true;
		Q.enqueue(source);
		
		while(!Q.empty()){
			node = Q.dequeue();
			visit(node);
			
			node.all_neighbors().forEach(function(neighbor){
				if(!neighbor.bs_status.visited){
					neighbor.bs_status.visited = true;
					neighbor.bs_status.level = node.bs_status.level + 1;
					Q.enqueue(neighbor);
				}
			});
		}
		clean_up();
	}

	function clean_up(){
		graph.nodes().forEach(function(d){
			delete d.bs_status;
		});
	}

	function ret(){
		search();
	}
	ret.graph = function(_){
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};
	ret.direction = function(_){
		return arguments.length > 0 ? (direction = _, ret) : direction;
	};
	ret.visit = function(_){
		if(arguments.length > 0) visit = _;
		return ret;
	};
	ret.source = function(_){
		return arguments.length > 0 ? (source = _, ret) : source;
	};
	return ret;
}

dm.breadth_first_search = breadth_first_search;