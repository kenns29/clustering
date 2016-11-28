# dmjs
A set of data mining tool for javascript


## Installation
```
bower install dmjs
```
## What's in it
### Clustering Tools

#### Hierachical Cluster

Example:

```js
	var hc_cluster = new HierachicalCluster()
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
	.dist_metric(dm.euclidean_distance)
	.dist_fun('max')
	.save_history(true)
	.init()
	.cluster();
```




### Kmeans Cluster
```js
	var km_cluster = new KMean()
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
```
### Clustering Evaluation
### Sparse Vector