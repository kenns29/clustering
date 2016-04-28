function DrawTree(){
	var data;
	var container;
	var width;
	var height;
	var W;
	var H;
	var margin = {top : 10, bottom: 50, left:10, right: 10};
	this.draw = function(){
		var width = $('#' + container).width();
		var height = $('#' + container).height();
		W = width - margin.left - margin.right;
		H = height - margin.top - margin.bottom;
		
		var circle_size = 20;
		var svg = d3.select('#' + container).append('svg')
		.attr('width', width)
		.attr('height', height);
		
		var tree_g = svg.append('g')
		.attr('transform', function(){
			return 'translate(' + [margin.left, margin.top] +')';
		});
		
		var layout = d3.layout.cluster().size([W, H]);
		var nodes = layout.nodes(data);
		var links = layout.links(nodes);
		
		var diagonal = d3.svg.diagonal()
		.projection(function(d) { 
			return [d.x, d.y]; 
		});
		var linkSel = tree_g.selectAll('.link')
		.data(links);
		
		var linkEnter = linkSel
		.enter()
		.append('path')
		.attr('class', 'link')
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'none')
		.attr('d', function(d){
			return diagonal(d);
		});

		var nodeSel = tree_g.selectAll('g.node')
		.data(nodes, function(d){return d.id;});
		
		var nodeEnter = nodeSel.enter().append('g')
		.attr('class', 'node')
		.attr('transform', function(d, i){
			return 'translate(' + [d.x, d.y] + ')'; 
		});
		
		nodeEnter.append('circle')
		.attr('cx', 0).attr('cy', 0).attr('r', circle_size / 2)
		.attr('fill', 'white')
		.attr('stroke', 'black').attr('stroke-width', 1);
		
		nodeEnter.append('text')
		.attr('font-size', circle_size * 3 / 4)
		.attr('dominant-baseline', 'middle')
		.attr('text-anchor', 'middle')
		.text(function(d){
			return d.name;
		})

		nodeEnter.filter(function(d){
			return (!d.children) || (d.children.length == 0);
		})
		.append('text')
		.attr('text-anchor', 'middle')
		.attr('dominant-baseline', 'hanging')
		.attr('y', circle_size /2 + 4)
		.attr('font-size', 10)
		.text(function(d){
			return d.name;
		});
		
		// nodeEnter.filter(function(d){
			// return (!d.children) || (d.children.length == 0);
		// })
		// .append('text')
		// .attr('text-anchor', 'middle')
		// .attr('dominant-baseline', 'hanging')
		// .attr('y', 20)
		// .attr('font-size', 10)
		// .text(function(d){
			// return d.value.point.reduce(function(pre, cur, ind){
				// return (pre == '') ? cur : pre + ',' + cur;
			// }, '');
		// });
		
		
		nodeEnter.filter(function(d){
			return (d.children) && (d.children.length > 0)
		})
		.append('text')
		.attr('text-anchor', 'start')
		.attr('dominant-baseline', 'middle')
		.attr('x', circle_size / 2 + 4)
		.attr('font-size', 10)
		.text(function(d){
			return d3.round(d.metric, 4);
		});
		
	};
	
	this.data = function(_){
		return arguments.length > 0 ? (data = _, this) : data;
	};
	
	this.container = function(_){
		return arguments.length > 0 ? (container = _, this) : container;
	};
	
	this.width = function(_){
		return arguments.length > 0 ? (width = _, this) : width;
	};
	
	this.height = function(_){
		return arguments.length > 0 ? (height = _, this) : height;
	};
}