function DrawMatrixHistory(){
	var container;
	var cluster;

	this.draw = function(){
		var history = cluster.history();
		
		history.forEach(function(h, i){
			var matrix_container = 'matrix-history-' + i;
			var div = d3.select('#' + container) 
			.append('li')
			.attr('class', 'list-group-item')
			.append('div')
			.style('width', '500px')
			.style('height', '500px')
			.attr('id', matrix_container);

			var matrix = cluster.pair2matrix(h);
			new DrawMatrix().data(matrix).container(matrix_container)
			.row_class(matrix_container + '-row')
			.cell_class(matrix_container + '-cell')
			.draw();
		});
	};

	this.container = function(_){
		return (arguments.length > 0) ? (container = _, this) : container;
	};

	this.cluster = function(_){
		return (arguments.length > 0) ? (cluster = _, this) : container;
	};
}