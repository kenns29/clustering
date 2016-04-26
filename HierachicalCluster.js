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
	* Data needs to be a json array of form [{name, value:{point:[1, 2, 3]}}]
	* each data point will be automatically assigned an id, which by default is the index
	*/
	var data;
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
	
	/*
	* root has the following format:
	* {id: 0, value:{point:[]}, children:[], m:10, metric:1.1}
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
		/*
		* Init leaf nodes
		*/
		nodes = data.map(function(d, i){
			return {
				'id' : i,
				'name' : d.name,
				'value':{
					'point' : accessor(d)
				},
				'm' : 1
			};
		});
		topNodes = nodes.slice(0);
		
		nID = nodes.length;
		/*
		* Init pairs
		*/
		for(var i = 0; i < nodes.length; i++){
			var p1 = nodes[i].value.point;
			for(var j = i+1; j < nodes.length; j++){
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
		topPairs.sort(function(a, b){
			return a.dist - b.dist;
		});
		topPairMap = d3.map(topPairs, function(d){
			return d.id;
		});
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
	
	// this.pairToMatrix = function(pairs){
	// 	var matrix = [];
	// 	pairs.forEach(function(d){
	// 		if(!matrix[d.from.id]) matrix[d.from.id] = [];
	// 		if(!matrix[d.to.id]) matrix[d.to.id] = [];
	// 		matrix[d.from.id][d.to.id] = {
	// 			'value' : d.dist,
	// 			'from_name' : d.from.name,
	// 			'from_id' : d.from.id,
	// 			'to_name' : d.to.name,
	// 			'to_id' : d.to.id
	// 		};
	// 		matrix[d.to.id][d.from.id] = {
	// 			'value' : d.dist,
	// 			'from_name' : d.to.name,
	// 			'from_id' : d.to.id,
	// 			'to_name' : d.from.name,
	// 			'to_id' : d.from.id
	// 		};
	// 		if(!matrix[d.from.id][d.from.id]){
	// 			matrix[d.from.id][d.from.id] = {
	// 				'value' : 0,
	// 				'from_name' : d.from.name,
	// 				'from_id' : d.from.id,
	// 				'to_name' : d.from.name,
	// 				'to_id' : d.from.id
	// 			};
	// 		}
	// 		if(!matrix[d.to.id][d.to.id]){
	// 			matrix[d.to.id][d.to.id] = {
	// 				'value' : 0,
	// 				'from_name' : d.to.name,
	// 				'from_id' : d.to.id,
	// 				'to_name' : d.to.name,
	// 				'to_id' : d.to.id
	// 			};
	// 		}
			
	// 	});
	// 	return matrix;
	// };

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
		if(arguments.length == 0) return dist_fun;
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
		var i = topPairs.length;
		while(i--){
			if(topPairs[i].from.id == n1.id || topPairs[i].to.id == n1.id || topPairs[i].from.id == n2.id || topPairs[i].to.id == n2.id){
				topPairs.splice(i, 1);
			}
		}
		topPairs.sort(function(a, b){return a.dist - b.dist;});
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
		nodes = [];
		getLeafNodesRecurse(r, nodes);
		return nodes;
	}
	function getLeafNodesRecurse(r, nodes){
		if(r != null){
			if(r.children.length == 0){
				nodes.add(r);
			}
			r.children.forEach(function(d){
				getLeafNodesRecurse(d, nodes);
			});
		}
	}
	
	function pairIndexOf(pair){
		
	}
}