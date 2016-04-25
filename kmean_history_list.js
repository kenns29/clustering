function kmean_history_list(history){
	var liSel = d3.select('#kmean-printout-container').selectAll('li')
	.data(history);

	var liEnter = liSel.enter().append('li')
	.attr('class', 'list-group-item');

	var clusterSel = liEnter.selectAll('p')
	.data(function(d){return d;});

	var clusterEnter = clusterSel.enter().append('p')
	.html(function(d){
		console.log('d', d);
		var name = d.name;
		var centroid = d.value.centroid.reduce(function(pre, cur, ind){
			if(pre == ''){
				return pre + cur;
			}
			else{
				return pre + ',' + cur;
			}
		}, '');

		var points = d.value.points.reduce(function(pre, cur, ind){
			if(pre == ''){
				return pre + cur.name;
			}
			else{
				return pre + ',' + cur.name;
			}
		}, '');
		return 'cluster_name: ' + name + '<br/> centroid: ' + centroid +'<br/> points: ' + points; 
	})
}