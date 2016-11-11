function girvan_newman(){
	var graph;


	function execute(){
		var i, j;
		var tree, tree_node;
		var clone_edges = graph.edges().slice(0);

		tree_node = {
			name : '',
			value : null,
			children : []
		};
		tree = tree_node;

		var ebc = edge_betweenness_centrality().graph(graph);
		ebc();

		var max = -Infinity;
		var max_edge_index = 0;
		graph.edges().forEach(function(edge, i){
			if(max < edge.edge_betweenness){
				max_edge_index = i;
				max = edge.edge_betweenness;
			}
		});


	}

	function communitiy_detection(graph){
		var i, node;
		var nodes = graph.nodes();
		var node_map = d3.map(nodes, function(d){
			return d.id;
		});

		for(i = 0; i < nodes.length; i++){
			node = nodes[i];

		}


		function visit_node(source){
			var i;
			var node;
			var neighbor;
			var neighbors;
			var visited_nodes = d3.set();

			var stack = new Array();
			stack.push(source);

			while(stack.length > 0){
				node = stack.pop();
				neighbors = node.all_neighbors();
				for(i = 0; i < neighbors.length; i++){
					neighbor = node.neighbors[i];
					if(!visited_nodes.has(neighbor.id)){
						visited_nodes.add(neighbor.id);
					}
				}
			}			
		}
	}




	function ret(){

	}

	ret.graph = function(_){
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	return ret;
}