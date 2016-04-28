function kmean_output_display(cluster){
	var liSel = d3.select('#kmean-printout-container').selectAll('li')
	.data(cluster.history());

	var liEnter = liSel.enter().append('li')
	.attr('class', 'list-group-item');

	var clusterSel = liEnter.selectAll('p')
	.data(function(d){return d;});

	var clusterEnter = clusterSel.enter().append('p')
	.html(function(d){
		var name = d.name;
		var centroid = d.value.centroid.reduce(function(pre, cur, ind){
			if(pre == ''){
				return pre + d3.round(cur, 2);
			}
			else{
				return pre + ', ' + d3.round(cur, 2);
			}
		}, '');

		var points = d.value.points.reduce(function(pre, cur, ind){
			if(pre == ''){
				return pre + cur.name;
			}
			else{
				return pre + ', ' + cur.name;
			}
		}, '');
		return 'cluster_name: ' + name + '<br/> centroid: ' + centroid +'<br/> points: ' + points + '<br/> sse: ' + d3.round(d.value.sse, 2);
	});

	if(cluster.sse())
		d3.select('#kmean-printout-container').append('li')
		.attr('class', 'list-group-item')
		.html('total sse: ' + d3.round(cluster.sse(), 2));
}