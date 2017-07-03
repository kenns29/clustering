import {array2map} from './utils.js';
export default function(){
	return new HierachicalCluster();
};
export function HierachicalCluster(){
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
	//option for cutting the tree
	var cut_opt = 'distance';
	//option for normalizing the distance
	var normalize_distance = false;
	var normalize_domain = null;
	var normalize_range = null;
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
			nodes = data.map(function(d,i){
				var node = d;
				node.id = i;
				node.value.point = accessor(node),
				node.m = 1;
				node.metric = 0;
				return node;
			});
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
			if(normalize_distance){
				normalizePairs(pairs, normalize_domain ,normalize_range);
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
			topPairMap = array2map(topPairs, function(d){
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
		var name2index = new Map();
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
	this.normalize_distance = function(_){
		return (arguments.length > 0) ? (normalize_distance = _, this) : normalize_distance;
	};
	this.normalize_domain = function(_){
		return (arguments.length > 0) ? (normalize_domain = _, this) : normalize_domain;
	};
	this.normalize_range = function(_){
		return (arguments.length > 0) ? (normalize_range = _, this) : normalize_range;
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
		var i;
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
		topPairMap = array2map(topPairs, function(d){return d.id;});
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
	function distanceExtent(pairs){
		var max = -Infinity, min = Infinity;
		pairs.forEach(function(pair){
			max = Math.max(max, pair.dist);
			min = Math.min(min, pair.dist);
		});
		return [min, max];
	}
	function normalizeDist(dist, domain, range){
		if(domain[0] === domain[1]) return dist;
		return range[0]
		+ (range[1] - range[0])/(domain[1] - domain[0])
		* (dist - domain[0]);
	}
	function normalizePairs(pairs, _domain, _range){
		let domain, range = [0,1], extent;
		if(_domain){
			if(_domain[0] != null && _domain[1] != null){
				domain = _domain;
			}
			else if(_domain[0] != null){
				extent = distanceExtent(pairs);
				domain = [_domain[0], extent[1]];
			}
			else if(_domain[1] != null){
				extent = distanceExtent(pairs);
				domain = [extent[0], _domain[1]];
			}
		} else {
			domain = distanceExtent(pairs);
		}
		if(_range) range = _range;
		pairs.forEach(function(pair){
			pair.orig_dist = pair.dist;
			pair.dist = normalizeDist(pair.dist, domain, range);
		});
		return pairs;
	}
	function pairIndexOf(pair){}
};

HierachicalCluster.DATA_TYPE = {
	NODE : 'node',
	PAIR : 'pair',
	NODE_PAIR : 'node-pair'
};