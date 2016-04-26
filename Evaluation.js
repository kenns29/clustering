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
		if(arguments.length == 0){
			var m = mean(dat);
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