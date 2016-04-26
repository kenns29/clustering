function DrawMatrix(){
	/*
	* Data needs to be the following format : 
	* [[{'value' : 0,
		'from_name' : '',
		'from_id' : '',
		'to_name' : '',
		'to_id' : ''}, {} ....], 
	  [...]]
	*/
	var data;
	var container;
	var width;
	var height;
	var W;
	var H;
	var margin = {right:10, left:10, bottom:20, top:50};
	/*
	* Default Matrix row and cell class as accessor
	*/
	var row_class = 'matrix-row';
	var cell_class = 'matrix-cell';

	this.draw = function(){
		console.log(row_class);
		console.log(cell_class);
		width = $('#' + container).width();
		height = $('#' + container).height();
		var W = width - margin.left - margin.right;
		var H = width - margin.top - margin.bottom;
	
		var cell_width = W / data[0].length;
		var cell_height = H / data.length;
		
		var svg = d3.select('#' + container).append('svg')
		.attr('width', width).attr('height', height);
		
		
		var matrix_g = svg.append('g').attr('transform', function(d, i){
			return 'translate(' + [margin.left, margin.top] + ')';
		});
		
		var rowSel = matrix_g.selectAll('.' + row_class)
		.data(data);
		
		var rowEnter = rowSel.enter().append('g')
		.attr('class', row_class)
		.attr('transform', function(d, i){
			return 'translate(' + [cell_width * i, 0] + ')';
		});
		
		var cellSel = rowEnter.selectAll('.' + cell_class)
		.data(function(d, i){
			return d;
		});
		
		var cellEnter = cellSel.enter().append('g')
		.attr('class', cell_class)
		.attr('transform', function(d, i){
			return 'translate(' + [0, cell_height * i] + ')';
		});
		
		cellEnter.append('rect')
		.attr('fill', 'none')
		.attr('width', cell_width)
		.attr('height', cell_height)
		.attr('stroke', 'black')
		.attr('stroke-width', 1);
		
		cellEnter.append('text')
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'middle')
		.attr('x', cell_width / 2)
		.attr('y', cell_height / 2)
		.attr('font-size', 20)
		.text(function(d, i){
			return d3.round(d.value, 2);
		});
		
		var col_label_g = svg.append('g')
		.attr('transform', function(d, i){
			return 'translate(' + [0, margin.top] + ')';
		});
		
		col_label_g.selectAll('text').data(data[0]).enter().append('text')
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'baseline')
		.attr('font-size', 15)
		.attr('fill', 'black')
		.attr('x', function(d, i){
			return i * cell_width + 0.5 * cell_width;
		})
		.attr('y', -3)
		.text(function(d, i){return d.to_name;});
		
		var row_label_g = svg.append('g')
		.attr('transform', function(d, i){
			return 'translate(' + [margin.left, margin.top] + ')';
		});
		
		row_label_g.selectAll('text').data(data).enter().append('text')
		.attr('text-anchor', 'end')
		.attr('dominant-baseline', 'middle')
		.attr('font-size', 15)
		.attr('fill', 'black')
		.attr('x', -3)
		.attr('y', function(d, i){
			return i * cell_height + 0.5 * cell_height;
		})
		.text(function(d, i){
			return d[0].from_name;
		});
	};
	
	this.data = function(_){
		return (arguments.length > 0) ? (data = _, this) : data;
	};
	
	this.container = function(_){
		return (arguments.length > 0) ? (container = _, this) : container;
	};
	
	this.row_class = function(_){
		return (arguments.length > 0) ? (row_class = _, this) : row_class;
	};

	this.cell_class = function(_){
		return (arguments.length > 0) ? (cell_class = _, this): cell_class;
	};
}