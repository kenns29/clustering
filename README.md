# dmjs
A set of data mining tool for javascript


## Installation
```
bower install dmjs
```
## What's in it
### Clustering Tools
Example:

```js
	var cluster = new HierachicalCluster()
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


#### Hierachical Cluster

### Kmeans Cluster

### Clustering Evaluation
### Sparse Vector