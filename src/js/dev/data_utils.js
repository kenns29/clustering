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

