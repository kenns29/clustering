$(document).ready(function(){
	// draw_hierachical_with_binary_data();
	draw_hierachical_with_continous_data();
	// draw_hierachical_with_two_points();
	draw_kmean_with_euclidean();
	// matrix_template();
	evaluation_template();
	sparseVectorTest();
	dijkstra_test();
	breadth_first_search_test();
});
/*
* Euclidean distance example
*/
function draw_hierachical_with_continous_data(){
	var cluster = dm.HierachicalCluster()
	// .data([{
	// 	name : '1',
	// 	value : {
	// 		point : [0.4, 0.53]
	// 	}
	// },
	// {
	// 	name : '2',
	// 	value: {
	// 		point : [0.22, 0.38]
	// 	}
	// },
	// {
	// 	name : '3',
	// 	value: {
	// 		point : [0.35, 0.32]
	// 	}
	// },
	// {
	// 	name : '4',
	// 	value : {
	// 		point : [0.26, 0.19]
	// 	}
	// },
	// {
	// 	name : '5',
	// 	value : {
	// 		point : [0.08, 0.41]
	// 	}
	// },
	// {
	// 	name : '6',
	// 	value : {
	// 		point : [0.45, 0.30]
	// 	}
	// }])
	.data([{
		name : '1',
		value : {
			point : [0, 1]
		}
	},
	{
		name : '2',
		value: {
			point : [0, 2]
		}
	},
	{
		name : '3',
		value: {
			point : [0, 3]
		}
	},
	{
		name : '4',
		value : {
			point : [0, 3]
		}
	},
	{
		name : '5',
		value : {
			point : [0, -1]
		}
	},
	{
		name : '6',
		value : {
			point : [0, 10]
		}
	},
	{
		name : '7',
		value : {
			point : [0, 11]
		}
	}])
	.dist_metric(dm.tanimoto_distance)
	.dist_fun('max')
	.save_history(true)
	.init()
	.cluster();

	new DrawTree().container('tree-container').data(cluster.root()).draw();

	var matrix = cluster.pair2matrix(cluster.leafPairs());
	new DrawMatrix().data(matrix).container('matrix-container').draw();
	new DrawMatrixHistory().container('matrix-history-container').cluster(cluster).draw();

	var clustering = cluster.cut_opt('K').cut(3);
	// output(pretty_print(clustering));

	var silhouette = dm.ClusterEvaluation().data(clustering).silhouette_coefficient();
	// output(pretty_print(silhouette));
}

/*
* Jaccard distance example
*/
function draw_hierachical_with_binary_data(){
		var cluster = dm.HierachicalCluster()
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
	// {
	// 	name : '4',
	// 	value : {
	// 		point : [0, 1, 0, 1, 0, 0]
	// 	}
	// },
	{
		name : '4',
		value : {
			point : [0, 0, 0, 1, 0, 0]
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
	.dist_metric(dm.jaccard_distance)
	.dist_fun('max')
	.init()
	.cluster();

	new DrawTree().container('tree-container').data(cluster.root()).draw();

	var matrix = cluster.pair2matrix(cluster.leafPairs());
	new DrawMatrix().data(matrix).container('matrix-container').draw();
	new DrawMatrixHistory().container('matrix-history-container').cluster(cluster).draw();

	var clustering = cluster.cut_opt('K').cut(3);
}

function draw_kmean_with_euclidean(){
	var cluster = dm.KMean()
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
	.dist_metric(dm.euclidean_distance)
	.cluster();

	var clusters = cluster.clusters();
	var wss = dm.ClusterEvaluation().data(clusters).WSS();
	var bss = dm.ClusterEvaluation().data(clusters).BSS();
	var history = cluster.history();

	kmean_output_display(cluster);
}

function evaluation_template(){
	output("############# Hierachical #######################")
	var points = dm.array2points([
			[0.4, 0.53],
			[0.22, 0.38],
			[0.35, 0.32],
			[0.26, 0.19],
			[0.08, 0.41],
			[0.45, 0.30]
		]);


	output('Hierachical cluster points')
	output(pretty_print(points));
	var cluster = dm.HierachicalCluster()
	.data(points)
	.dist_metric(dm.euclidean_distance)
	.dist_fun('centroid')
	.save_history(true)
	.init()
	.cluster();

	var clustering = cluster.cut_opt('K').cut(3);

	var cev = dm.ClusterEvaluation().data(clustering);

	output('Hierachical cluster')
	output(pretty_print(clustering));


	cev = dm.ClusterEvaluation().data(clustering)
	.silhouette_dist_metric(dm.euclidean_distance);

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
	points = dm.array2points([
			[1, 1],
			[1.5, 2],
			[3, 4],
			[5, 7],
			[3.5, 5],
			[4.5, 5],
			[3.5, 4.5]
		]);
	var kmean_cluster = dm.KMean()
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
	.dist_metric(dm.euclidean_distance)
	.cluster();

	clustering = kmean_cluster.clusters();
	output('kmean cluster points')
	output(pretty_print(points));
	output('kmean cluster')
	output(pretty_print(clustering));


	cev = dm.ClusterEvaluation().data(clustering)
	.silhouette_dist_metric(dm.euclidean_distance);

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
	clustering = dm.array2clustering([
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


	cev = dm.ClusterEvaluation().data(clustering)
	.silhouette_dist_metric(dm.euclidean_distance);

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
	var cluster = dm.HierachicalCluster()
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
	var cluster = dm.HierachicalCluster()
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
	.dist_metric(dm.tanimoto_distance)
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
	var v1 = dm.SparseVector([0, 1, 5, 6, 10], [1, 1, 1, 1, 1]);
	var v2 = dm.SparseVector([0, 5, 10, 11], [1, 1, 1, 1]);
	var v3 = dm.SparseVector([1], [1]);
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

function dijkstra_test(){
	var nodes = [
	{
		id : 0,
		name : 0
	},
	{
		id: 1,
		name : 1
	},
	{
		id : 2,
		name : 2
	},
	{
		id : 3,
		name : 3
	},
	{
		id : 4,
		name : 4
	},
	{
		id : 5,
		name : 5
	},
	{
		id : 6,
		name : 6
	}
	];

	var edges = [
	{
		source : nodes[0],
		target : nodes[1],
		value : 2
	},
	{
		source : nodes[0],
		target : nodes[2],
		value : 9
	},
	{
		source : nodes[1],
		target : nodes[2],
		value : 4
	},
	{
		source : nodes[1],
		target : nodes[3],
		value : 2
	},
	{
		source : nodes[2],
		target : nodes[3],
		value : 1
	},
	{
		source : nodes[2],
		target : nodes[5],
		value : 3
	},
	{
		source : nodes[2],
		target : nodes[6],
		value : 11
	},
	{
		source : nodes[3],
		target : nodes[4],
		value : 1
	},
	{
		source : nodes[4],
		target : nodes[6],
		value : 7
	},
	{
		source : nodes[5],
		target : nodes[6],
		value : 7
	}
	];

	var G = dm.Graph().nodes(nodes).edges(edges).create();
	console.log('G', G.nodes(), G.edges());

	var dk = dm.ShortestPathDijkstra()
	.direction('out')
	.init_metric(function(){return 0;})
	.init_source_metric(function(){return Infinity;})
	.comparator(function(a, b){
		return b - a;
	})
	// .source(G.nodes()[0])
	.graph(G);
	// dk();
	var paths = dk();
	var path;
	var i;
	for(i = 0; i < paths.length; i++){
		path = paths[i];
		console.log(i, path.map(function(d){
			return d.id;
		}));
	}
}

function breadth_first_search_test(){
	var nodes = [
	{
		id : 0,
		name : 0
	},
	{
		id: 1,
		name : 1
	},
	{
		id : 2,
		name : 2
	},
	{
		id : 3,
		name : 3
	},
	{
		id : 4,
		name : 4
	},
	{
		id : 5,
		name : 5
	},
	{
		id : 6,
		name : 6
	}
	];

	var edges = [
	{
		source : nodes[0],
		target : nodes[1],
		value : 2
	},
	{
		source : nodes[0],
		target : nodes[2],
		value : 9
	},
	{
		source : nodes[1],
		target : nodes[2],
		value : 4
	},
	{
		source : nodes[1],
		target : nodes[3],
		value : 2
	},
	{
		source : nodes[2],
		target : nodes[3],
		value : 1
	},
	{
		source : nodes[2],
		target : nodes[5],
		value : 3
	},
	{
		source : nodes[2],
		target : nodes[6],
		value : 11
	},
	{
		source : nodes[3],
		target : nodes[4],
		value : 1
	},
	{
		source : nodes[4],
		target : nodes[6],
		value : 7
	},
	{
		source : nodes[5],
		target : nodes[6],
		value : 7
	}
	];

	var G = dm.Graph().nodes(nodes).edges(edges).create();
	var ge = dm.GirvanNewman().graph(G);
	var tree = ge();
	console.log('tree', tree);

	var pt = print_tree(tree, girvan_newman_copy_node);
	console.log(JSON.stringify(pt, null, 2));
	function girvan_newman_copy_node(r){
		return {
			name : r.name,
			com_id : r.com_id,
			value : {
				nodes : r.value.nodes.map(function(d){
					return d.id;
				})
			},
			children : [],
			m : r.m,
			metric : r.metric
		};
	}
}


function print_tree(tree, copy_node){
	var ptree = copy_node(tree);
    recurse(tree, ptree);
    return ptree;
	function recurse(r, pr){
		if(r){
			r.children.forEach(function(child){
				var copy_child = copy_node(child);
				pr.children.push(copy_child);
				recurse(child, copy_child);
			});
		}
	}
}
function print_ready_tree(tree, copy_node){
	var ptree = copy_node(tree);
    recurse(tree, ptree);
    return ptree;
	function recurse(r, pr){
		if(r){
			r.children.forEach(function(child){
				var copy_child = copy_node(child);
				pr.children.push(copy_child);
				recurse(child, copy_child);
			});
		}
	}

	function copy_node(r){
		return {
			'id' : r.value.id,
			'in_flow' : r.in_flow.map(function(d){
				return d.value.id;
			}),
			'out_flow' : r.out_flow.map(function(d){
				return d.value.id;
			}),
			'weight' : r.weight,
			'children' : []
		};
	}
}