$(document).ready(function(){
	// draw_hierachical_with_binary_data();
	// draw_hierachical_with_continous_data();
	// draw_hierachical_with_two_points();
	// draw_kmean_with_euclidean();
	// matrix_template();
	// evaluation_template();
	sparseVectorTest();
});
/*
* Euclidean distance example
*/
function draw_hierachical_with_continous_data(){
	var cluster = new HierachicalCluster()
	.data([{
		name : '1',
		value : {
			point : [0.4, 0.53]
		}
	},
	{
		name : '2',
		value: {
			point : [0.22, 0.38]
		}
	},
	{
		name : '3',
		value: {
			point : [0.35, 0.32]
		}
	},
	{
		name : '4', 
		value : {
			point : [0.26, 0.19]
		}
	},
	{
		name : '5',
		value : {
			point : [0.08, 0.41]
		}
	},
	{
		name : '6',
		value : {
			point : [0.45, 0.30]
		}
	}])
	.dist_metric(tanimoto_distance)
	.dist_fun('centroid')
	.save_history(true)
	.init()
	.cluster();
	
	new DrawTree().container('tree-container').data(cluster.root()).draw();
	
	var matrix = cluster.pair2matrix(cluster.leafPairs());
	new DrawMatrix().data(matrix).container('matrix-container').draw();
	new DrawMatrixHistory().container('matrix-history-container').cluster(cluster).draw();

	var clustering = cluster.cut_opt('K').cut(3);
	// output(pretty_print(clustering));

	var silhouette = new ClusterEvaluation().data(clustering).silhouette_coefficient();
	// output(pretty_print(silhouette));
}

/*
* Jaccard distance example
*/
function draw_hierachical_with_binary_data(){
		var cluster = new HierachicalCluster()
	.data([{
		name : '1',
		value : {
			point : [1, 0, 0, 1, 0, 0]
		}
	},
	{
		name : '2',
		value: {
			point : [0, 1, 0, 1, 0, 0]
		}
	},
	{
		name : '3',
		value: {
			point : [0, 0, 0, 1, 0, 1]
		}
	},
	{
		name : '4', 
		value : {
			point : [0, 1, 0, 1, 0, 0]
		}
	},
	{
		name : '5',
		value : {
			point : [0, 0, 0, 1, 0, 0]
		}
	},
	{
		name : '6',
		value : {
			point : [0, 0, 0, 1, 0, 0]
		}
	}])
	.save_history(true)
	.dist_metric(jaccard_distance)
	.dist_fun('group_average')
	.init()
	.cluster();
	
	new DrawTree().container('tree-container').data(cluster.root()).draw();
	
	var matrix = cluster.pair2matrix(cluster.leafPairs());
	new DrawMatrix().data(matrix).container('matrix-container').draw();
	new DrawMatrixHistory().container('matrix-history-container').cluster(cluster).draw();

	var clustering = cluster.cut_opt('K').cut(3);
}

function draw_kmean_with_euclidean(){
	var cluster = new KMean()
	.data([{
		name : '1',
		value : {
			point : [1, 1]
		}
	},
	{
		name : '2',
		value: {
			point : [1.5, 2.0]
		}
	},
	{
		name : '3',
		value: {
			point : [3, 4]
		}
	},
	{
		name : '4', 
		value : {
			point : [5, 7]
		}
	},
	{
		name : '5',
		value : {
			point : [3.5, 5]
		}
	},
	{
		name : '6',
		value : {
			point : [4.5, 5]
		}
	},
	{
		name : '7',
		value : {
			point : [3.5, 4.5]
		} 
	}
	])
	.clusters([
		{
			'name' : 'C1',
			'value' : {
				'centroid' : [1, 1]
			}
		},
		{
			'name' : 'C2',
			'value' : {
				'centroid' : [5, 7]
			}
		}
	])
	.evaluate_sse(true)
	.save_history(true)
	.stopThreshold(0)
	.accessor(function(d){return d.value.point;})
	.centroid_fun('mean')
	.numIteration(4)
	.dist_metric(euclidean_distance)
	.cluster();

	var clusters = cluster.clusters();
	var wss = new ClusterEvaluation().data(clusters).WSS();
	var bss = new ClusterEvaluation().data(clusters).BSS();
	var history = cluster.history();
	
	kmean_output_display(cluster);
}

function evaluation_template(){
	output("############# Hierachical #######################")
	var points = array2points([
			[0.4, 0.53],
			[0.22, 0.38],
			[0.35, 0.32],
			[0.26, 0.19],
			[0.08, 0.41],
			[0.45, 0.30]
		]);


	output('Hierachical cluster points')
	output(pretty_print(points));
	var cluster = new HierachicalCluster()
	.data(points)
	.dist_metric(euclidean_distance)
	.dist_fun('centroid')
	.save_history(true)
	.init()
	.cluster();
	
	var clustering = cluster.cut_opt('K').cut(3);

	var cev = new ClusterEvaluation().data(clustering);

	output('Hierachical cluster')
	output(pretty_print(clustering));


	cev = new ClusterEvaluation().data(clustering)
	.silhouette_dist_metric(euclidean_distance);

	output('wss')
	output(cev.WSS());
	output('bss')
	output(cev.BSS());
	output('tss')
	output(cev.TSS());
	output('silhouette');
	output(pretty_print(cev.silhouette_coefficient()));
	
	
	/*
	* Clustering
	*/
	output("############# KMEAN #######################")
	points = array2points([
			[1, 1],
			[1.5, 2],
			[3, 4],
			[5, 7],
			[3.5, 5],
			[4.5, 5],
			[3.5, 4.5]
		]);
	var kmean_cluster = new KMean()
	.data(points)
	.clusters([
		{
			'name' : 'C1',
			'value' : {
				'centroid' : [1, 1]
			}
		},
		{
			'name' : 'C2',
			'value' : {
				'centroid' : [5, 7]
			}
		}
	])
	.evaluate_sse(true)
	.save_history(true)
	.stopThreshold(0)
	.accessor(function(d){return d.value.point;})
	.centroid_fun('mean')
	.dist_metric(euclidean_distance)
	.cluster();

	clustering = kmean_cluster.clusters();
	output('kmean cluster points')
	output(pretty_print(points));
	output('kmean cluster')
	output(pretty_print(clustering));


	cev = new ClusterEvaluation().data(clustering)
	.silhouette_dist_metric(euclidean_distance);

	output('wss')
	output(cev.WSS());
	output('bss')
	output(cev.BSS());
	output('tss')
	output(cev.TSS());
	output('silhouette');
	output(pretty_print(cev.silhouette_coefficient()));
	/*
	* Evaluate with arbitary cluster
	*/
	output("############# arbitary #######################")
	clustering = array2clustering([
			[
				[1, 1],
				[1.5, 2],
				[3, 4]
			],
			[
				[5, 7],
				[3.5, 5]
			],
			[
				[4.5, 5],
				[3.5, 4.5]
			]
		]);

	
	cev = new ClusterEvaluation().data(clustering)
	.silhouette_dist_metric(euclidean_distance);

	output(pretty_print(clustering));
	output('wss')
	output(cev.WSS());
	output('bss')
	output(cev.BSS());
	output('tss')
	output(cev.TSS());
	output('silhouette');
	console.log('silhouette', cev.silhouette_coefficient());
	output(pretty_print(cev.silhouette_coefficient()));

}

function draw_hierachical_with_two_points(){
	var cluster = new HierachicalCluster()
	.data([{
		name : '1',
		value : {
			point : [0.4, 0.53]
		}
	},
	{
		name : '2',
		value: {
			point : [0.22, 0.38]
		}
	}])
	.dist_metric(tanimoto_distance)
	.dist_fun('centroid')
	.save_history(true)
	.init()
	.cluster();
	
	new DrawTree().container('tree-container').data(cluster.root()).draw();
	
	var matrix = cluster.pair2matrix(cluster.leafPairs());
	new DrawMatrix().data(matrix).container('matrix-container').draw();
	new DrawMatrixHistory().container('matrix-history-container').cluster(cluster).draw();
}

function matrix_template(){
	var cluster = new HierachicalCluster()
	.data([{
		name : '1',
		value : {
			point : [0.4, 0.53]
		}
	},
	{
		name : '2',
		value: {
			point : [0.22, 0.38]
		}
	},
	{
		name : '3',
		value: {
			point : [0.35, 0.32]
		}
	},
	{
		name : '4', 
		value : {
			point : [0.26, 0.19]
		}
	},
	{
		name : '5',
		value : {
			point : [0.08, 0.41]
		}
	},
	{
		name : '6',
		value : {
			point : [0.45, 0.30]
		}
	}])
	.dist_metric(tanimoto_distance)
	.dist_fun('centroid')
	.save_history(true)
	.init()
	.cluster();
	
	// new DrawTree().container('tree-container').data(cluster.root()).draw();
	
	var matrix = cluster.pair2matrix(cluster.leafPairs());
	new DrawMatrix().data(matrix).container('matrix-container').draw();
	// new DrawMatrixHistory().container('matrix-history-container').cluster(cluster).draw();
}

function sparseVectorTest(){
	var v1 = new SparseVector([0, 1, 5, 6, 10], [1, 1, 1, 1, 1]);
	var v2 = new SparseVector([0, 5, 10, 11], [1, 1, 1, 1]);
	var v3 = new SparseVector([1], [1]);
	var d = v1.dotp(v2);
	var s = v1.sum(v2);
	console.log('d', d);
	console.log('L2', v1.L2norm());
	console.log('s', s);
	var ind1 = v1.locationAtIndex(5);
	console.log('index1', ind1);
	var ind3 = v3.locationAtIndex(0);
	console.log('index3', ind3);
	console.log('v1', v1.toDenseVector());
	console.log('v2', v2.toDenseVector());
	console.log('v3', v3.toDenseVector());
	console.log('s', s.toDenseVector());
	v1.setValue(1, 2);
	v1.setValue(4, 1);
	v1.setValue(20, 1);
	console.log('v1', v1.toDenseVector());
}