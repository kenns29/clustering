function edge_betweenness_centrality(){
	var graph;
	var edge;

	function flow_sum(source){
		var bs = breadth_first().graph(graph).source(source);
		var tree = bs();
		add_weight(tree);

		console.log('tree', tree);
		function add_weight(tree){
			tree.weight = 1;
			recurse(tree);
			function recurse(r){
				if(r){
					if(r.parent){
					r.weight = r.in_flow.reduce(function(pre, cur){
							return pre + cur.weight;
						}, 0);
					}
					r.children.forEach(recurse);
				}
			}
		}
		return tree;
	}

	function ret(){
		return flow_sum(graph.nodes()[0]);
	}

	ret.graph = function(_){
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	return ret;
}

dm.edge_betweenness_centrality = edge_betweenness_centrality;