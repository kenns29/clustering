var dm = {};










function girvan_newman(){
	var graph;

	var node_to_community = d3.map();

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
			com_id : 0,
			name : '',
			value : {
				nodes : []
			},
			children : []
		};
		tree = tree_node;

		var communities = [graph.nodes()];
		communities.id = 0;
		var pre_communities = communities;
		tree_node.value.nodes = communities[0];

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
					community = communities[children_ids[i]];
					tree_node.children.push({
						com_id : community.id,
						name : '',
						value: {
							nodes : community
						},
						children : []
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
		var node_map = d3.map(nodes, function(d){
			return d.id;
		});

		var source;
		var source_com_id;
		//stores the current set of community ids
		var com_ids = d3.set();
		var communities = [];
		var com;
		var com_id;
		while(!node_map.empty()){
			source = node_map.values()[0];
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
			var visited_nodes = d3.set();

			var stack = new Array();
			stack.push(source);

			visited_nodes.add(source.id);
			node_map.remove(source.id);
			community_nodes.push(source);

			while(stack.length > 0){
				node = stack.pop();
				neighbors = node.all_neighbors();
				for(i = 0; i < neighbors.length; i++){
					neighbor = neighbors[i];
					if(!visited_nodes.has(neighbor.id)){
						visited_nodes.add(neighbor.id);

						node_map.remove(neighbor.id);
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
}

dm.girvan_newman = girvan_newman;
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


function breadth_first(){
	var graph;
	var source;
	var direction = 'undirected';

	function visit(d){
		// console.log(d, d.id, d.bs_status.tree_node.weight, d.bs_status.visited, d.bs_status.level, d.all_neighbors().map(function(d){return d.id;}));
	}

	function init_nodes(nodes){
		nodes.forEach(function(d){
			d.bs_status = {
				visited : false,
				level : 0,
				tree_node : null
			};
		});
	}

	function search(){
		//the minimum spaning tree that are returned
		var tree;
		var tree_node;
		var node;
		var Q = queue();
		var nodes = graph.nodes();
		init_nodes(nodes);

		tree_node = {
			level : 0,
			in_flow : [],
			out_flow : [],
			weight : 1,
			parent : null,
			children : [],
			value : source
		};
		tree = tree_node;

		source.bs_status.tree_node = tree_node;
		source.bs_status.visited = true;
		Q.enqueue(source);
		while(!Q.empty()){
			node = Q.dequeue();
			node.all_neighbors().forEach(function(neighbor){
				if(!neighbor.bs_status.visited){

					tree_node = {
						level : node.bs_status.level + 1,
						in_flow : [],
						out_flow : [],
						weight : 0,
						parent : node.bs_status.tree_node,
						children : [],
						value : neighbor
					};

					neighbor.bs_status.visited = true;
					neighbor.bs_status.level = node.bs_status.level + 1;
					neighbor.bs_status.tree_node = tree_node;

					node.bs_status.tree_node.children.push(tree_node);
					
					Q.enqueue(neighbor);
				}
				if(node.bs_status.level + 1 === neighbor.bs_status.level){
					neighbor.bs_status.tree_node.weight += node.bs_status.tree_node.weight;
					neighbor.bs_status.tree_node.in_flow.push(node.bs_status.tree_node);
					node.bs_status.tree_node.out_flow.push(neighbor.bs_status.tree_node);
				}
			});
			visit(node);
		}
		clean_up();
		return tree;
	}

	function clean_up(){
		graph.nodes().forEach(function(d){
			delete d.bs_status;
		});
	}

	function ret(){
		return search();
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

dm.breadth_first = breadth_first;
function shortest_path_dijkstra(){
	var graph;
	var source, target;
	/*
	* 1) in
	* 2) out
	* 3) undirected
	*/
	var direction = 'undirected';
	var include_self_path = false;

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

	function multi_source(){
		var paths = graph.nodes().reduce(function(pre, cur, ind){
			source = cur;
			return pre.concat(single_source());
		}, []);

		source = target = undefined;
		return paths;
	}

	function single_source(){
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
			
			for(i = 0; i < cur_node.edges().length; i++){
				edge = cur_node.edges()[i];
				neighbor = cur_node.neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if(value_comparator(alt, neighbor.dk_status.metric) < 0){
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
		return ret;
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
			for(i = 0; i < cur_node.in_edges().length; i++){
				edge = cur_node.in_edges()[i];
				neighbor = cur_node.in_neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if(value_comparator(alt, neighbor.dk_status.metric) < 0){
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
		return ret;
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
			for(i = 0; i < cur_node.out_edges().length; i++){
				edge = cur_node.out_edges()[i];
				neighbor = cur_node.out_neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if(value_comparator(alt, neighbor.dk_status.metric) < 0){
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
		return ret;
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
			if(include_self_path || path.length > 1)
				if(path[0] === source)
					paths.push(path);
		}
		return paths;
	}


	function ret(){
		if(source && !target){
			return single_source();
		}
		else if(!source && !target){
			return multi_source();
		}
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

	ret.self_path = function(_){
		return arguments.length > 0 ? (include_self_path = _, ret) : include_self_path;
	};

	return ret;
}

dm.shortest_path_dijkstra = shortest_path_dijkstra;

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
		var node_map = d3.map(nodes, function(d){
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

    	edge_map.remove(edge.id);
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
}

dm.graph = graph;
function ClusterEvaluation(){
	/*
	* Data needs to be in the following format:
	* [{name, value:{centroid, points}}, ...]
	*/
	var data;

	var points_accessor = function(d){
		return d.value.points;
	};

	var centroid_accessor = function(d){
		return d.value.centroid;
	};

	var point_accessor = function(d){
		return d.value.point;
	};

	//default silhouette distance metric is euclidean
	var silhouette_dist_metric = euclidean_distance;

	this.centroid_of_all_points = centroid_of_all_points;

	this.WSS = function(){
		var sum = 0;
		data.forEach(function(d){
			var points = points_accessor(d);
			var centroid = centroid_accessor(d);
			var sse;
			if(centroid === null || centroid === undefined){
				sse = new Evaluation().data(points).accessor(point_accessor).SSE();
			}
			else{
				sse = new Evaluation().data(points).accessor(point_accessor).SSE(centroid_accessor(d));
			}
			
			sum += sse;
		});
		return sum;
	};

	this.BSS = function(){
		var sum = 0;
		var data_centroid = centroid_of_all_points();
		data.forEach(function(d){
			//obtain points in the cluster
			var points = points_accessor(d);
			if(points.length > 0){
				//obtain the centroid of the cluster, if centroid is not defined, calculate it
				var centroid = centroid_accessor(d);
				if(centroid === null || centroid === undefined){
					centroid = point_accessor(points[0]).map(function(){return 0;});
					points.forEach(function(g){
						var point = point_accessor(g);
						for(var i = 0; i < centroid.length; i++){
							centroid[i] += point[i];
						}
					});
					
					centroid = centroid.map(function(g){
						return g/points.length;
					});
				}

				sum += points.length * euclidean_distance_square(centroid, data_centroid);
			}
		});
		return sum;
	};
	
	this.TSS = function(){
		var sum = 0;
		var data_centroid = centroid_of_all_points();
		data.forEach(function(d){
			var points = points_accessor(d);
			if(points.length > 0){
				var ps = points.map(point_accessor);
				ps.forEach(function(g){
					sum += euclidean_distance_square(g, data_centroid);
				});
			}
		});
		return sum;
	};
	
	this.silhouette_coefficient = function(point, cluster){
		if(arguments.length === 0){
			return silhouette_coefficient();
		}
		else if(arguments.length == 1){
			return silhouette_coefficient(point);
		}
		else{
			return silhouette_coefficient(point, cluster);
		}
	};

	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
	this.points_accessor = function(_){
		return (arguments.length > 0) ? (points_accessor = _, this) : points_accessor;
	};
	this.point_accessor = function(_){
		return (arguments.length > 0) ? (point_accessor = _, this) : point_accessor;
	};
	this.centroid_accessor = function(_){
		return (arguments.length > 0) ? (centroid_accessor = _, this) : centroid_accessor;
	};

	this.silhouette_dist_metric = function(_){
		return (arguments.length > 0) ? (silhouette_dist_metric = _, this) : silhouette_dist_metric;
	};

	function euclidean_distance(a, b){
		var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	}

	function euclidean_distance_square(a, b){
		var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return sum;
	}

	function centroid_of_all_points(){
		var centroid = null;
		var numPoints = 0;
		data.forEach(function(d){
			var points = points_accessor(d);
			numPoints += points.length;
			points.forEach(function(g, k){
				var point = point_accessor(g);
				if(isArray(point)){
					if(!centroid){
						centroid = point.map(function(){return 0;});
					}
					
					for(var i = 0; i < centroid.length; i++){
						centroid[i] += point[i];
					}
				}
				else{
					if(!centroid)
						centroid = 0;
					centroid += point;
				}
			});
		});
		if(isArray(centroid)){
			centroid = centroid.map(function(d){
				return d/numPoints;
			});
		}
		else{
			centroid /= numPoints;
		}
		return centroid;
	}

	function silhouette_coefficient_for_all_points(){
		var point_silhouette_pairs = [];
		for(var i = 0; i < data.length; i++){
			var cluster = data[i];
			var c_data = points_accessor(cluster);
			for(var j = 0; j < c_data.length; j++){
				var point_name = c_data[j].name;
				var sc = silhouette_coefficient(c_data[j], cluster);
				point_silhouette_pairs.push({
					'name' : point_name,
					'point' : point_accessor(c_data[j]),
					'value' : sc
				});
			}
		}
		return point_silhouette_pairs;
	}

	function silhouette_coefficient(point, cluster){
		if(arguments.length === 0){
			return silhouette_coefficient_for_all_points();
		}
		else if(arguments.length == 1){
			cluster = (function(){
				for(var i = 0; i < data.length; i++){
					var c_data = points_accessor(data[i]);
					for(var j = 0; j < c_data.length; j++){
						var point_name = c_data[j].name;
						if(point_name == point.name){
							return data[i];
						}
					}
				}
			})();
			
			return silhouette_with_cluster(point_accessor(point), cluster);
		}
		else{
			if(Object.prototype.toString.call(cluster) === '[object String]'){
				return silhoutte_with_cluster_name(point_accessor(point), cluster);
			}
			else{
				return silhouette_with_cluster(point_accessor(point), cluster);
			}
		}

		function silhoutte_with_cluster_name(point, cluster_name){
			var cluster = null;
			for(var i = 0; i < data.length; i++){
				if(cluster_name == data[i].name){
					cluster = data[i];
					break;
				}
			}
			return silhouette_with_cluster(point, cluster);
		}

		function silhouette_with_cluster(point, cluster){
			var c_data = points_accessor(cluster);
			var c_points = c_data.map(point_accessor);
			var a = 0, i = 0, j = 0;
			if(c_points.length > 1){
				for(i = 0; i < c_points.length; i++){
					var dist = silhouette_dist_metric(point, c_points[i]);
					a += dist;
				}
				a /= c_points.length - 1;
			}
			var b = Infinity;
			for(i = 0; i < data.length; i++){
				if(cluster.name != data[i].name){
					var o_data = points_accessor(data[i]);
					var o_points = o_data.map(point_accessor);
					var sum = 0;
					for(j = 0; j < o_points.length; j++){
						sum += silhouette_dist_metric(point, o_points[j]);
					}
					sum /= o_points.length;
					if(sum < b){
						b = sum;
					}
				}
			}
			return (b - a) / Math.max(a, b);
		}
	}
}
/*
* Given array [[[..],[..]],
	[..],
	[..]]

  make a cluster object from it
*/
function array2clustering(arr){
	var point_name = 0;
	return arr.map(function(d, i){
		return {
			name : 'C' + i,
			value : {
				points : d.map(function(g, j){
					++point_name;
					return {
						name : point_name.toString(),
						value : {
							point : g
						}
					};
				})
			}
		};
	});
}

/*
* Given array [[..], [..], [..]]
* Make point objects from it
*/
function array2points(arr){
	return arr.map(function(d, i){
		return {
			name : (i+1).toString(),
			value : {
				point : d
			}
		};
	});
}


/*
* Similarity/Dissimilarity for Simple Attributes
*/
function nominal_distance(a, b){
	return (a === b) ? 1 : 0;
}

function nominal_similarity(a, b){
	return 1 - nominal_distance(a, b);
}

function ordinal_distance(a, b, n){
	return Math.abs(a - b) / (n - 1);
}

function ordian_similarity(a, b, n){
	return 1 - ordinal_distance(a, b, n);
}

function ratio_distance(a, b){
	return Math.abs(a - b);
}

function ratio_similarity(a, b, min, max){
	if(arguments.length == 2)
		return 1-ratio_distance(a, b);
	else if(arguments.length == 4){
		return 1 - (ratio_distance(a, b) - min) / (max - min);
	}
}

function ratio_similarity1(a, b){
	return -ratio_distance(a, b);
}

/*
* Similarity/Dissimilarity for Data Objects
*/
function euclidean_distance(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += (a[i] - b[i]) * (a[i] - b[i]);
	}
	return Math.sqrt(sum);
}

function minkowski_distance(a, b, r){
	var i;
	if(r == Infinity){
		var max_dist = -Infinity;
		for(i = 0; i < a.length; i++){
			var dist = Math.abs(a[i] - b[i]);
			if(dist > max){
				max = dist;
			}
		}
		return max_dist;
	}
	else{
		var sum = 0;
		for(i = 0; i < a.length; i++){
			sum += Math.pow(Math.abs(a[i] - b[i]), r);
		}
		return Math.pow(sum, 1/r);
	}
}

function mahalanobis_distance(a, b, sigma){

}

function jaccard_similarity(a, b){
	var m01 = 0, m10 = 0, m00 = 0, m11 = 0;
	for(var i = 0; i < a.length; i++){
		if(a[i] == b[i] == 1) ++m11;
		else if(a[i] === 1 && b[i] === 0) ++m10;
		else if(a[i] === 0 && b[i] === 1) ++m01;
		else if(a[i] === 0 && b[i] === 0) ++m00;
	}
	return (m01 + m10 + m11 > 0) ? m11 / (m01 + m10 + m11) : 1;
}

function jaccard_distance(a, b){
	return 1 - jaccard_similarity(a, b);
}

function tanimoto_similarity(a, b){
	var sum = 0, i = 0;
	for(i = 0; i < a.length; i++){
		sum += a[i] * b[i];
	}
	var a_square = 0;
	for(i = 0; i < a.length; i++){
		a_square += a[i] * a[i];
	}
	var b_square = 0;
	for(i = 0; i < b.length; i++){
		b_square += b[i] * b[i];
	}
	return sum / (a_square + b_square - sum);
}
function tanimoto_distance(a, b){
	return 1 - tanimoto_similarity(a, b);
}

function smc_similarity(a, b){
	var m01 = 0, m10 = 0, m00 = 0, m11 = 0;
	for(var i = 0; i < a.length; i++){
		if(a[i] == b[i] == 1) ++m11;
		else if(a[i] === 1 && b[i] === 0) ++m10;
		else if(a[i] === 0 && b[i] === 1) ++m01;
		else if(a[i] === 0 && b[i] === 0) ++m00;
	}
	return (m11 + m00) / (m01 + m10 + m11 + m00);
}

function smc_distance(a, b){
	return 1 - smc_similarity(a, b);
}

function cosine_distance(a, b){
	return 1 - cosine_similarity(a, b);
}

function cosine_similarity(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += a[i] * b[i];
	}
	return sum / (L2_norm(a) * L2_norm(b));
}

function correlation_similarity(a, b){
	var ma = mean(a);
	var mb = mean(b);
	var sa = std(a);
	var sb = std(b);
	if (sa === 0 && sb === 0){
		return 1;
	}
	else if(sa === 0 || sb === 0){
		return 0;
	}
	
	var ak = a.map(function(d){
		return (d - ma) / sa;
	});
	var bk = b.map(function(d){
		return (d - mb) / sb;
	});
	return dotp(ak, bk);
}

function correlation_distance(a, b){
	return -correlation_similarity(a, b);
}



dm.nominal_distance = nominal_distance;
dm.nominal_similarity = nominal_similarity;
dm.ordinal_distance = ordinal_distance;
dm.ordian_similarity = ordian_similarity;
dm.ratio_distance = ratio_distance;
dm.ratio_similarity = ratio_similarity;
dm.ratio_similarity1 = ratio_similarity1;
/*
* Similarity/Dissimilarity for Data Objects
*/
dm.euclidean_distance = euclidean_distance;
dm.minkowski_distance = minkowski_distance;
dm.mahalanobis_distance = mahalanobis_distance;
dm.jaccard_similarity = jaccard_similarity;
dm.jaccard_distance = jaccard_distance;
dm.tanimoto_similarity = tanimoto_similarity;
dm.tanimoto_distance = tanimoto_distance;
dm.smc_similarity = smc_similarity;
dm.smc_distance = smc_distance;
dm.cosine_distance = cosine_distance;
dm.cosine_similarity = cosine_similarity;
dm.correlation_similarity = correlation_similarity;
dm.correlation_distance = correlation_distance;
function Evaluation(){
	/*
	* Data needs to be the following format : 
	* [[],[]]
	*/
	var data;
	/*
	* Default accessor, which returns it self
	*/
	var accessor = function(d){
		return d;
	};

	/*
	* Compute the sum of square error of the data array
	* m is the optional parameter which defines the reference point
	* by default m is is the centroid of the points
	*/
	this.SSE = function(m){
		var dat = data.map(accessor);
		if(arguments.length === 0){
			m = mean(dat);
		}
		var sse = 0;
		for(var i = 0; i < dat.length; i++){
			sse += euclidean_distance_square(dat[i], m);
		}
		return sse;
	};


	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};

	this.accessor = function(_){
		return (arguments.length > 0) ? (accessor = _, this) : accessor;
	};


	function euclidean_distance(a, b){
		var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	}

	function euclidean_distance_square(a, b){
		var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return sum;
	}
}
function HierachicalCluster(){
	/*
	* Stores the pairs for all points, with the following format:
	* [{id:'1-2', from:{}, to:{}, dist:1}]
	*/
	var pairs = [];
	var leafPairs;
	var topPairs;
	var topPairMap;
	/*
	* Node data needs to be a json array of form [{name, value:{point:[1, 2, 3]}}]
	* each data point will be automatically assigned an id, which by default is the index
	*
	* Pair data needs to be a json array of the form [{from: {name, }]
	*/
	var data;

	/*
	* Specify the type of input data: node, pair, node-pair
	*/
	var data_type = HierachicalCluster.DATA_TYPE.NODE;
	/*
	* The default accesor is point
	*/
	var accessor = function(d){
		return d.value.point;
	};
	
	/*
	* Stores the history of pairs
	*/
	var history_pairs = [];

	/*
	* Flag to indicate whether to save history during execution
	*/
	var save_history = false;
	/*
	* distance metric for two points, the default is Euclidean distance
	*/
	var dist_metric = function(a, b){
		var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	};
	//default is min
	var dist_fun = function(R, Q){
		var A = R.children[0];
		var B = R.children[1];
		return lance_williams(R, Q, A, B, 1/2, 1/2, 0, 1/2);
	};
	
	var cut_opt = 'distance';

	/*
	* root has the following format:
	* {id: 0, name, value:{point:[]}, children:[], m:10, metric:1.1}
	* m is the number of members in the cluster
	*/
	var root;
	var nodes;
	var topNodes;
	
	//id for new node
	var nID = 0;
	
	var name_fun = function(n){
		var num = n.id + 1;
		return num.toString();
	};
	
	this.init = function(){
		var i, j;
		var node;
		/*
		* Init for node data
		*/
		if(data_type === HierachicalCluster.DATA_TYPE.NODE){
			/*
			* Init leaf nodes
			*/
			// nodes = data.map(function(d, i){
			// 	return {
			// 		'id' : i,
			// 		'name' : d.name,
			// 		'value':{
			// 			'point' : accessor(d)
			// 		},
			// 		'm' : 1,
			// 		'metric' : 0
			// 	};
			// });

			nodes = [];
			for(i = 0; i < data.length; i++){
				node = data[i];
				node.id = i;
				node.value.point = accessor(node),
				node.m = 1;
				node.metric = 0;
				nodes.push(node);
			}

			topNodes = nodes.slice(0);
			
			nID = nodes.length;
			/*
			* Init pairs
			*/
			for(i = 0; i < nodes.length; i++){
				var p1 = nodes[i].value.point;
				for(j = i+1; j < nodes.length; j++){
					var p2 = nodes[j].value.point;
					var dist = dist_metric(p1, p2);
					pairs.push({
						'id' : nodes[i].id + '-' + nodes[j].id,
						'from' : nodes[i],
						'to' : nodes[j],
						'dist': dist
					});
				}
			}
			//copy the pairs to leafPairs
			leafPairs = pairs.slice(0);
			//copy pairs to the top pairs and sort the top pairs 
			topPairs = pairs.slice(0);
			topPairs.forEach(function(d, i){
				d.index = i;
			});
			
			topPairs.sort(function(a, b){
				if(a.dist < b.dist){
					return -1;
				}
				else if(a.dist > b.dist){
					return 1;
				}
				else{
					return a.index - b.index;
				}
			});
			topPairMap = d3.map(topPairs, function(d){
				return d.id;
			});
		}
		/*
		* Init for pair data
		*/
		else if(data_type === HierachicalCluster.DATA_TYPE.PAIR){

		}
		return this;
	};
	
	this.cluster = function(){
		while(topNodes.length > 1){
			if(save_history)
				history_pairs.push(JSON.parse(JSON.stringify(topPairs)));
			var pair = topPairs[0];
			join(pair.from, pair.to);
		}
		root = topNodes[0];
		return this;
	};
	

	this.cut = function(threshold){
		var nodes;
		if(cut_opt === 'K'){
			nodes = cutByK(threshold);
		}
		//cut the tree based on the distance threshold, distance smaller than the threshold form cluster
		else if(cut_opt === 'distance'){
			nodes = cutByDist(threshold);
		}
		else{
			nodes = cutByDist(threshold);
		}
		var clusters = [];
		nodes.forEach(function(n){
			var leafNodes = getLeafNodes(n);
			var points = leafNodes.map(function(p){
				return {
					name : p.name, 
					value : {
						point : p.value.point,
						dist : p.metric
					}
				};
			});
			clusters.push({
				name : n.name,
				id : n.id,
				value : {
					points : points,
					dist : n.metric
				}
			});
		});
		return clusters;
	};

	this.pair2matrix = function(pairs){
		var ps = pairs.slice(0);
		ps.sort(function(a, b){
			return a.from.id - b.from.id;
		});

		var matrix = [];
		var maxIndex = 0;
		var name2index = d3.map();
		var to_ps = [];

		ps.forEach(function(d){
			if(!name2index.has(d.from.id))
				name2index.set(d.from.id, maxIndex++);
			if(!name2index.has(d.to.id)){
				to_ps.push(d);
			}
		});

		to_ps.forEach(function(d){
			if(!name2index.has(d.to.id)){
				name2index.set(d.to.id, maxIndex++);
			}
		});
		ps.forEach(function(d){
			var from_index = name2index.get(d.from.id);
			var to_index = name2index.get(d.to.id);
			if(!matrix[from_index]) matrix[from_index] = [];
			if(!matrix[to_index]) matrix[to_index] = [];
			matrix[from_index][to_index] = {
				'value' : d.dist,
				'from_name' : d.from.name,
				'from_id' : d.from.id,
				'to_name' : d.to.name,
				'to_id' : d.to.id
			};
			matrix[to_index][from_index] = {
				'value' : d.dist,
				'from_name' : d.to.name,
				'from_id' : d.to.id,
				'to_name' : d.from.name,
				'to_id' : d.from.id
			};
			if(!matrix[from_index][from_index]){
				matrix[from_index][from_index] = {
					'value' : 0,
					'from_name' : d.from.name,
					'from_id' : d.from.id,
					'to_name' : d.from.name,
					'to_id' : d.from.id
				};
			}
			if(!matrix[to_index][to_index]){
				matrix[to_index][to_index] = {
					'value' : 0,
					'from_name' : d.to.name,
					'from_id' : d.to.id,
					'to_name' : d.to.name,
					'to_id' : d.to.id
				};
			}
			
		});
		return matrix;
	};
	/**********************
	* Accessor functions **
	************************/
	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
	
	this.accessor = function(_){
		return (arguments.length > 0) ? (accessor = _, this) : accessor;
	};
	this.root = function(_){
		return (arguments.length > 0) ? (root = _, this) : root;
	};
	this.dist_fun = function(_){
		if(arguments.length === 0) return dist_fun;
		else if(Object.prototype.toString.call(_) === '[object String]'){
				switch(_){
					case 'min':
					dist_fun = function(R, Q){
						var A = R.children[0];
						var B = R.children[1];
						return lance_williams(R, Q, A, B, 1/2, 1/2, 0, -1/2);
					};
					break;
					case 'max':
					dist_fun = function(R, Q){
						var A = R.children[0];
						var B = R.children[1];
						return lance_williams(R, Q, A, B, 1/2, 1/2, 0, 1/2);
					};
					break;
					case 'group_average':
					dist_fun = function(R, Q){
						var A = R.children[0];
						var B = R.children[1];
						var alpha_A = A.m / (A.m + B.m);
						var alpha_B = B.m / (A.m + B.m);
						return lance_williams(R, Q, A, B, alpha_A, alpha_B, 0, 0);
					};
					break;
					case 'centroid':
					dist_fun = function(R, Q){
						var A = R.children[0];
						var B = R.children[1];
						var alpha_A = A.m / (A.m + B.m);
						var alpha_B = B.m / (A.m + B.m);
						var beta = - A.m * B.m / ((A.m + B.m) * (A.m + B.m));
						return lance_williams(R, Q, A, B, alpha_A, alpha_B, beta, 0);
					};
					break;
					case 'ward':
					dist_fun = function(R, Q){
						var A = R.children[0];
						var B = R.children[1];
						var alpha_A = (A.m + Q.m) / (A.m + B.m + Q.m); 
						var alpha_B = (B.m + Q.m) / (A.m + B.m + Q.m);
						var beta = -Q.m / (A.m + B.m + Q.m);
						return lance_williams(R, Q, A, B, alpha_A, alpha_B, beta, 0);
					};
				}
				return this;
		}
		else{
			dist_fun = _;
			return this;
		}
	};
	
	this.dist_metric = function(_){
		return (arguments.length > 0) ? (dist_metric = _, this) : dist_metric;
	};
	
	this.save_history = function(_){
		return (arguments.length > 0) ? (save_history = _, this) : save_history;
	};

	this.cut_opt = function(_){
		return (arguments.length > 0) ? (cut_opt = _, this) : cut_opt;
	};

	this.leafPairs = function(){
		return leafPairs;
	};
	
	this.topPairs = function(){
		return topPairs;
	};
	
	this.pairs = function(){
		return pairs;
	};
	
	this.history = function(){
		return history_pairs;
	};
	this.name_fun = function(_){
		return (arguments.length > 0) ? (name_fun = _, this) : name_fun;
	};

	this.data_type = function(_){
		return (arguments.length > 0) ? (data_type = _, this) : data_type;
	};
	/*
	* Using Lance Williams formula to compare clusters between node R and Q,
	* R is formed by mergin cluster A and B
	*/
	function lance_williams(R, Q, A, B, alpha_A, alpha_B, beta, gamma){
		var pairAQ = topPairMap.get(pairID(A, Q));
		var pairBQ = topPairMap.get(pairID(B, Q));
		var pairAB = topPairMap.get(pairID(A, B));
		return alpha_A * pairAQ.dist + alpha_B * pairBQ.dist + beta * pairAB.dist + gamma * Math.abs(pairAQ.dist - pairBQ.dist); 
	}
	
	function join(n1, n2){
		//new node
		var n = {
			'id' : nID,
			'children' : [n1, n2],
			'metric' : topPairMap.get(pairID(n1, n2)).dist,
			'm' : n1.m + n2.m
		};
		n.name = name_fun(n);
		//remove n1 and n2 from the the top nodes
		i = topNodes.length;
		while(i--){
			if(topNodes[i].id == n1.id || topNodes[i].id == n2.id){
				topNodes.splice(i, 1);
			}
		}
		
		//compute the new pairs for n and add the pairs to topPairs
		topNodes.forEach(function(d, i){
			var dist = dist_fun(n, d);
			topPairs.push(makePair(n, d, dist));
		});
		
		//remove the pairs related to n1 and n2
		i = topPairs.length;
		while(i--){
			if(topPairs[i].from.id == n1.id || topPairs[i].to.id == n1.id || topPairs[i].from.id == n2.id || topPairs[i].to.id == n2.id){
				topPairs.splice(i, 1);
			}
		}
		topPairs.forEach(function(d, i){
			d.index = i;
		});

		topPairs.sort(function(a, b){
			if(a.dist < b.dist){
				return -1;
			}
			else if(a.dist > b.dist){
				return 1;
			}
			else{
				return a.index - b.index;
			}
		});
		topPairMap = d3.map(topPairs, function(d){return d.id;});
		topNodes.push(n);
		++nID;
	}
	
	/*
	* get the pair id from a pair of nodes
	*/
	function pairID(n1, n2){
		return (n1.id < n2.id) ? n1.id +'-' + n2.id : n2.id + '-' + n1.id;
	}
	function makePair(n1, n2, dist){
		return (n1.id < n2.id) ? {'id' : n1.id +'-' + n2.id, 'from' : n1, 'to':n2, 'dist': dist}
			: {'id' : n2.id + '-' + n1.id, 'from' : n2, 'to' : n1, 'dist' : dist};
	}
	function getLeafNodes(r){
		var nodes = [];
		if(arguments.length === 0){
			getLeafNodesRecurse(root, nodes);
		}
		else{
			getLeafNodesRecurse(r, nodes);
		}
		return nodes;
	}
	function getLeafNodesRecurse(r, nodes){
		if(r !== null){
			if(!r.children || r.children.length === 0){
				nodes.push(r);
			}
			if(r.children){
				r.children.forEach(function(d){
					getLeafNodesRecurse(d, nodes);
				});
			}
		}
	}
	
	function cutByDist(threshold){
		var nodes = [];
		recurse(root, nodes);
		return nodes;
		function recurse(r, nodes){
			if(r !== null){
				if(r.metric <= threshold){
					nodes.push(r);
				}
				else{
					if(r.children){
						r.children.forEach(function(child){
							recurse(child, nodes);
						});
					}
				}
			}
		}
	}

	function cutByK(threshold){
		var nodes = [root];
		recurse(nodes);
		return nodes;
		function recurse(nodes){
			if(nodes.length < threshold){
				var largest_dist = -Infinity;
				var node_index = -1;
				for(var i = 0; i < nodes.length; i++){
					if(nodes[i].metric > largest_dist && nodes[i].children && nodes[i].children.length > 0){
						largest_dist = nodes[i].metric;
						node_index = i;
					}
				}
				if(node_index >= 0){
					var node = nodes[node_index];
					// console.log('node', node);
					if(node.children){
						nodes.splice(node_index, 1);
						node.children.forEach(function(n){
							nodes.push(n);
						});
					}
					recurse(nodes);
				}
			}
		}
	}
	function pairIndexOf(pair){
		
	}
}

HierachicalCluster.DATA_TYPE = {
	NODE : 'node',
	PAIR : 'pair',
	NODE_PAIR : 'node-pair'
};
dm.HierachicalCluster = HierachicalCluster;
function KMean(){
	/*
	* Data needs to be a json array of form [{name, value:{point:[1, 2, 3]}}]
	* each data point will be automatically assigned an id, which by default is the index
	*/
	var data;
	/*
	* The default accesor is value.point
	*/
	var accessor = function(d){
		return d.value.point;
	};
	/*
	* Define the maximum number of iteration
	*/
	var numIteration = null;
	/*
	* Define the stopping threshold for distance move of centroid
	*/
	var stopThreshold = 0;

	/*
	* Flag to indicate whether to save history of the kmeans algorithm
	*/
	var save_history = false;
	/*
	* Flag to indicate whether to evaluate sse for the output cluster
	*/
	var evaluate_sse = false;
	/*
	* Store the historical clusters for each iteration
	*/
	var history =[];
	/*
	* [{name:'C1', value:{centroid:[1, 2], points:[
		{
			name, value : {point}
		}
	]}}]
	*/
	var clusters;
	/*
	* Stores the sse
	*/
	var sse = null;
	/*
	* distance metric for two points, the default is Euclidean distance
	*/
	var dist_metric = function(a, b){
		var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	};
	
	var centroid_fun = function(points){
		return mean(points);
	};

	this.cluster = function(){
		//util functions
		function assign_point(d){
			var minCluster = clusters[0];
			var minDist = Number.POSITIVE_INFINITY;
			clusters.forEach(function(g){
				var point = accessor(d);
				var dist = dist_metric(point, g.value.centroid);
				if(dist < minDist){
					minDist = dist;
					minCluster = g;
				}
			});

			minCluster.value.points.push(d);
		}


		/*
		* Perform kmean clsutering algorithm
		*/
		var continue_flag = true;
		var iter = 0, i = 0;
		do{
			++iter;
			//reset all cluster points
			clusters.forEach(function(c){
				c.value.points = [];
			});

			//compute the distance of each point with the centroid and update 
			//cluster assignment
			data.forEach(assign_point);

			continue_flag = false;
			//compute the new centroid
			var c;
			for(i = 0; i < clusters.length; i++){
				c = clusters[i];
				if(c.value.points.length > 0){
					var points = c.value.points.map(accessor);
					var new_centroid = centroid_fun(points);
					//compute the distance between the new centroid and old centoid
					var dist_moved = euclidean_distance(new_centroid, c.value.centroid);
					c.value.centroid = new_centroid;
					if (dist_moved > stopThreshold) continue_flag = true;
				}
			}
			/*
			* Evaluate the final clusters
			*/
			if(evaluate_sse){
				sse = 0;
				clusters.forEach(function(d){
					var s = new Evaluation().data(d.value.points)
					.accessor(function(d){
						'use strict';
						return d.value.point;
					})
					.SSE(d.value.centroid);
					d.value.sse = s;
					sse += s;
				});
				// if(clusters.length > 0)
				// 	sse /= clusters.length;
			}

			//save the cluster as history
			if(save_history){
				history.push(JSON.parse(JSON.stringify(clusters)));
			}

			//decide whether to continue
			if(numIteration && iter >= numIteration){
				continue_flag = false;
			}
		} while(continue_flag);
		return this;
	};
	
	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
	
	this.accessor = function(_){
		return (arguments.length > 0) ? (accessor = _, this) : accessor;
	};
	
	this.dist_metric = function(_){
		return (arguments.length > 0) ? (dist_metric = _, this) : dist_metric;
	};

	this.clusters = function(_){
		return (arguments.length > 0) ? (clusters = _, this) : clusters;
	};
	this.numIteration = function(_){
		return (arguments.length > 0) ? (numIteration = _, this) : numIteration;
	};
	this.stopThreshold = function(_){
		return (arguments.length > 0) ? (stopThreshold = _, this) : stopThreshold;
	};
	this.save_history = function(_){
		return (arguments.length > 0) ? (save_history = _, this) : save_history;
	};
	this.evaluate_sse = function(_){
		return (arguments.length > 0) ? (evaluate_sse = _, this) : evaluate_sse;
	};
	this.centroid_fun = function(_){
		if(arguments.length === 0){
			return centroid_fun;
		}
		else if(Object.prototype.toString.call(_) === '[object String]'){
			switch(_){
				case 'mean' : 
					centroid_fun = mean;
					break;
				case 'median':
					centroid_fun = median;
					break;
				default:
					centroid_fun = mean;
			}
			return this;
		}
		else{
			centroid_fun = _;
			return this;
		}
	};

	this.history = function(){
		return history;
	};
	this.sse = function(){
		return sse;
	};

	function euclidean_distance(a, b){
		var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	}

	function mean(v){
		var sum, i, j;
		if(v.length === 0){
			return 0;
		}
		else if(isArray(v[0])){
			sum = Array(v[0].length).fill(0);
			for(i = 0; i < v.length; i++){
				for(j = 0; j < v[i].length; j++){
					sum[j] += v[i][j];
				}
			}
			return sum.map(function(d){return d/v.length;});
		}
		else{
			sum = 0;
			for(i =0; i < v.length; i++){
				sum += v[i];
			}
			return sum / v.length;
		}
	}

	function median(v){
		var vv;
		if(v.length === 0){
			return 0;
		}
		else if(isArray(v[0])){
			vv = v.slice(0);
			//TODO: implement the incremental estimation of median
		}
		else{
			vv = v.slice(0);
			vv.sort(function(a, b){return a - b;});
			return vv[vv.length / 2];
		}
	}
}

dm.KMean = KMean;
function SparseVector(indices, values, size){
	var self = this;
	//init the indices
	if(indices)
		this.indices = indices;
	else
		this.indices = [];
	//init the values
	if(values)
		this.values = values;
	else 
		this.values = [];
	
	//init the size
	if(size)
		this.size = size;
	else if(this.indices.length === 0){
		this.size = 0;
	}
	else{
		this.size = this.indices[this.indices.length -1] + 1;
	}
		
	
	/*
	 * get the dense vector array from the sparse vector
	 */
	this.toDenseVector = function(){
		var vec = [];
		for(var i = 0; i < this.size; i++){
			vec[i] = this.getValue(i);
		}
		return vec;
	};
	/*
	 * Set the value of item in array given the index of value
	 */
	this.setValue = function(index, value){
		var location = this.locationAtIndex(index);
		if(location >= 0){
			this.values[location] = value;
		}
		else if(location === -Infinity){
			if(index >= this.size)
				this.size = index + 1;
			this.indices.splice(0, 0, index);
			this.values.splice(0, 0, value);
		}
		else{
			if(index >= this.size){
				this.size = index + 1;
			}
			this.indices.splice(-location, 0, index);
			this.values.splice(-location, 0, value);
		}
	};
	/*
	 * Compute the difference of two sparse vectors
	 */
	this.diff = function(other) {
		'use strict';
		var indices = mergeArray(self.indices, other.indices);
		var values = [];
		indices.forEach(function(d, i){
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if(location >= 0 && otherLocation >= 0){
				values[i] = self.values[location] - other.values[otherLocation];
			}
			else if(location >= 0){
				values[i] = self.values[location];
			}
			else if(otherLocation >= 0){
				values[i] = -other.values[otherLocation];
			}
		});

		return new SparseVector(indices, values, Math.max(self.size, other.size));
	};
	
	/*
	 * Compute the sum of two sparse vectors
	 */
	this.sum = function(other) {
		'use strict';
		var indices = mergeArray(self.indices, other.indices);
		var values = [];
		indices.forEach(function (d, i) {
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if(location >= 0 && otherLocation >= 0){
				values[i] = self.values[location] + other.values[otherLocation];
			}
			else if(location >= 0){
				values[i] = self.values[location];
			}
			else if(otherLocation >= 0){
				values[i] = other.values[otherLocation];
			}
		});
		return new SparseVector(indices, values, Math.max(self.size, other.size));
	};
	
	/*
	 * Compute the L2 norm of two sparse vectors
	 */
	this.L2norm = function(){
		'use strict';
		var sq = self.values.reduce(function(pre, cur, ind) {
			return pre + cur*cur;
		}, 0);
		
		return Math.sqrt(sq);
	};
	
	/*
	 * Compute the dot product between two sparse vectors
	 */
	this.dotp = function(other) {
		var r = 0;
		var indSet = new Set();
		self.indices.forEach(function (d) {
			indSet.add(d);
		});
		
		other.indices.forEach(function (d) {
			indSet.add(d);
		});
		
		indSet.forEach(function (d) {
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if(location >= 0 && otherLocation >= 0){
				r += self.values[location] * other.values[otherLocation];
			}
		});
		return r;
	};
	
	/*
	 * find the location of an index in an array 
	 * 	if found, return the location
	 * 	if not found, return the negated would be location:
	 *   - the location of largest index of smaller indexes - 1  
	 */
	this.locationAtIndex = function(index) {
		return binaryIndexOf(index, self.indices);
	};
	
	/*
	 * find the index of a given location 
	 */
	this.indexAtLocation = function(location) {
		return self.indices[location];
	};
	
	/*
	 * Get the value of item by index
	 */
	this.getValue = function(index) {
		var location = self.locationAtIndex(index);
		var value = self.values[location];
		if(value)
			return self.values[location];
		else
			return 0;
	};
	
	/*
	 * Compute the Cosine similarity of two sparse vectors
	 */
	this.cosineSimilarity = function(other) {
		return self.dotp(other) / (self.L2norm() * other.L2norm());
	};
	
	/*
	 * find the location of an item in an array 
	 * 	if found, return the location
	 * 	if not found, return the negated would be location:
	 *   location = - location of largest item smaller than the item - 1  
	 *   if the would be location happened to be zero, return -Infinity
	 */
	function binaryIndexOf(searchElement, array) {
	    'use strict';
	    var minIndex = 0;
	    var maxIndex = array.length - 1;
	    var currentIndex;
	    var currentElement;
	 
	    while (minIndex <= maxIndex) {
	        currentIndex = (minIndex + maxIndex) / 2 | 0;
	        currentElement = array[currentIndex];
	 
	        if (currentElement < searchElement) {
	            minIndex = currentIndex + 1;
	        }
	        else if (currentElement > searchElement) {
	            maxIndex = currentIndex - 1;
	        }
	        else {
	            return currentIndex;
	        }
	    }
	 
	    return (minIndex === 0) ? -Infinity : -minIndex;
	}
	
	/*
	 * Merge two sorted arrays
	 */
	function mergeArray(a, b) {
		var r = [];
		var i=0, j=0, k=0;
		while(i < a.length && j < b.length){
			if(a[i] < b[j]){
				r[k] = a[i];
				++i;
				++k;
			}
			else if(a[i] > b[j]){
				r[k] = b[j];
				++j;
				++k;
			}
			else{
				r[k] = a[i];
				++i;
				++j;
				++k;
			}
		}
		
		while(i < a.length){
			r[k] = a[i];
			++i;
			++k;			
		}
		
		while(j < b.length){
			r[k] = b[j];
			++j;
			++k;
		}
		return r;
	}
}

dm.SparseVector = SparseVector;
function corr(v){
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		var SIGMA = cov(v);
		var standard_dev = std(v);
		for(var i = 0 ; i < SIGMA.length; i++){
			for(var j = 0; j < SIGMA.length; j++){
				if(standard_dev[i] === standard_dev[j] === 0){
					SIGMA[i][j] = 1;
				}
				else if(standard_div[i] === 0 || standard_dev[j] === 0){
					SIGMA[i][j] = 0;
				}
				else{
					SIGMA[i][j] /= (standard_dev[i] * standard_dev[j]);
				}
			}
		}
		return SIGMA;
	}
	else{
		return std(v);
	}
}

/*
* Compute the covariance matrix of data points a and b
* both a and b are matrix in which the rows represent the data points and
* the columns represent the attributes
* the matrix is in the form of array of array[[data point],[data point],[data point]...]
*/
function cov(v){
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		var m = mean(v);
		var matrix = Array(v[0].length).fill(Array(v[0].length).fill(0));
		for(var i = 0; i < v[0].length; i++){
			for(var j = 0; j < v[0].length; j++){
				var sum = 0;
				for(var k = 0; k < v.length; k++){
					sum += (v[k][i] - m[i]) * (v[k][j] - m[j]);
				}
				matrix[i][j] = sum / v.length;
			}
		}
		return matrix;
	}
	else{
		return variance(v);
	}
}

function variance(v){
	var m, sum, i, j;
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		m = mean(v);
		sum = Array(v[0]).fill(0);
		for(i = 0; i < v.length; i++){
			for(j = 0; j < v[i].length; j++){
				sum[j] += (v[i][j] - m[j]) * (v[i][j] - m[j]); 
			}
		}
		return sum.map(function(d){return d/v.length;});
	}
	else{
		m = mean(v);
		sum = 0;
		for(i = 0; i < v.length;i++){
			sum += (v[i] - m) * (v[i] - m);
		}
		return sum / v.length;
	}
}

function mean(v){
	var sum, i, j;
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		sum = Array(v[0].length).fill(0);
		for(i = 0; i < v.length; i++){
			for(j = 0; j < v[i].length; j++){
				sum[j] += v[i][j];
			}
		}
		return sum.map(function(d){return d/v.length;});
	}
	else{
		sum = 0;
		for(i =0; i < v.length; i++){
			sum += v[i];
		}
		return sum / v.length;
	}
}

function std(v){
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		return variance(v).map(function(d){
			return Math.sqrt(d);
		});
	}
	else{
		return Math.sqrt(variance(v));
	}
}

function L1_norm(v){
	if(v.length === 0) return 0;
	return v.reduce(function(pre, cur, ind){
		return pre + Math.abs(cur);
	}, 0);
}

function L2_norm(v){
	if(v.length === 0) return 0;
	var sum = v.reduce(function(pre, cur, ind){
		return pre + cur * cur;
	}, 0);

	return Math.sqrt(sum);
}

function dotp(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += a[i] * b[i];
	}
	return sum;
}

function mult_m(a, b){
	
}

//find inverse of matrix m
function inv_m(m){
	
}

dm.corr = corr;
dm.cov = cov;
dm.variance = variance;
dm.mean = mean;
dm.std = std;
dm.L1_norm = L1_norm;
dm.L2_norm = L2_norm;
dm.dotp = dotp;
dm.mult_m = mult_m;
function isArray(v){
	return Object.prototype.toString.call(v) === '[object Array]';
}

dm.isArray = isArray;
function queue() {
	var a = [],
	b = 0;

	var Q = {
		len : len,
		empty : empty,
		enqueue : enqueue,
		dequeue : dequeue,
		peek : peek
	};

	function len() {
		return a.length - b;
	}
	
	function empty() {
		return 0 == a.length;
	}
	
	function enqueue(b) {
		a.push(b);
	}
	
	function dequeue() {
		if (0 != a.length) {
			var c = a[b];
			2 * ++b >= a.length && (a = a.slice(b), b = 0);
			return c;
		}
	}
	function peek () {
		return 0 < a.length ? a[b] : void 0;
	}

	return Q;
}

dm.queue = queue;
return dm;