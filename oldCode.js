this.pairToMatrix = function(pairs){
	var matrix = [];
	pairs.forEach(function(d){
		if(!matrix[d.from.id]) matrix[d.from.id] = [];
		if(!matrix[d.to.id]) matrix[d.to.id] = [];
		matrix[d.from.id][d.to.id] = {
			'value' : d.dist,
			'from_name' : d.from.name,
			'from_id' : d.from.id,
			'to_name' : d.to.name,
			'to_id' : d.to.id
		};
		matrix[d.to.id][d.from.id] = {
			'value' : d.dist,
			'from_name' : d.to.name,
			'from_id' : d.to.id,
			'to_name' : d.from.name,
			'to_id' : d.from.id
		};
		if(!matrix[d.from.id][d.from.id]){
			matrix[d.from.id][d.from.id] = {
				'value' : 0,
				'from_name' : d.from.name,
				'from_id' : d.from.id,
				'to_name' : d.from.name,
				'to_id' : d.from.id
			};
		}
		if(!matrix[d.to.id][d.to.id]){
			matrix[d.to.id][d.to.id] = {
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
