function edge_betweenness_centrality(){
	var graph;
	var edge;

	function init_edge_betweenness(){
		graph.edges().forEach(function(d){
			d.edge_betweenness = 0;
		});
	}
	function flow(){
		init_edge_betweenness();
		graph.nodes().forEach(function(node){
			source_flow(node);
		});
	}

	function source_flow(source){
		var i, j;
		var node;
		var upper_node;
		var upper_weight_sum;
		var flow;
		var edge;
		var bs = breadth_first().graph(graph).source(source);
		var tree = bs();
		init_flow(tree);

		var leave = flow_leave(tree);
		leave.forEach(function(d){
			leaf_flow(d, source);
		});

		leave.forEach(function(d){
			edge_betweenness(d, source);
		});
	}

	function edge_betweenness(leaf){
		var i;
		var node;
		var in_node;
		var edge;
		var flow;
		var stack = new Array();

		stack.push(leaf);
		while(stack.length > 0){
			node = stack.pop();
			if(!node.visited){
				node.visited =true;
				for(i = 0; i < node.in_flow.length; i++){
					in_node = node.in_flow[i];
					flow = node.flow * (in_node.weight / node.weight);
					edge = graph.undirected_edge(node.value, in_node.value);
					
					edge.edge_betweenness = edge.edge_betweenness ? flow + edge.edge_betweenness : flow;
					stack.push(in_node);
				}
			}
		}

	}

	function leaf_flow(leaf){
		var i, j;
		var node;
		var in_node;
		var flow;
		var stack = new Array();
		stack.push(leaf);
		while(stack.length > 0){
			node = stack.pop();
			for(i = 0; i < node.in_flow.length; i++){
				in_node = node.in_flow[i];
				stack.push(in_node);
				in_node.flow += node.flow * (in_node.weight / node.weight);
			}
		}
	}

	function ret(){
		return flow(graph.nodes()[0]);
	}

	ret.graph = function(_){
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	return ret;

	function init_flow(tree){
		recurse(tree);
		function recurse(r){
			if(r){
				r.flow = 1;
				r.children.forEach(recurse);
			}
		}
	}
	function upper_level_nodes(cur_level){
		var i;
		var value;
		var node;
		var upper_level_map = d3.map();
		for(i = 0; i < cur_level.length; i++){
			node = cur_level[i];
			upper_level_map.set(node.value.id, node);
		}
		return upper_level_map.values();
	}

	function tree_leave(tree){
		var leave = [];
		recurse(tree);
		return leave;
		function recurse(r){
			if(r){
				if(!r.children || r.children.length === 0)
					leave.push(r);
				else{
					r.children.forEach(recurse);
				}
			}
		}
	}

	function flow_leave(tree){
		return tree_leave(tree).filter(function(d){
			return d.out_flow.length === 0;
		});
	}
}

dm.edge_betweenness_centrality = edge_betweenness_centrality;

function print_ready_tree(tree){
	var ptree = copy_node(tree);
    recurse(tree, ptree);
    return ptree;
	function recurse(r, pr){
		if(r){
			r.children.forEach(function(child){
				var copy_child = copy_node(child);
				pr.children.push(copy_child);
				recurse(child, copy_child);
			});
		}
	}

	function copy_node(r){
		return {
			'id' : r.value.id,
			'in_flow' : r.in_flow.map(function(d){
				return d.value.id;
			}),
			'out_flow' : r.out_flow.map(function(d){
				return d.value.id;
			}),
			'weight' : r.weight,
			'children' : []
		};
	}
}