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

	this.centroid_of_all_points = function(){
		var centroid = null;
		var numPoints = 0;
		data.forEach(function(d){
			var points = points_accessor(d);
			numPoints += points.length;
			points.forEach(function(g){
				if(!centroid){
					centroid = point_accessor(g).map(function(){return 0;})
				}
				centroid.forEach(function(h, i){
					h+= point[i];
				});
			});
		});
		centroid.forEach(function(d){
			d /= numPoints;
		});
		return centroid;
	};

	this.WSS = function(){
		var sum = 0;
		data.forEach(function(d){
			var points = points_accessor(d);
			var centroid = centroid_accessor(d);
			if(centroid === null || centroid === undefined){
				var sse = new Evaluation().data(points).accessor(point_accessor).SSE();
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
			if(points.length == 0){
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
					centroid.forEach(function(g){
						g /= points.length;
					});
				}

				sum += points.length * euclidean_distance_square(centroid, data_centroid);
			}
		});
		return sum;
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