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
	* Store the historical clusters for each iteration
	*/
	var history =[];
	/*
	* [{name:'C1', value:{centroid:[1, 2], points:[]}}]
	*/
	var clusters;
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
	
	
	this.cluster = function(){
		var continue_flag = true;
		var iter = 0;
		do{
			++iter;
			//reset all cluster points
			clusters.forEach(function(c){
				c.value.points = [];
			});

			//compute the distance of each point with the centroid and update 
			//cluster assignment
			data.forEach(function(d){
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
			});

			continue_flag = false;
			//compute the new centroid
			clusters.forEach(function(c){
				if(c.value.points.length > 0){
					var new_centroid = accessor(c.value.points[0]).slice(0);
					for(var i = 1; i < c.value.points.length; i++){
						for(var j = 0; j < new_centroid.length; j++){
							var point = accessor(c.value.points[i]);
							new_centroid[j] += point[j];
						}
					}
					//calc the new centroid
					new_centroid = new_centroid.map(function(d){
						return d/ c.value.points.length;
					});

					var dist_moved = euclidean_distance(new_centroid, c.value.centroid);
					c.value.centroid = new_centroid;
					if (dist_moved > stopThreshold) continue_flag = true;
				}
			});

			if(save_history){
				history.push(JSON.parse(JSON.stringify(clusters)));
			}

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
	this.history = function(){
		return history;
	};


	function euclidean_distance(a, b){
		var sum = 0;
		for(var i = 0; i < a.length; i++){
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	}
}