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