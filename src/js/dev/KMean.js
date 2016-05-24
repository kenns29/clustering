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