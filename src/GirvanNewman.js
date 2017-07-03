import edge_betweenness_centrality from './EdgeBetweennessCentrality.js';
import {array2map, map2values} from './utils.js';
export default function(){
	var graph;

	var node_to_community = new Map();

	function execute(){
		var i, j;
		var tree, tree_node;
		var node;
		var edge;
		var ebc;
		var clone_edges = graph.edges().slice(0);
		var children_ids;
		var max, max_edge_index;
		var community;
		var leave;

		for(i = 0; i < graph.nodes().length; i++){
			node = graph.nodes()[i];
			node_to_community.set(node.id, 0);
		}

		tree_node = {
			id : 0,
			com_id : 0,
			name : '',
			value : {
				nodes : []
			},
			children : [],
			metric : 0,
			m : 0
		};
		tree = tree_node;

		var communities = [graph.nodes()];
		communities.id = 0;
		var pre_communities = communities;
		tree_node.value.nodes = communities[0];
		tree_node.m = communities[0].length;
		var level = graph.nodes().length + 10;
		var id = 0;
		var name;
		while(graph.edges().length > 0){
			ebc = edge_betweenness_centrality().graph(graph);

			ebc();


			max = -Infinity;
			max_edge_index = 0;


			graph.edges().forEach(function(edge, i){
				if(max < edge.edge_betweenness){
					max_edge_index = i;
					max = edge.edge_betweenness;
				}
			});
			edge = graph.edges()[max_edge_index];
			graph.remove_edge(edge);

			pre_communities = communities;
			communities = communitiy_detection(graph, communities);

			if(pre_communities.length < communities.length){
				leave = tree_leave(tree);
				for(i = 0; i < leave.length; i++){
					if(leave[i].com_id === pre_communities.break_id){
						tree_node = leave[i];
						break;
					}
				}
				children_ids = pre_communities[pre_communities.break_id].children_ids;
				for(i = 0; i < children_ids.length; i++){
					name = '';
					community = communities[children_ids[i]];
					if(community.length === 1){
						name = community[0].name;
					}
					tree_node.children.push({
						id : ++id,
						com_id : community.id,
						name : name,
						value: {
							nodes : community
						},
						children : [],
						m : community.length,
						metric : --level
					});
				}
			}
		}

		graph.edges(clone_edges);
		graph.create();
		return tree;
	}

	function communitiy_detection(graph, parent_communities){
		var i, node;
		var nodes = graph.nodes();
		var node_map = array2map(nodes, function(d){return d.id;});
		var source;
		var source_com_id;
		//stores the current set of community ids
		var com_ids = new Set();
		var communities = [];
		var com;
		var com_id;
		while(!node_map.size === 0){
			source = map2values(node_map)[0];
			//get the current community id for the node
			source_com_id = node_to_community.get(source.id);
			//if the source node has a community id that's already been used
			if(com_ids.has(source_com_id)){
				//create a new id for the community
				com_id = parent_communities.length;
				//mark the id for the community to be splited
				parent_communities.break_id = source_com_id;
				parent_communities[source_com_id].children_ids = [source_com_id, com_id];
			}
			else{
				//use the current id
				com_id = source_com_id;
				//add the id to the community set indicating the id is already used
				com_ids.add(com_id);
			}
			com = community(source);
			com.id = com_id;
			com.parent_id = source_com_id;
			communities[com_id] = com;
		}

		//update the node to community map
		communities.forEach(function(community, i){
			community.forEach(function(node, j){
				node_to_community.set(node.id, community.id);
			});
		});

		return communities;

		//depth first search to detect community given a source node
		function community(source){
			var i;
			var node;
			var community_nodes = [];
			var neighbor;
			var neighbors;
			var visited_nodes = new Set();

			var stack = new Array();
			stack.push(source);

			visited_nodes.add(source.id);
			node_map.delete(source.id);
			community_nodes.push(source);

			while(stack.length > 0){
				node = stack.pop();
				neighbors = node.all_neighbors();
				for(i = 0; i < neighbors.length; i++){
					neighbor = neighbors[i];
					if(!visited_nodes.has(neighbor.id)){
						visited_nodes.add(neighbor.id);

						node_map.delete(neighbor.id);
						community_nodes.push(neighbor);

						stack.push(neighbor);
					}
				}
			}
			return community_nodes;
		}
	}


	function tree_leave(tree){
		var leave = [];
		recurse(tree);
		return leave;
		function recurse(r){
			if(r){
				if(!r.children || r.children.length === 0)
					leave.push(r);
				else
					r.children.forEach(recurse);
			}
		}
	}

	function ret(){
		return execute();
	}

	ret.graph = function(_){
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	return ret;
};