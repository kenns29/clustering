(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cl"] = factory();
	else
		root["cl"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isArray = isArray;
exports.array2map = array2map;
exports.map2values = map2values;
exports.functor = functor;
exports.key_functor = key_functor;
function isArray(v) {
	return Object.prototype.toString.call(v) === '[object Array]';
};

function array2map(array, key) {
	var f = key_functor(key);
	return array.reduce(function (pre, cur) {
		return pre.set(f(cur), cur);
	}, new Map());
};
function map2values(map) {
	var values = Array(map.size);
	var idx = 0;
	map.forEach(function (value) {
		values[idx++] = value;
	});
	return values;
};

function functor(f) {
	return typeof f === 'function' ? f : function () {
		return f;
	};
};

function key_functor(f) {
	return typeof f === 'function' ? f : function (d) {
		return d[f];
	};
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	return new Evaluation();
};

exports.Evaluation = Evaluation;

var _statistic = __webpack_require__(2);

;
function Evaluation() {
	/*
 * Data needs to be the following format :
 * [[],[]]
 */
	var data;
	/*
 * Default accessor, which returns it self
 */
	var accessor = function accessor(d) {
		return d;
	};

	/*
 * Compute the sum of square error of the data array
 * m is the optional parameter which defines the reference point
 * by default m is is the centroid of the points
 */
	this.SSE = function (m) {
		var dat = data.map(accessor);
		if (arguments.length === 0) {
			m = (0, _statistic.mean)(dat);
		}
		var sse = 0;
		for (var i = 0; i < dat.length; i++) {
			sse += euclidean_distance_square(dat[i], m);
		}
		return sse;
	};

	this.data = function (_) {
		return arguments.length > 0 ? (data = _, this) : data;
	};

	this.accessor = function (_) {
		return arguments.length > 0 ? (accessor = _, this) : accessor;
	};

	function euclidean_distance(a, b) {
		var sum = 0;
		for (var i = 0; i < a.length; i++) {
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	}

	function euclidean_distance_square(a, b) {
		var sum = 0;
		for (var i = 0; i < a.length; i++) {
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return sum;
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.corr = corr;
exports.cov = cov;
exports.mean = mean;
exports.std = std;
exports.L1_norm = L1_norm;
exports.L2_norm = L2_norm;
exports.dotp = dotp;
exports.mult_m = mult_m;
exports.inv_m = inv_m;

var _utils = __webpack_require__(0);

function corr(v) {
	if (v.length === 0) {
		return 0;
	} else if ((0, _utils.isArray)(v[0])) {
		var SIGMA = cov(v);
		var standard_dev = std(v);
		for (var i = 0; i < SIGMA.length; i++) {
			for (var j = 0; j < SIGMA.length; j++) {
				if (standard_dev[i] === standard_dev[j] === 0) {
					SIGMA[i][j] = 1;
				} else if (standard_div[i] === 0 || standard_dev[j] === 0) {
					SIGMA[i][j] = 0;
				} else {
					SIGMA[i][j] /= standard_dev[i] * standard_dev[j];
				}
			}
		}
		return SIGMA;
	} else {
		return std(v);
	}
};

/*
* Compute the covariance matrix of data points a and b
* both a and b are matrix in which the rows represent the data points and
* the columns represent the attributes
* the matrix is in the form of array of array[[data point],[data point],[data point]...]
*/
function cov(v) {
	if (v.length === 0) {
		return 0;
	} else if ((0, _utils.isArray)(v[0])) {
		var m = mean(v);
		var matrix = Array(v[0].length).fill(Array(v[0].length).fill(0));
		for (var i = 0; i < v[0].length; i++) {
			for (var j = 0; j < v[0].length; j++) {
				var sum = 0;
				for (var k = 0; k < v.length; k++) {
					sum += (v[k][i] - m[i]) * (v[k][j] - m[j]);
				}
				matrix[i][j] = sum / v.length;
			}
		}
		return matrix;
	} else {
		return variance(v);
	}
}

function variance(v) {
	var m, sum, i, j;
	if (v.length === 0) {
		return 0;
	} else if ((0, _utils.isArray)(v[0])) {
		m = mean(v);
		sum = Array(v[0]).fill(0);
		for (i = 0; i < v.length; i++) {
			for (j = 0; j < v[i].length; j++) {
				sum[j] += (v[i][j] - m[j]) * (v[i][j] - m[j]);
			}
		}
		return sum.map(function (d) {
			return d / v.length;
		});
	} else {
		m = mean(v);
		sum = 0;
		for (i = 0; i < v.length; i++) {
			sum += (v[i] - m) * (v[i] - m);
		}
		return sum / v.length;
	}
}

function mean(v) {
	var sum, i, j;
	if (v.length === 0) {
		return 0;
	} else if ((0, _utils.isArray)(v[0])) {
		sum = Array(v[0].length).fill(0);
		for (i = 0; i < v.length; i++) {
			for (j = 0; j < v[i].length; j++) {
				sum[j] += v[i][j];
			}
		}
		return sum.map(function (d) {
			return d / v.length;
		});
	} else {
		sum = 0;
		for (i = 0; i < v.length; i++) {
			sum += v[i];
		}
		return sum / v.length;
	}
}

function std(v) {
	if (v.length === 0) {
		return 0;
	} else if ((0, _utils.isArray)(v[0])) {
		return variance(v).map(function (d) {
			return Math.sqrt(d);
		});
	} else {
		return Math.sqrt(variance(v));
	}
}

function L1_norm(v) {
	if (v.length === 0) return 0;
	return v.reduce(function (pre, cur, ind) {
		return pre + Math.abs(cur);
	}, 0);
}

function L2_norm(v) {
	if (v.length === 0) return 0;
	var sum = v.reduce(function (pre, cur, ind) {
		return pre + cur * cur;
	}, 0);

	return Math.sqrt(sum);
}

function dotp(a, b) {
	var sum = 0;
	for (var i = 0; i < a.length; i++) {
		sum += a[i] * b[i];
	}
	return sum;
}

function mult_m(a, b) {}

//find inverse of matrix m
function inv_m(m) {}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var graph;
	var edge;

	function init_edge_betweenness() {
		graph.edges().forEach(function (d) {
			d.edge_betweenness = 0;
		});
	}
	function flow() {
		init_edge_betweenness();
		graph.nodes().forEach(function (node) {
			source_flow(node);
		});
	}

	function source_flow(source) {
		var i, j;
		var node;
		var upper_node;
		var upper_weight_sum;
		var flow;
		var edge;
		var bs = (0, _BreadthFirst2.default)().graph(graph).source(source);
		var tree = bs();
		init_flow(tree);

		var leave = flow_leave(tree);
		leave.forEach(function (d) {
			leaf_flow(d, source);
		});

		leave.forEach(function (d) {
			edge_betweenness(d, source);
		});
	}

	function edge_betweenness(leaf) {
		var i;
		var node;
		var in_node;
		var edge;
		var flow;
		var stack = new Array();

		stack.push(leaf);
		while (stack.length > 0) {
			node = stack.pop();
			if (!node.visited) {
				node.visited = true;
				for (i = 0; i < node.in_flow.length; i++) {
					in_node = node.in_flow[i];
					flow = node.flow * (in_node.weight / node.weight);

					edge = graph.undirected_edge(node.value, in_node.value);
					edge.edge_betweenness = edge.edge_betweenness ? flow + edge.edge_betweenness : flow;

					stack.push(in_node);
				}
			}
		}
	}

	function leaf_flow(leaf) {
		var i, j;
		var node;
		var in_node;
		var flow;
		var stack = new Array();
		stack.push(leaf);
		while (stack.length > 0) {
			node = stack.pop();
			for (i = 0; i < node.in_flow.length; i++) {
				in_node = node.in_flow[i];
				stack.push(in_node);
				in_node.flow += node.flow * (in_node.weight / node.weight);
			}
		}
	}

	function ret() {
		return flow(graph.nodes()[0]);
	}

	ret.graph = function (_) {
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	return ret;

	function init_flow(tree) {
		recurse(tree);
		function recurse(r) {
			if (r) {
				r.flow = 1;
				r.children.forEach(recurse);
			}
		}
	}
	function upper_level_nodes(cur_level) {
		var i;
		var value;
		var node;
		var upper_level_map = new Map();
		for (i = 0; i < cur_level.length; i++) {
			node = cur_level[i];
			upper_level_map.set(node.value.id, node);
		}
		return (0, _utils.map2values)(upper_level_map);
	}

	function tree_leave(tree) {
		var leave = [];
		recurse(tree);
		return leave;
		function recurse(r) {
			if (r) {
				if (!r.children || r.children.length === 0) leave.push(r);else {
					r.children.forEach(recurse);
				}
			}
		}
	}

	function flow_leave(tree) {
		return tree_leave(tree).filter(function (d) {
			return d.out_flow.length === 0;
		});
	}
};

var _utils = __webpack_require__(0);

var _BreadthFirst = __webpack_require__(4);

var _BreadthFirst2 = _interopRequireDefault(_BreadthFirst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var graph;
	var source;
	var direction = 'undirected';

	function visit(d) {
		// console.log(d, d.id, d.bs_status.tree_node.weight, d.bs_status.visited, d.bs_status.level, d.all_neighbors().map(function(d){return d.id;}));
	}

	function init_nodes(nodes) {
		nodes.forEach(function (d) {
			d.bs_status = {
				visited: false,
				level: 0,
				tree_node: null
			};
		});
	}

	function search() {
		//the minimum spaning tree that are returned
		var tree;
		var tree_node;
		var node;
		var Q = (0, _Queue2.default)();
		var nodes = graph.nodes();
		init_nodes(nodes);

		tree_node = {
			level: 0,
			in_flow: [],
			out_flow: [],
			weight: 1,
			parent: null,
			children: [],
			value: source
		};
		tree = tree_node;

		source.bs_status.tree_node = tree_node;
		source.bs_status.visited = true;
		Q.enqueue(source);
		while (!Q.empty()) {
			node = Q.dequeue();
			node.all_neighbors().forEach(function (neighbor) {
				if (!neighbor.bs_status.visited) {

					tree_node = {
						level: node.bs_status.level + 1,
						in_flow: [],
						out_flow: [],
						weight: 0,
						parent: node.bs_status.tree_node,
						children: [],
						value: neighbor
					};

					neighbor.bs_status.visited = true;
					neighbor.bs_status.level = node.bs_status.level + 1;
					neighbor.bs_status.tree_node = tree_node;

					node.bs_status.tree_node.children.push(tree_node);

					Q.enqueue(neighbor);
				}
				if (node.bs_status.level + 1 === neighbor.bs_status.level) {
					neighbor.bs_status.tree_node.weight += node.bs_status.tree_node.weight;
					neighbor.bs_status.tree_node.in_flow.push(node.bs_status.tree_node);
					node.bs_status.tree_node.out_flow.push(neighbor.bs_status.tree_node);
				}
			});
			visit(node);
		}
		clean_up();
		return tree;
	}

	function clean_up() {
		graph.nodes().forEach(function (d) {
			delete d.bs_status;
		});
	}

	function ret() {
		return search();
	}
	ret.graph = function (_) {
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};
	ret.direction = function (_) {
		return arguments.length > 0 ? (direction = _, ret) : direction;
	};
	ret.visit = function (_) {
		if (arguments.length > 0) visit = _;
		return ret;
	};
	ret.source = function (_) {
		return arguments.length > 0 ? (source = _, ret) : source;
	};

	return ret;
};

var _Queue = __webpack_require__(5);

var _Queue2 = _interopRequireDefault(_Queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var a = [],
	    b = 0;

	var Q = {
		len: len,
		empty: empty,
		enqueue: enqueue,
		dequeue: dequeue,
		peek: peek
	};

	function len() {
		return a.length - b;
	}

	function empty() {
		return 0 == a.length;
	}

	function enqueue(b) {
		a.push(b);
	}

	function dequeue() {
		if (0 != a.length) {
			var c = a[b];
			2 * ++b >= a.length && (a = a.slice(b), b = 0);
			return c;
		}
	}
	function peek() {
		return 0 < a.length ? a[b] : void 0;
	}

	return Q;
};

;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HierachicalCluster = __webpack_require__(8);

Object.defineProperty(exports, 'HierachicalCluster', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_HierachicalCluster).default;
  }
});

var _ClusterEvaluation = __webpack_require__(9);

Object.defineProperty(exports, 'ClusterEvaluation', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ClusterEvaluation).default;
  }
});

var _Evaluation = __webpack_require__(1);

Object.defineProperty(exports, 'Evaluation', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Evaluation).default;
  }
});

var _GirvanNewman = __webpack_require__(10);

Object.defineProperty(exports, 'GirvanNewman', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GirvanNewman).default;
  }
});

var _BreadthFirst = __webpack_require__(4);

Object.defineProperty(exports, 'BreadthFirst', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BreadthFirst).default;
  }
});

var _Queue = __webpack_require__(5);

Object.defineProperty(exports, 'Queue', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Queue).default;
  }
});

var _KMean = __webpack_require__(11);

Object.defineProperty(exports, 'KMean', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_KMean).default;
  }
});

var _ShortestPathDijkstra = __webpack_require__(12);

Object.defineProperty(exports, 'ShortestPathDijkstra', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ShortestPathDijkstra).default;
  }
});

var _SparseVector = __webpack_require__(14);

Object.defineProperty(exports, 'SparseVector', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SparseVector).default;
  }
});

var _Graph = __webpack_require__(15);

Object.defineProperty(exports, 'Graph', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Graph).default;
  }
});

var _EdgeBetweennessCentrality = __webpack_require__(3);

Object.defineProperty(exports, 'EdgeBetweenessCentrality', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_EdgeBetweennessCentrality).default;
  }
});

var _utils = __webpack_require__(0);

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _statistic = __webpack_require__(2);

Object.keys(_statistic).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _statistic[key];
    }
  });
});

var _distance_metrics = __webpack_require__(16);

Object.keys(_distance_metrics).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _distance_metrics[key];
    }
  });
});

var _data_utils = __webpack_require__(17);

Object.keys(_data_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _data_utils[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	return new HierachicalCluster();
};

exports.HierachicalCluster = HierachicalCluster;

var _utils = __webpack_require__(0);

;
function HierachicalCluster() {
	/*
 * Stores the pairs for all points, with the following format:
 * [{id:'1-2', from:{}, to:{}, dist:1}]
 */
	var pairs = [];
	var leafPairs;
	var topPairs;
	var topPairMap;
	/*
 * Node data needs to be a json array of form [{name, value:{point:[1, 2, 3]}}]
 * each data point will be automatically assigned an id, which by default is the index
 *
 * Pair data needs to be a json array of the form [{from: {name, }]
 */
	var data;

	/*
 * Specify the type of input data: node, pair, node-pair
 */
	var data_type = HierachicalCluster.DATA_TYPE.NODE;
	/*
 * The default accesor is point
 */
	var accessor = function accessor(d) {
		return d.value.point;
	};

	/*
 * Stores the history of pairs
 */
	var history_pairs = [];

	/*
 * Flag to indicate whether to save history during execution
 */
	var save_history = false;
	/*
 * distance metric for two points, the default is Euclidean distance
 */
	var dist_metric = function dist_metric(a, b) {
		var sum = 0;
		for (var i = 0; i < a.length; i++) {
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	};
	//default is min
	var dist_fun = function dist_fun(R, Q) {
		var A = R.children[0];
		var B = R.children[1];
		return lance_williams(R, Q, A, B, 1 / 2, 1 / 2, 0, 1 / 2);
	};
	//option for cutting the tree
	var cut_opt = 'distance';
	//option for normalizing the distance
	var normalize_distance = false;
	var normalize_domain = null;
	var normalize_range = null;
	/*
 * root has the following format:
 * {id: 0, name, value:{point:[]}, children:[], m:10, metric:1.1}
 * m is the number of members in the cluster
 */
	var root;
	var nodes;
	var topNodes;

	//id for new node
	var nID = 0;

	var name_fun = function name_fun(n) {
		var num = n.id + 1;
		return num.toString();
	};

	this.init = function () {
		var i, j;
		var node;
		/*
  * Init for node data
  */
		if (data_type === HierachicalCluster.DATA_TYPE.NODE) {
			/*
   * Init leaf nodes
   */
			nodes = data.map(function (d, i) {
				var node = d;
				node.id = i;
				node.value.point = accessor(node), node.m = 1;
				node.metric = 0;
				return node;
			});
			topNodes = nodes.slice(0);

			nID = nodes.length;
			/*
   * Init pairs
   */
			for (i = 0; i < nodes.length; i++) {
				var p1 = nodes[i].value.point;
				for (j = i + 1; j < nodes.length; j++) {
					var p2 = nodes[j].value.point;
					var dist = dist_metric(p1, p2);
					pairs.push({
						'id': nodes[i].id + '-' + nodes[j].id,
						'from': nodes[i],
						'to': nodes[j],
						'dist': dist
					});
				}
			}
			if (normalize_distance) {
				normalizePairs(pairs, normalize_domain, normalize_range);
			}
			//copy the pairs to leafPairs
			leafPairs = pairs.slice(0);
			//copy pairs to the top pairs and sort the top pairs
			topPairs = pairs.slice(0);
			topPairs.forEach(function (d, i) {
				d.index = i;
			});

			topPairs.sort(function (a, b) {
				if (a.dist < b.dist) {
					return -1;
				} else if (a.dist > b.dist) {
					return 1;
				} else {
					return a.index - b.index;
				}
			});
			topPairMap = (0, _utils.array2map)(topPairs, function (d) {
				return d.id;
			});
		}
		/*
  * Init for pair data
  */
		else if (data_type === HierachicalCluster.DATA_TYPE.PAIR) {}
		return this;
	};

	this.cluster = function () {
		while (topNodes.length > 1) {
			if (save_history) history_pairs.push(JSON.parse(JSON.stringify(topPairs)));
			var pair = topPairs[0];
			join(pair.from, pair.to);
		}
		root = topNodes[0];
		return this;
	};

	this.cut = function (threshold) {
		var nodes;
		if (cut_opt === 'K') {
			nodes = cutByK(threshold);
		}
		//cut the tree based on the distance threshold, distance smaller than the threshold form cluster
		else if (cut_opt === 'distance') {
				nodes = cutByDist(threshold);
			} else {
				nodes = cutByDist(threshold);
			}
		var clusters = [];
		nodes.forEach(function (n) {
			var leafNodes = getLeafNodes(n);
			var points = leafNodes.map(function (p) {
				return {
					name: p.name,
					value: {
						point: p.value.point,
						dist: p.metric
					}
				};
			});
			clusters.push({
				name: n.name,
				id: n.id,
				value: {
					points: points,
					dist: n.metric
				}
			});
		});
		return clusters;
	};

	this.pair2matrix = function (pairs) {
		var ps = pairs.slice(0);
		ps.sort(function (a, b) {
			return a.from.id - b.from.id;
		});

		var matrix = [];
		var maxIndex = 0;
		var name2index = new Map();
		var to_ps = [];

		ps.forEach(function (d) {
			if (!name2index.has(d.from.id)) name2index.set(d.from.id, maxIndex++);
			if (!name2index.has(d.to.id)) {
				to_ps.push(d);
			}
		});

		to_ps.forEach(function (d) {
			if (!name2index.has(d.to.id)) {
				name2index.set(d.to.id, maxIndex++);
			}
		});
		ps.forEach(function (d) {
			var from_index = name2index.get(d.from.id);
			var to_index = name2index.get(d.to.id);
			if (!matrix[from_index]) matrix[from_index] = [];
			if (!matrix[to_index]) matrix[to_index] = [];
			matrix[from_index][to_index] = {
				'value': d.dist,
				'from_name': d.from.name,
				'from_id': d.from.id,
				'to_name': d.to.name,
				'to_id': d.to.id
			};
			matrix[to_index][from_index] = {
				'value': d.dist,
				'from_name': d.to.name,
				'from_id': d.to.id,
				'to_name': d.from.name,
				'to_id': d.from.id
			};
			if (!matrix[from_index][from_index]) {
				matrix[from_index][from_index] = {
					'value': 0,
					'from_name': d.from.name,
					'from_id': d.from.id,
					'to_name': d.from.name,
					'to_id': d.from.id
				};
			}
			if (!matrix[to_index][to_index]) {
				matrix[to_index][to_index] = {
					'value': 0,
					'from_name': d.to.name,
					'from_id': d.to.id,
					'to_name': d.to.name,
					'to_id': d.to.id
				};
			}
		});
		return matrix;
	};
	/**********************
 * Accessor functions **
 ************************/
	this.data = function (_) {
		return arguments.length > 0 ? (data = _, this) : data;
	};

	this.accessor = function (_) {
		return arguments.length > 0 ? (accessor = _, this) : accessor;
	};
	this.root = function (_) {
		return arguments.length > 0 ? (root = _, this) : root;
	};
	this.dist_fun = function (_) {
		if (arguments.length === 0) return dist_fun;else if (Object.prototype.toString.call(_) === '[object String]') {
			switch (_) {
				case 'min':
					dist_fun = function dist_fun(R, Q) {
						var A = R.children[0];
						var B = R.children[1];
						return lance_williams(R, Q, A, B, 1 / 2, 1 / 2, 0, -1 / 2);
					};
					break;
				case 'max':
					dist_fun = function dist_fun(R, Q) {
						var A = R.children[0];
						var B = R.children[1];
						return lance_williams(R, Q, A, B, 1 / 2, 1 / 2, 0, 1 / 2);
					};
					break;
				case 'group_average':
					dist_fun = function dist_fun(R, Q) {
						var A = R.children[0];
						var B = R.children[1];
						var alpha_A = A.m / (A.m + B.m);
						var alpha_B = B.m / (A.m + B.m);
						return lance_williams(R, Q, A, B, alpha_A, alpha_B, 0, 0);
					};
					break;
				case 'centroid':
					dist_fun = function dist_fun(R, Q) {
						var A = R.children[0];
						var B = R.children[1];
						var alpha_A = A.m / (A.m + B.m);
						var alpha_B = B.m / (A.m + B.m);
						var beta = -A.m * B.m / ((A.m + B.m) * (A.m + B.m));
						return lance_williams(R, Q, A, B, alpha_A, alpha_B, beta, 0);
					};
					break;
				case 'ward':
					dist_fun = function dist_fun(R, Q) {
						var A = R.children[0];
						var B = R.children[1];
						var alpha_A = (A.m + Q.m) / (A.m + B.m + Q.m);
						var alpha_B = (B.m + Q.m) / (A.m + B.m + Q.m);
						var beta = -Q.m / (A.m + B.m + Q.m);
						return lance_williams(R, Q, A, B, alpha_A, alpha_B, beta, 0);
					};
			}
			return this;
		} else {
			dist_fun = _;
			return this;
		}
	};

	this.dist_metric = function (_) {
		return arguments.length > 0 ? (dist_metric = _, this) : dist_metric;
	};

	this.save_history = function (_) {
		return arguments.length > 0 ? (save_history = _, this) : save_history;
	};

	this.cut_opt = function (_) {
		return arguments.length > 0 ? (cut_opt = _, this) : cut_opt;
	};

	this.leafPairs = function () {
		return leafPairs;
	};

	this.topPairs = function () {
		return topPairs;
	};

	this.pairs = function () {
		return pairs;
	};

	this.history = function () {
		return history_pairs;
	};
	this.name_fun = function (_) {
		return arguments.length > 0 ? (name_fun = _, this) : name_fun;
	};

	this.data_type = function (_) {
		return arguments.length > 0 ? (data_type = _, this) : data_type;
	};
	this.normalize_distance = function (_) {
		return arguments.length > 0 ? (normalize_distance = _, this) : normalize_distance;
	};
	this.normalize_domain = function (_) {
		return arguments.length > 0 ? (normalize_domain = _, this) : normalize_domain;
	};
	this.normalize_range = function (_) {
		return arguments.length > 0 ? (normalize_range = _, this) : normalize_range;
	};
	/*
 * Using Lance Williams formula to compare clusters between node R and Q,
 * R is formed by mergin cluster A and B
 */
	function lance_williams(R, Q, A, B, alpha_A, alpha_B, beta, gamma) {
		var pairAQ = topPairMap.get(pairID(A, Q));
		var pairBQ = topPairMap.get(pairID(B, Q));
		var pairAB = topPairMap.get(pairID(A, B));
		return alpha_A * pairAQ.dist + alpha_B * pairBQ.dist + beta * pairAB.dist + gamma * Math.abs(pairAQ.dist - pairBQ.dist);
	}

	function join(n1, n2) {
		var i;
		//new node
		var n = {
			'id': nID,
			'children': [n1, n2],
			'metric': topPairMap.get(pairID(n1, n2)).dist,
			'm': n1.m + n2.m
		};
		n.name = name_fun(n);
		//remove n1 and n2 from the the top nodes
		i = topNodes.length;
		while (i--) {
			if (topNodes[i].id == n1.id || topNodes[i].id == n2.id) {
				topNodes.splice(i, 1);
			}
		}

		//compute the new pairs for n and add the pairs to topPairs
		topNodes.forEach(function (d, i) {
			var dist = dist_fun(n, d);
			topPairs.push(makePair(n, d, dist));
		});

		//remove the pairs related to n1 and n2
		i = topPairs.length;
		while (i--) {
			if (topPairs[i].from.id == n1.id || topPairs[i].to.id == n1.id || topPairs[i].from.id == n2.id || topPairs[i].to.id == n2.id) {
				topPairs.splice(i, 1);
			}
		}
		topPairs.forEach(function (d, i) {
			d.index = i;
		});

		topPairs.sort(function (a, b) {
			if (a.dist < b.dist) {
				return -1;
			} else if (a.dist > b.dist) {
				return 1;
			} else {
				return a.index - b.index;
			}
		});
		topPairMap = (0, _utils.array2map)(topPairs, function (d) {
			return d.id;
		});
		topNodes.push(n);
		++nID;
	}

	/*
 * get the pair id from a pair of nodes
 */
	function pairID(n1, n2) {
		return n1.id < n2.id ? n1.id + '-' + n2.id : n2.id + '-' + n1.id;
	}
	function makePair(n1, n2, dist) {
		return n1.id < n2.id ? { 'id': n1.id + '-' + n2.id, 'from': n1, 'to': n2, 'dist': dist } : { 'id': n2.id + '-' + n1.id, 'from': n2, 'to': n1, 'dist': dist };
	}
	function getLeafNodes(r) {
		var nodes = [];
		if (arguments.length === 0) {
			getLeafNodesRecurse(root, nodes);
		} else {
			getLeafNodesRecurse(r, nodes);
		}
		return nodes;
	}
	function getLeafNodesRecurse(r, nodes) {
		if (r !== null) {
			if (!r.children || r.children.length === 0) {
				nodes.push(r);
			}
			if (r.children) {
				r.children.forEach(function (d) {
					getLeafNodesRecurse(d, nodes);
				});
			}
		}
	}

	function cutByDist(threshold) {
		var nodes = [];
		recurse(root, nodes);
		return nodes;
		function recurse(r, nodes) {
			if (r !== null) {
				if (r.metric <= threshold) {
					nodes.push(r);
				} else {
					if (r.children) {
						r.children.forEach(function (child) {
							recurse(child, nodes);
						});
					}
				}
			}
		}
	}

	function cutByK(threshold) {
		var nodes = [root];
		recurse(nodes);
		return nodes;
		function recurse(nodes) {
			if (nodes.length < threshold) {
				var largest_dist = -Infinity;
				var node_index = -1;
				for (var i = 0; i < nodes.length; i++) {
					if (nodes[i].metric > largest_dist && nodes[i].children && nodes[i].children.length > 0) {
						largest_dist = nodes[i].metric;
						node_index = i;
					}
				}
				if (node_index >= 0) {
					var node = nodes[node_index];
					// console.log('node', node);
					if (node.children) {
						nodes.splice(node_index, 1);
						node.children.forEach(function (n) {
							nodes.push(n);
						});
					}
					recurse(nodes);
				}
			}
		}
	}
	function distanceExtent(pairs) {
		var max = -Infinity,
		    min = Infinity;
		pairs.forEach(function (pair) {
			max = Math.max(max, pair.dist);
			min = Math.min(min, pair.dist);
		});
		return [min, max];
	}
	function normalizeDist(dist, domain, range) {
		if (domain[0] === domain[1]) return dist;
		return range[0] + (range[1] - range[0]) / (domain[1] - domain[0]) * (dist - domain[0]);
	}
	function normalizePairs(pairs, _domain, _range) {
		var domain = void 0,
		    range = [0, 1],
		    extent = void 0;
		if (_domain) {
			if (_domain[0] != null && _domain[1] != null) {
				domain = _domain;
			} else if (_domain[0] != null) {
				extent = distanceExtent(pairs);
				domain = [_domain[0], extent[1]];
			} else if (_domain[1] != null) {
				extent = distanceExtent(pairs);
				domain = [extent[0], _domain[1]];
			}
		} else {
			domain = distanceExtent(pairs);
		}
		if (_range) range = _range;
		pairs.forEach(function (pair) {
			pair.orig_dist = pair.dist;
			pair.dist = normalizeDist(pair.dist, domain, range);
		});
		return pairs;
	}
	function pairIndexOf(pair) {}
};

HierachicalCluster.DATA_TYPE = {
	NODE: 'node',
	PAIR: 'pair',
	NODE_PAIR: 'node-pair'
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	return new ClusterEvaluation();
};

exports.ClusterEvaluation = ClusterEvaluation;

var _utils = __webpack_require__(0);

var _Evaluation = __webpack_require__(1);

var _Evaluation2 = _interopRequireDefault(_Evaluation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
function ClusterEvaluation() {
	/*
 * Data needs to be in the following format:
 * [{name, value:{centroid, points}}, ...]
 */
	var data;

	var points_accessor = function points_accessor(d) {
		return d.value.points;
	};

	var centroid_accessor = function centroid_accessor(d) {
		return d.value.centroid;
	};

	var point_accessor = function point_accessor(d) {
		return d.value.point;
	};

	//default silhouette distance metric is euclidean
	var silhouette_dist_metric = euclidean_distance;

	this.centroid_of_all_points = centroid_of_all_points;

	this.WSS = function () {
		var sum = 0;
		data.forEach(function (d) {
			var points = points_accessor(d);
			var centroid = centroid_accessor(d);
			var sse;
			if (centroid === null || centroid === undefined) {
				sse = (0, _Evaluation2.default)().data(points).accessor(point_accessor).SSE();
			} else {
				sse = (0, _Evaluation2.default)().data(points).accessor(point_accessor).SSE(centroid_accessor(d));
			}

			sum += sse;
		});
		return sum;
	};

	this.BSS = function () {
		var sum = 0;
		var data_centroid = centroid_of_all_points();
		data.forEach(function (d) {
			//obtain points in the cluster
			var points = points_accessor(d);
			if (points.length > 0) {
				//obtain the centroid of the cluster, if centroid is not defined, calculate it
				var centroid = centroid_accessor(d);
				if (centroid === null || centroid === undefined) {
					centroid = point_accessor(points[0]).map(function () {
						return 0;
					});
					points.forEach(function (g) {
						var point = point_accessor(g);
						for (var i = 0; i < centroid.length; i++) {
							centroid[i] += point[i];
						}
					});

					centroid = centroid.map(function (g) {
						return g / points.length;
					});
				}

				sum += points.length * euclidean_distance_square(centroid, data_centroid);
			}
		});
		return sum;
	};

	this.TSS = function () {
		var sum = 0;
		var data_centroid = centroid_of_all_points();
		data.forEach(function (d) {
			var points = points_accessor(d);
			if (points.length > 0) {
				var ps = points.map(point_accessor);
				ps.forEach(function (g) {
					sum += euclidean_distance_square(g, data_centroid);
				});
			}
		});
		return sum;
	};

	this.silhouette_coefficient = function (point, cluster) {
		if (arguments.length === 0) {
			return silhouette_coefficient();
		} else if (arguments.length == 1) {
			return silhouette_coefficient(point);
		} else {
			return silhouette_coefficient(point, cluster);
		}
	};

	this.data = function (_) {
		return arguments.length > 0 ? (data = _, this) : data;
	};
	this.points_accessor = function (_) {
		return arguments.length > 0 ? (points_accessor = _, this) : points_accessor;
	};
	this.point_accessor = function (_) {
		return arguments.length > 0 ? (point_accessor = _, this) : point_accessor;
	};
	this.centroid_accessor = function (_) {
		return arguments.length > 0 ? (centroid_accessor = _, this) : centroid_accessor;
	};

	this.silhouette_dist_metric = function (_) {
		return arguments.length > 0 ? (silhouette_dist_metric = _, this) : silhouette_dist_metric;
	};

	function euclidean_distance(a, b) {
		var sum = 0;
		for (var i = 0; i < a.length; i++) {
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	}

	function euclidean_distance_square(a, b) {
		var sum = 0;
		for (var i = 0; i < a.length; i++) {
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return sum;
	}

	function centroid_of_all_points() {
		var centroid = null;
		var numPoints = 0;
		data.forEach(function (d) {
			var points = points_accessor(d);
			numPoints += points.length;
			points.forEach(function (g, k) {
				var point = point_accessor(g);
				if ((0, _utils.isArray)(point)) {
					if (!centroid) {
						centroid = point.map(function () {
							return 0;
						});
					}

					for (var i = 0; i < centroid.length; i++) {
						centroid[i] += point[i];
					}
				} else {
					if (!centroid) centroid = 0;
					centroid += point;
				}
			});
		});
		if ((0, _utils.isArray)(centroid)) {
			centroid = centroid.map(function (d) {
				return d / numPoints;
			});
		} else {
			centroid /= numPoints;
		}
		return centroid;
	}

	function silhouette_coefficient_for_all_points() {
		var point_silhouette_pairs = [];
		for (var i = 0; i < data.length; i++) {
			var cluster = data[i];
			var c_data = points_accessor(cluster);
			for (var j = 0; j < c_data.length; j++) {
				var point_name = c_data[j].name;
				var sc = silhouette_coefficient(c_data[j], cluster);
				point_silhouette_pairs.push({
					'name': point_name,
					'point': point_accessor(c_data[j]),
					'value': sc
				});
			}
		}
		return point_silhouette_pairs;
	}

	function silhouette_coefficient(point, cluster) {
		if (arguments.length === 0) {
			return silhouette_coefficient_for_all_points();
		} else if (arguments.length == 1) {
			cluster = function () {
				for (var i = 0; i < data.length; i++) {
					var c_data = points_accessor(data[i]);
					for (var j = 0; j < c_data.length; j++) {
						var point_name = c_data[j].name;
						if (point_name == point.name) {
							return data[i];
						}
					}
				}
			}();

			return silhouette_with_cluster(point_accessor(point), cluster);
		} else {
			if (Object.prototype.toString.call(cluster) === '[object String]') {
				return silhoutte_with_cluster_name(point_accessor(point), cluster);
			} else {
				return silhouette_with_cluster(point_accessor(point), cluster);
			}
		}

		function silhoutte_with_cluster_name(point, cluster_name) {
			var cluster = null;
			for (var i = 0; i < data.length; i++) {
				if (cluster_name == data[i].name) {
					cluster = data[i];
					break;
				}
			}
			return silhouette_with_cluster(point, cluster);
		}

		function silhouette_with_cluster(point, cluster) {
			var c_data = points_accessor(cluster);
			var c_points = c_data.map(point_accessor);
			var a = 0,
			    i = 0,
			    j = 0;
			if (c_points.length > 1) {
				for (i = 0; i < c_points.length; i++) {
					var dist = silhouette_dist_metric(point, c_points[i]);
					a += dist;
				}
				a /= c_points.length - 1;
			}
			var b = Infinity;
			for (i = 0; i < data.length; i++) {
				if (cluster.name != data[i].name) {
					var o_data = points_accessor(data[i]);
					var o_points = o_data.map(point_accessor);
					var sum = 0;
					for (j = 0; j < o_points.length; j++) {
						sum += silhouette_dist_metric(point, o_points[j]);
					}
					sum /= o_points.length;
					if (sum < b) {
						b = sum;
					}
				}
			}
			return (b - a) / Math.max(a, b);
		}
	}
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var graph;

	var node_to_community = new Map();

	function execute() {
		var i, j;
		var tree, tree_node;
		var node;
		var edge;
		var ebc;
		var clone_edges = graph.edges().slice(0);
		var children_ids;
		var max, max_edge_index;
		var community;
		var leave;

		for (i = 0; i < graph.nodes().length; i++) {
			node = graph.nodes()[i];
			node_to_community.set(node.id, 0);
		}

		tree_node = {
			id: 0,
			com_id: 0,
			name: '',
			value: {
				nodes: []
			},
			children: [],
			metric: 0,
			m: 0
		};
		tree = tree_node;

		var communities = [graph.nodes()];
		communities.id = 0;
		var pre_communities = communities;
		tree_node.value.nodes = communities[0];
		tree_node.m = communities[0].length;
		var level = graph.nodes().length + 10;
		var id = 0;
		var name;
		while (graph.edges().length > 0) {
			ebc = (0, _EdgeBetweennessCentrality2.default)().graph(graph);

			ebc();

			max = -Infinity;
			max_edge_index = 0;

			graph.edges().forEach(function (edge, i) {
				if (max < edge.edge_betweenness) {
					max_edge_index = i;
					max = edge.edge_betweenness;
				}
			});
			edge = graph.edges()[max_edge_index];
			graph.remove_edge(edge);

			pre_communities = communities;
			communities = communitiy_detection(graph, communities);

			if (pre_communities.length < communities.length) {
				leave = tree_leave(tree);
				for (i = 0; i < leave.length; i++) {
					if (leave[i].com_id === pre_communities.break_id) {
						tree_node = leave[i];
						break;
					}
				}
				children_ids = pre_communities[pre_communities.break_id].children_ids;
				for (i = 0; i < children_ids.length; i++) {
					name = '';
					community = communities[children_ids[i]];
					if (community.length === 1) {
						name = community[0].name;
					}
					tree_node.children.push({
						id: ++id,
						com_id: community.id,
						name: name,
						value: {
							nodes: community
						},
						children: [],
						m: community.length,
						metric: --level
					});
				}
			}
		}

		graph.edges(clone_edges);
		graph.create();
		return tree;
	}

	function communitiy_detection(graph, parent_communities) {
		var i, node;
		var nodes = graph.nodes();
		var node_map = (0, _utils.array2map)(nodes, function (d) {
			return d.id;
		});
		var source;
		var source_com_id;
		//stores the current set of community ids
		var com_ids = new Set();
		var communities = [];
		var com;
		var com_id;
		while (!node_map.size === 0) {
			source = (0, _utils.map2values)(node_map)[0];
			//get the current community id for the node
			source_com_id = node_to_community.get(source.id);
			//if the source node has a community id that's already been used
			if (com_ids.has(source_com_id)) {
				//create a new id for the community
				com_id = parent_communities.length;
				//mark the id for the community to be splited
				parent_communities.break_id = source_com_id;
				parent_communities[source_com_id].children_ids = [source_com_id, com_id];
			} else {
				//use the current id
				com_id = source_com_id;
				//add the id to the community set indicating the id is already used
				com_ids.add(com_id);
			}
			com = community(source);
			com.id = com_id;
			com.parent_id = source_com_id;
			communities[com_id] = com;
		}

		//update the node to community map
		communities.forEach(function (community, i) {
			community.forEach(function (node, j) {
				node_to_community.set(node.id, community.id);
			});
		});

		return communities;

		//depth first search to detect community given a source node
		function community(source) {
			var i;
			var node;
			var community_nodes = [];
			var neighbor;
			var neighbors;
			var visited_nodes = new Set();

			var stack = new Array();
			stack.push(source);

			visited_nodes.add(source.id);
			node_map.delete(source.id);
			community_nodes.push(source);

			while (stack.length > 0) {
				node = stack.pop();
				neighbors = node.all_neighbors();
				for (i = 0; i < neighbors.length; i++) {
					neighbor = neighbors[i];
					if (!visited_nodes.has(neighbor.id)) {
						visited_nodes.add(neighbor.id);

						node_map.delete(neighbor.id);
						community_nodes.push(neighbor);

						stack.push(neighbor);
					}
				}
			}
			return community_nodes;
		}
	}

	function tree_leave(tree) {
		var leave = [];
		recurse(tree);
		return leave;
		function recurse(r) {
			if (r) {
				if (!r.children || r.children.length === 0) leave.push(r);else r.children.forEach(recurse);
			}
		}
	}

	function ret() {
		return execute();
	}

	ret.graph = function (_) {
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	return ret;
};

var _EdgeBetweennessCentrality = __webpack_require__(3);

var _EdgeBetweennessCentrality2 = _interopRequireDefault(_EdgeBetweennessCentrality);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	return new KMean();
};

exports.KMean = KMean;

var _utils = __webpack_require__(0);

var _Evaluation = __webpack_require__(1);

var _Evaluation2 = _interopRequireDefault(_Evaluation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function KMean() {
	/*
 * Data needs to be a json array of form [{name, value:{point:[1, 2, 3]}}]
 * each data point will be automatically assigned an id, which by default is the index
 */
	var data;
	/*
 * The default accesor is value.point
 */
	var accessor = function accessor(d) {
		return d.value.point;
	};
	/*
 * Define the maximum number of iteration
 */
	var numIteration = null;
	/*
 * Define the stopping threshold for distance move of centroid
 */
	var stopThreshold = 0;

	/*
 * Flag to indicate whether to save history of the kmeans algorithm
 */
	var save_history = false;
	/*
 * Flag to indicate whether to evaluate sse for the output cluster
 */
	var evaluate_sse = false;
	/*
 * Store the historical clusters for each iteration
 */
	var history = [];
	/*
 * [{name:'C1', value:{centroid:[1, 2], points:[
 	{
 		name, value : {point}
 	}
 ]}}]
 */
	var clusters;
	/*
 * Stores the sse
 */
	var sse = null;
	/*
 * distance metric for two points, the default is Euclidean distance
 */
	var dist_metric = function dist_metric(a, b) {
		var sum = 0;
		for (var i = 0; i < a.length; i++) {
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	};

	var centroid_fun = function centroid_fun(points) {
		return mean(points);
	};

	this.cluster = function () {
		//util functions
		function assign_point(d) {
			var minCluster = clusters[0];
			var minDist = Number.POSITIVE_INFINITY;
			clusters.forEach(function (g) {
				var point = accessor(d);
				var dist = dist_metric(point, g.value.centroid);
				if (dist < minDist) {
					minDist = dist;
					minCluster = g;
				}
			});

			minCluster.value.points.push(d);
		}

		/*
  * Perform kmean clsutering algorithm
  */
		var continue_flag = true;
		var iter = 0,
		    i = 0;
		do {
			++iter;
			//reset all cluster points
			clusters.forEach(function (c) {
				c.value.points = [];
			});

			//compute the distance of each point with the centroid and update
			//cluster assignment
			data.forEach(assign_point);

			continue_flag = false;
			//compute the new centroid
			var c;
			for (i = 0; i < clusters.length; i++) {
				c = clusters[i];
				if (c.value.points.length > 0) {
					var points = c.value.points.map(accessor);
					var new_centroid = centroid_fun(points);
					//compute the distance between the new centroid and old centoid
					var dist_moved = euclidean_distance(new_centroid, c.value.centroid);
					c.value.centroid = new_centroid;
					if (dist_moved > stopThreshold) continue_flag = true;
				}
			}
			/*
   * Evaluate the final clusters
   */
			if (evaluate_sse) {
				sse = 0;
				clusters.forEach(function (d) {
					var s = (0, _Evaluation2.default)().data(d.value.points).accessor(function (d) {
						'use strict';

						return d.value.point;
					}).SSE(d.value.centroid);
					d.value.sse = s;
					sse += s;
				});
				// if(clusters.length > 0)
				// 	sse /= clusters.length;
			}

			//save the cluster as history
			if (save_history) {
				history.push(JSON.parse(JSON.stringify(clusters)));
			}

			//decide whether to continue
			if (numIteration && iter >= numIteration) {
				continue_flag = false;
			}
		} while (continue_flag);
		return this;
	};

	this.data = function (_) {
		return arguments.length > 0 ? (data = _, this) : data;
	};

	this.accessor = function (_) {
		return arguments.length > 0 ? (accessor = _, this) : accessor;
	};

	this.dist_metric = function (_) {
		return arguments.length > 0 ? (dist_metric = _, this) : dist_metric;
	};

	this.clusters = function (_) {
		return arguments.length > 0 ? (clusters = _, this) : clusters;
	};
	this.numIteration = function (_) {
		return arguments.length > 0 ? (numIteration = _, this) : numIteration;
	};
	this.stopThreshold = function (_) {
		return arguments.length > 0 ? (stopThreshold = _, this) : stopThreshold;
	};
	this.save_history = function (_) {
		return arguments.length > 0 ? (save_history = _, this) : save_history;
	};
	this.evaluate_sse = function (_) {
		return arguments.length > 0 ? (evaluate_sse = _, this) : evaluate_sse;
	};
	this.centroid_fun = function (_) {
		if (arguments.length === 0) {
			return centroid_fun;
		} else if (Object.prototype.toString.call(_) === '[object String]') {
			switch (_) {
				case 'mean':
					centroid_fun = mean;
					break;
				case 'median':
					centroid_fun = median;
					break;
				default:
					centroid_fun = mean;
			}
			return this;
		} else {
			centroid_fun = _;
			return this;
		}
	};

	this.history = function () {
		return history;
	};
	this.sse = function () {
		return sse;
	};

	function euclidean_distance(a, b) {
		var sum = 0;
		for (var i = 0; i < a.length; i++) {
			sum += (a[i] - b[i]) * (a[i] - b[i]);
		}
		return Math.sqrt(sum);
	}

	function mean(v) {
		var sum, i, j;
		if (v.length === 0) {
			return 0;
		} else if ((0, _utils.isArray)(v[0])) {
			sum = Array(v[0].length).fill(0);
			for (i = 0; i < v.length; i++) {
				for (j = 0; j < v[i].length; j++) {
					sum[j] += v[i][j];
				}
			}
			return sum.map(function (d) {
				return d / v.length;
			});
		} else {
			sum = 0;
			for (i = 0; i < v.length; i++) {
				sum += v[i];
			}
			return sum / v.length;
		}
	}

	function median(v) {
		var vv;
		if (v.length === 0) {
			return 0;
		} else if ((0, _utils.isArray)(v[0])) {
			vv = v.slice(0);
			//TODO: implement the incremental estimation of median
		} else {
			vv = v.slice(0);
			vv.sort(function (a, b) {
				return a - b;
			});
			return vv[vv.length / 2];
		}
	}
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var graph;
	var source, target;
	/*
 * 1) in
 * 2) out
 * 3) undirected
 */
	var direction = 'undirected';
	var include_self_path = false;

	function value_comparator(v1, v2) {
		return v1 - v2;
	}
	function node_comparator(n1, n2) {
		return value_comparator(n1.dk_status.metric, n2.dk_status.metric);
	}
	function init_metric() {
		return Infinity;
	}
	function init_source_metric() {
		return 0;
	}

	function multi_source() {
		var paths = graph.nodes().reduce(function (pre, cur, ind) {
			source = cur;
			return pre.concat(single_source());
		}, []);

		source = target = undefined;
		return paths;
	}

	function single_source() {
		if (direction === 'undirected') single_source_undirected();else if (direction === 'in') single_source_in();else if (direction === 'out') single_source_out();else single_source_out();
		return all_paths();
	}

	//this is testing the undirected only
	function single_source_undirected() {
		var i, j;
		var nodes = graph.nodes();
		var edges = graph.edges();
		var cur_node;
		var alt;
		var neighbor;
		var edge;

		init_nodes(nodes);

		var Q = new _jsPriorityQueue2.default({ comparator: node_comparator });

		for (i = 0; i < nodes.length; i++) {
			Q.queue(nodes[i]);
		}

		while (Q.length && Q.length > 0) {
			cur_node = Q.dequeue();

			for (i = 0; i < cur_node.edges().length; i++) {
				edge = cur_node.edges()[i];
				neighbor = cur_node.neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if (value_comparator(alt, neighbor.dk_status.metric) < 0) {
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
		return ret;
	}

	function single_source_in() {
		var i, j;
		var nodes = graph.nodes();
		var edges = graph.edges();
		var cur_node;
		var alt;
		var neighbor;
		var edge;

		init_nodes(nodes);

		var Q = new _jsPriorityQueue2.default({ comparator: node_comparator });

		for (i = 0; i < nodes.length; i++) {
			Q.queue(nodes[i]);
		}

		while (Q.length && Q.length > 0) {
			cur_node = Q.dequeue();
			for (i = 0; i < cur_node.in_edges().length; i++) {
				edge = cur_node.in_edges()[i];
				neighbor = cur_node.in_neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if (value_comparator(alt, neighbor.dk_status.metric) < 0) {
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
		return ret;
	}

	function single_source_out() {
		var i, j;
		var nodes = graph.nodes();
		var edges = graph.edges();
		var cur_node;
		var alt;
		var neighbor;
		var edge;

		init_nodes(nodes);

		var Q = new _jsPriorityQueue2.default({ comparator: node_comparator });

		for (i = 0; i < nodes.length; i++) {
			Q.queue(nodes[i]);
		}

		while (Q.length && Q.length > 0) {
			cur_node = Q.dequeue();
			for (i = 0; i < cur_node.out_edges().length; i++) {
				edge = cur_node.out_edges()[i];
				neighbor = cur_node.out_neighbor(edge);
				alt = edge.value + cur_node.dk_status.metric;
				if (value_comparator(alt, neighbor.dk_status.metric) < 0) {
					neighbor.dk_status.metric = alt;
					neighbor.dk_status.backpointer = cur_node;
				}
			}
		}
		return ret;
	}
	function init_nodes(nodes) {
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].dk_status = {};
			nodes[i].dk_status.backpointer = null;
			if (nodes[i] === source) {
				nodes[i].dk_status.metric = init_source_metric();
			} else {
				nodes[i].dk_status.metric = init_metric();
			}
		}
	}

	function all_paths() {
		var i, j;
		var nodes = graph.nodes();
		var node;
		var paths = [];
		var path;

		for (i = 0; i < nodes.length; i++) {
			path = [];
			node = nodes[i];
			do {
				path.unshift(node);
			} while (node = node.dk_status.backpointer);
			if (include_self_path || path.length > 1) if (path[0] === source) paths.push(path);
		}
		return paths;
	}

	function ret() {
		if (source && !target) {
			return single_source();
		} else if (!source && !target) {
			return multi_source();
		}
	}

	ret.graph = function (_) {
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	ret.source = function (_) {
		return arguments.length > 0 ? (source = _, ret) : source;
	};

	ret.target = function (_) {
		return arguments.length > 0 ? (target = _, ret) : target;
	};

	ret.direction = function (_) {
		return arguments.length > 0 ? (direction = _, ret) : direction;
	};

	ret.comparator = function (_) {
		if (arguments.length > 0) value_comparator = _;
		return ret;
	};

	ret.init_metric = function (_) {
		if (arguments.length > 0) init_metric = _;
		return ret;
	};

	ret.init_source_metric = function (_) {
		if (arguments.length > 0) init_source_metric = _;
		return ret;
	};

	ret.self_path = function (_) {
		return arguments.length > 0 ? (include_self_path = _, ret) : include_self_path;
	};

	return ret;
};

var _jsPriorityQueue = __webpack_require__(13);

var _jsPriorityQueue2 = _interopRequireDefault(_jsPriorityQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PriorityQueue = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var AbstractPriorityQueue, ArrayStrategy, BHeapStrategy, BinaryHeapStrategy, PriorityQueue,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AbstractPriorityQueue = _dereq_('./PriorityQueue/AbstractPriorityQueue');

ArrayStrategy = _dereq_('./PriorityQueue/ArrayStrategy');

BinaryHeapStrategy = _dereq_('./PriorityQueue/BinaryHeapStrategy');

BHeapStrategy = _dereq_('./PriorityQueue/BHeapStrategy');

PriorityQueue = (function(superClass) {
  extend(PriorityQueue, superClass);

  function PriorityQueue(options) {
    options || (options = {});
    options.strategy || (options.strategy = BinaryHeapStrategy);
    options.comparator || (options.comparator = function(a, b) {
      return (a || 0) - (b || 0);
    });
    PriorityQueue.__super__.constructor.call(this, options);
  }

  return PriorityQueue;

})(AbstractPriorityQueue);

PriorityQueue.ArrayStrategy = ArrayStrategy;

PriorityQueue.BinaryHeapStrategy = BinaryHeapStrategy;

PriorityQueue.BHeapStrategy = BHeapStrategy;

module.exports = PriorityQueue;


},{"./PriorityQueue/AbstractPriorityQueue":2,"./PriorityQueue/ArrayStrategy":3,"./PriorityQueue/BHeapStrategy":4,"./PriorityQueue/BinaryHeapStrategy":5}],2:[function(_dereq_,module,exports){
var AbstractPriorityQueue;

module.exports = AbstractPriorityQueue = (function() {
  function AbstractPriorityQueue(options) {
    var ref;
    if ((options != null ? options.strategy : void 0) == null) {
      throw 'Must pass options.strategy, a strategy';
    }
    if ((options != null ? options.comparator : void 0) == null) {
      throw 'Must pass options.comparator, a comparator';
    }
    this.priv = new options.strategy(options);
    this.length = (options != null ? (ref = options.initialValues) != null ? ref.length : void 0 : void 0) || 0;
  }

  AbstractPriorityQueue.prototype.queue = function(value) {
    this.length++;
    this.priv.queue(value);
    return void 0;
  };

  AbstractPriorityQueue.prototype.dequeue = function(value) {
    if (!this.length) {
      throw 'Empty queue';
    }
    this.length--;
    return this.priv.dequeue();
  };

  AbstractPriorityQueue.prototype.peek = function(value) {
    if (!this.length) {
      throw 'Empty queue';
    }
    return this.priv.peek();
  };

  AbstractPriorityQueue.prototype.clear = function() {
    this.length = 0;
    return this.priv.clear();
  };

  return AbstractPriorityQueue;

})();


},{}],3:[function(_dereq_,module,exports){
var ArrayStrategy, binarySearchForIndexReversed;

binarySearchForIndexReversed = function(array, value, comparator) {
  var high, low, mid;
  low = 0;
  high = array.length;
  while (low < high) {
    mid = (low + high) >>> 1;
    if (comparator(array[mid], value) >= 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
};

module.exports = ArrayStrategy = (function() {
  function ArrayStrategy(options) {
    var ref;
    this.options = options;
    this.comparator = this.options.comparator;
    this.data = ((ref = this.options.initialValues) != null ? ref.slice(0) : void 0) || [];
    this.data.sort(this.comparator).reverse();
  }

  ArrayStrategy.prototype.queue = function(value) {
    var pos;
    pos = binarySearchForIndexReversed(this.data, value, this.comparator);
    this.data.splice(pos, 0, value);
    return void 0;
  };

  ArrayStrategy.prototype.dequeue = function() {
    return this.data.pop();
  };

  ArrayStrategy.prototype.peek = function() {
    return this.data[this.data.length - 1];
  };

  ArrayStrategy.prototype.clear = function() {
    this.data.length = 0;
    return void 0;
  };

  return ArrayStrategy;

})();


},{}],4:[function(_dereq_,module,exports){
var BHeapStrategy;

module.exports = BHeapStrategy = (function() {
  function BHeapStrategy(options) {
    var arr, i, j, k, len, ref, ref1, shift, value;
    this.comparator = (options != null ? options.comparator : void 0) || function(a, b) {
      return a - b;
    };
    this.pageSize = (options != null ? options.pageSize : void 0) || 512;
    this.length = 0;
    shift = 0;
    while ((1 << shift) < this.pageSize) {
      shift += 1;
    }
    if (1 << shift !== this.pageSize) {
      throw 'pageSize must be a power of two';
    }
    this._shift = shift;
    this._emptyMemoryPageTemplate = arr = [];
    for (i = j = 0, ref = this.pageSize; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      arr.push(null);
    }
    this._memory = [];
    this._mask = this.pageSize - 1;
    if (options.initialValues) {
      ref1 = options.initialValues;
      for (k = 0, len = ref1.length; k < len; k++) {
        value = ref1[k];
        this.queue(value);
      }
    }
  }

  BHeapStrategy.prototype.queue = function(value) {
    this.length += 1;
    this._write(this.length, value);
    this._bubbleUp(this.length, value);
    return void 0;
  };

  BHeapStrategy.prototype.dequeue = function() {
    var ret, val;
    ret = this._read(1);
    val = this._read(this.length);
    this.length -= 1;
    if (this.length > 0) {
      this._write(1, val);
      this._bubbleDown(1, val);
    }
    return ret;
  };

  BHeapStrategy.prototype.peek = function() {
    return this._read(1);
  };

  BHeapStrategy.prototype.clear = function() {
    this.length = 0;
    this._memory.length = 0;
    return void 0;
  };

  BHeapStrategy.prototype._write = function(index, value) {
    var page;
    page = index >> this._shift;
    while (page >= this._memory.length) {
      this._memory.push(this._emptyMemoryPageTemplate.slice(0));
    }
    return this._memory[page][index & this._mask] = value;
  };

  BHeapStrategy.prototype._read = function(index) {
    return this._memory[index >> this._shift][index & this._mask];
  };

  BHeapStrategy.prototype._bubbleUp = function(index, value) {
    var compare, indexInPage, parentIndex, parentValue;
    compare = this.comparator;
    while (index > 1) {
      indexInPage = index & this._mask;
      if (index < this.pageSize || indexInPage > 3) {
        parentIndex = (index & ~this._mask) | (indexInPage >> 1);
      } else if (indexInPage < 2) {
        parentIndex = (index - this.pageSize) >> this._shift;
        parentIndex += parentIndex & ~(this._mask >> 1);
        parentIndex |= this.pageSize >> 1;
      } else {
        parentIndex = index - 2;
      }
      parentValue = this._read(parentIndex);
      if (compare(parentValue, value) < 0) {
        break;
      }
      this._write(parentIndex, value);
      this._write(index, parentValue);
      index = parentIndex;
    }
    return void 0;
  };

  BHeapStrategy.prototype._bubbleDown = function(index, value) {
    var childIndex1, childIndex2, childValue1, childValue2, compare;
    compare = this.comparator;
    while (index < this.length) {
      if (index > this._mask && !(index & (this._mask - 1))) {
        childIndex1 = childIndex2 = index + 2;
      } else if (index & (this.pageSize >> 1)) {
        childIndex1 = (index & ~this._mask) >> 1;
        childIndex1 |= index & (this._mask >> 1);
        childIndex1 = (childIndex1 + 1) << this._shift;
        childIndex2 = childIndex1 + 1;
      } else {
        childIndex1 = index + (index & this._mask);
        childIndex2 = childIndex1 + 1;
      }
      if (childIndex1 !== childIndex2 && childIndex2 <= this.length) {
        childValue1 = this._read(childIndex1);
        childValue2 = this._read(childIndex2);
        if (compare(childValue1, value) < 0 && compare(childValue1, childValue2) <= 0) {
          this._write(childIndex1, value);
          this._write(index, childValue1);
          index = childIndex1;
        } else if (compare(childValue2, value) < 0) {
          this._write(childIndex2, value);
          this._write(index, childValue2);
          index = childIndex2;
        } else {
          break;
        }
      } else if (childIndex1 <= this.length) {
        childValue1 = this._read(childIndex1);
        if (compare(childValue1, value) < 0) {
          this._write(childIndex1, value);
          this._write(index, childValue1);
          index = childIndex1;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return void 0;
  };

  return BHeapStrategy;

})();


},{}],5:[function(_dereq_,module,exports){
var BinaryHeapStrategy;

module.exports = BinaryHeapStrategy = (function() {
  function BinaryHeapStrategy(options) {
    var ref;
    this.comparator = (options != null ? options.comparator : void 0) || function(a, b) {
      return a - b;
    };
    this.length = 0;
    this.data = ((ref = options.initialValues) != null ? ref.slice(0) : void 0) || [];
    this._heapify();
  }

  BinaryHeapStrategy.prototype._heapify = function() {
    var i, j, ref;
    if (this.data.length > 0) {
      for (i = j = 1, ref = this.data.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
        this._bubbleUp(i);
      }
    }
    return void 0;
  };

  BinaryHeapStrategy.prototype.queue = function(value) {
    this.data.push(value);
    this._bubbleUp(this.data.length - 1);
    return void 0;
  };

  BinaryHeapStrategy.prototype.dequeue = function() {
    var last, ret;
    ret = this.data[0];
    last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._bubbleDown(0);
    }
    return ret;
  };

  BinaryHeapStrategy.prototype.peek = function() {
    return this.data[0];
  };

  BinaryHeapStrategy.prototype.clear = function() {
    this.length = 0;
    this.data.length = 0;
    return void 0;
  };

  BinaryHeapStrategy.prototype._bubbleUp = function(pos) {
    var parent, x;
    while (pos > 0) {
      parent = (pos - 1) >>> 1;
      if (this.comparator(this.data[pos], this.data[parent]) < 0) {
        x = this.data[parent];
        this.data[parent] = this.data[pos];
        this.data[pos] = x;
        pos = parent;
      } else {
        break;
      }
    }
    return void 0;
  };

  BinaryHeapStrategy.prototype._bubbleDown = function(pos) {
    var last, left, minIndex, right, x;
    last = this.data.length - 1;
    while (true) {
      left = (pos << 1) + 1;
      right = left + 1;
      minIndex = pos;
      if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0) {
        minIndex = left;
      }
      if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0) {
        minIndex = right;
      }
      if (minIndex !== pos) {
        x = this.data[minIndex];
        this.data[minIndex] = this.data[pos];
        this.data[pos] = x;
        pos = minIndex;
      } else {
        break;
      }
    }
    return void 0;
  };

  return BinaryHeapStrategy;

})();


},{}]},{},[1])(1)
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (indices, values, size) {
	return new SparseVector(indices, values, size);
};

exports.SparseVector = SparseVector;
;
function SparseVector(indices, values, size) {
	var self = this;
	//init the indices
	if (indices) this.indices = indices;else this.indices = [];
	//init the values
	if (values) this.values = values;else this.values = [];

	//init the size
	if (size) this.size = size;else if (this.indices.length === 0) {
		this.size = 0;
	} else {
		this.size = this.indices[this.indices.length - 1] + 1;
	}

	/*
  * get the dense vector array from the sparse vector
  */
	this.toDenseVector = function () {
		var vec = [];
		for (var i = 0; i < this.size; i++) {
			vec[i] = this.getValue(i);
		}
		return vec;
	};
	/*
  * Set the value of item in array given the index of value
  */
	this.setValue = function (index, value) {
		var location = this.locationAtIndex(index);
		if (location >= 0) {
			this.values[location] = value;
		} else if (location === -Infinity) {
			if (index >= this.size) this.size = index + 1;
			this.indices.splice(0, 0, index);
			this.values.splice(0, 0, value);
		} else {
			if (index >= this.size) {
				this.size = index + 1;
			}
			this.indices.splice(-location, 0, index);
			this.values.splice(-location, 0, value);
		}
	};
	/*
  * Compute the difference of two sparse vectors
  */
	this.diff = function (other) {
		'use strict';

		var indices = mergeArray(self.indices, other.indices);
		var values = [];
		indices.forEach(function (d, i) {
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if (location >= 0 && otherLocation >= 0) {
				values[i] = self.values[location] - other.values[otherLocation];
			} else if (location >= 0) {
				values[i] = self.values[location];
			} else if (otherLocation >= 0) {
				values[i] = -other.values[otherLocation];
			}
		});

		return new SparseVector(indices, values, Math.max(self.size, other.size));
	};

	/*
  * Compute the sum of two sparse vectors
  */
	this.sum = function (other) {
		'use strict';

		var indices = mergeArray(self.indices, other.indices);
		var values = [];
		indices.forEach(function (d, i) {
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if (location >= 0 && otherLocation >= 0) {
				values[i] = self.values[location] + other.values[otherLocation];
			} else if (location >= 0) {
				values[i] = self.values[location];
			} else if (otherLocation >= 0) {
				values[i] = other.values[otherLocation];
			}
		});
		return new SparseVector(indices, values, Math.max(self.size, other.size));
	};

	/*
  * Compute the L2 norm of two sparse vectors
  */
	this.L2norm = function () {
		'use strict';

		var sq = self.values.reduce(function (pre, cur, ind) {
			return pre + cur * cur;
		}, 0);

		return Math.sqrt(sq);
	};

	/*
  * Compute the dot product between two sparse vectors
  */
	this.dotp = function (other) {
		var r = 0;
		var indSet = new Set();
		self.indices.forEach(function (d) {
			indSet.add(d);
		});

		other.indices.forEach(function (d) {
			indSet.add(d);
		});

		indSet.forEach(function (d) {
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if (location >= 0 && otherLocation >= 0) {
				r += self.values[location] * other.values[otherLocation];
			}
		});
		return r;
	};

	/*
  * find the location of an index in an array
  * 	if found, return the location
  * 	if not found, return the negated would be location:
  *   - the location of largest index of smaller indexes - 1
  */
	this.locationAtIndex = function (index) {
		return binaryIndexOf(index, self.indices);
	};

	/*
  * find the index of a given location
  */
	this.indexAtLocation = function (location) {
		return self.indices[location];
	};

	/*
  * Get the value of item by index
  */
	this.getValue = function (index) {
		var location = self.locationAtIndex(index);
		var value = self.values[location];
		if (value) return self.values[location];else return 0;
	};

	/*
  * Compute the Cosine similarity of two sparse vectors
  */
	this.cosineSimilarity = function (other) {
		return self.dotp(other) / (self.L2norm() * other.L2norm());
	};

	/*
  * find the location of an item in an array
  * 	if found, return the location
  * 	if not found, return the negated would be location:
  *   location = - location of largest item smaller than the item - 1
  *   if the would be location happened to be zero, return -Infinity
  */
	function binaryIndexOf(searchElement, array) {
		'use strict';

		var minIndex = 0;
		var maxIndex = array.length - 1;
		var currentIndex;
		var currentElement;

		while (minIndex <= maxIndex) {
			currentIndex = (minIndex + maxIndex) / 2 | 0;
			currentElement = array[currentIndex];

			if (currentElement < searchElement) {
				minIndex = currentIndex + 1;
			} else if (currentElement > searchElement) {
				maxIndex = currentIndex - 1;
			} else {
				return currentIndex;
			}
		}

		return minIndex === 0 ? -Infinity : -minIndex;
	}

	/*
  * Merge two sorted arrays
  */
	function mergeArray(a, b) {
		var r = [];
		var i = 0,
		    j = 0,
		    k = 0;
		while (i < a.length && j < b.length) {
			if (a[i] < b[j]) {
				r[k] = a[i];
				++i;
				++k;
			} else if (a[i] > b[j]) {
				r[k] = b[j];
				++j;
				++k;
			} else {
				r[k] = a[i];
				++i;
				++j;
				++k;
			}
		}

		while (i < a.length) {
			r[k] = a[i];
			++i;
			++k;
		}

		while (j < b.length) {
			r[k] = b[j];
			++j;
			++k;
		}
		return r;
	}
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  /*
  * node {id, name}
  * edge {source, target, value}
  */
  var _nodes2, _edges;
  var _directed = true;

  var edge_map = new Map();
  var _init_id = false;

  function id_accessor(d) {
    return d.id;
  }

  /*
  * Init the graph given edges and nodes
  */
  function create() {
    var i;
    var node, edge;
    var source, target;

    if (_init_id) {
      for (i = 0; i < _nodes2.length; i++) {
        _nodes2[i].id = i;
      }
    }

    _edges.forEach(function (edge) {
      edge.id = edge_key_from_nodes(edge.source, edge.target);
    });
    _edges.forEach(function (edge) {
      edge_map.set(edge.id, edge);
    });

    for (i = 0; i < _nodes2.length; i++) {
      node = _nodes2[i];
      node._edges = [];
      node._in_edges = [];
      node._out_edges = [];
      node.edges = function () {
        return this._edges;
      };
      node.in_edges = function () {
        return this._in_edges;
      };
      node.out_edges = function () {
        return this.out_edges;
      };
    }

    for (i = 0; i < _edges.length; i++) {
      edge = _edges[i];
      source = edge.source;
      target = edge.target;

      source._edges.push(edge);
      target._edges.push(edge);
      source._out_edges.push(edge);
      target._in_edges.push(edge);
    }

    for (i = 0; i < _nodes2.length; i++) {
      node = _nodes2[i];
      node._all_neighbors = all_neighbors(node);
      node._all_in_neighbors = all_in_neighbors(node);
      node._all_out_neighbors = all_out_neighbors(node);

      node.all_neighbors = function () {
        return this._all_neighbors;
      };
      node.all_in_neighbors = function () {
        return this._all_in_neighbors;
      };
      node.all_out_neighbors = function () {
        return this._all_out_neighbors;
      };
      node.neighbor = function () {
        return neighbor(this, edge);
      };
      node.in_neighbor = function () {
        return in_neighbor(this, edge);
      };
      node.out_neighbor = function () {
        return out_neighbor(this, edge);
      };
    }
    return ret;
  }

  function sub_graph(_nodes) {
    _nodes2 = _nodes;
    var node_map = (0, _utils.array2map)(_nodes2, function (d) {
      return d.id;
    });
    _edges = _edges.filter(function (edge) {
      return node_map.has(edge.source.id) || node_map.has(edge.target.id);
    });
    return create();
  }

  function remove_edge(edge) {
    var i;
    for (i = 0; i < edge.source._edges.length; i++) {
      if (edge.id === edge.source._edges[i].id) {
        edge.source._edges.splice(i, 1);
        break;
      }
    }

    for (i = 0; i < edge.target._edges.length; i++) {
      if (edge.id === edge.target._edges[i].id) {
        edge.target._edges.splice(i, 1);
        break;
      }
    }

    for (i = 0; i < edge.source._out_edges.length; i++) {
      if (edge.id === edge.source._out_edges[i].id) {
        edge.source._out_edges.splice(i, 1);
        break;
      }
    }

    for (i = 0; i < edge.target._in_edges.length; i++) {
      if (edge.id === edge.target._in_edges[i].id) {
        edge.target._in_edges.splice(i, 1);
        break;
      }
    }
    edge.source._all_neighbors = all_neighbors(edge.source);
    edge.target._all_neighbors = all_neighbors(edge.target);

    edge.source._all_out_neighbors = all_out_neighbors(edge.source);
    edge.target._all_in_neighbors = all_in_neighbors(edge.target);

    for (i = 0; i < _edges.length; i++) {
      if (edge === _edges[i]) {
        _edges.splice(i, 1);
        break;
      }
    }

    edge_map.delete(edge.id);
    return ret;
  }

  function edge(n1, n2) {
    return edge_from_nodes(n1, n2);
  }

  function edge_from_nodes(n1, n2) {
    var key = edge_key_from_nodes(n1, n2);
    return edge_map.get(key);
  }

  function edge_from_ids(id1, id2) {
    var key = edge_key_from_ids(id1, id2);
    return edge_map.get(key);
  }

  function undirected_edge(n1, n2) {
    return undirected_edge_from_nodes(n1, n2);
  }

  function undirected_edge_from_nodes(n1, n2) {
    var key = edge_key_from_nodes(n1, n2);
    var edge = edge_map.get(key);
    if (edge) return edge;
    return edge_map.get(edge_key_from_nodes(n2, n1));
  }

  function undirected_edge_from_ids(id1, id2) {
    var key = edge_key_from_ids(id1, id2);
    var edge = edge_map.get(key);
    if (edge) return edge;
    return edge_map.get(edge_key_from_ids(id2, id1));
  }

  function edge_key_from_ids(id1, id2) {
    return id1 + '-' + id2;
  }

  function edge_key_from_nodes(n1, n2) {
    var id1 = id_accessor(n1);
    var id2 = id_accessor(n2);
    return edge_key_from_ids(id1, id2);
  }

  function all_in_neighbors(node) {
    return node._in_edges.map(function (d, i) {
      return d.source;
    });
  }

  function all_out_neighbors(node) {
    return node._out_edges.map(function (d, i) {
      return d.target;
    });
  }

  function all_neighbors(node) {
    var neighbors = [];
    var edge;
    var i;
    for (i = 0; i < node._edges.length; i++) {
      edge = node._edges[i];
      neighbors.push(neighbor(node, edge));
    }
    return neighbors;
  }

  function neighbor(node, edge) {
    if (edge.source === node) {
      return edge.target;
    } else if (edge.target === node) {
      return edge.source;
    } else {
      return null;
    }
  }

  function in_neighbor(node, edge) {
    if (edge.target === node) {
      return edge.source;
    } else {
      return null;
    }
  }

  function out_neighbor(node, edge) {
    if (edge.source === node) {
      return edge.target;
    } else {
      return null;
    }
  }

  var ret = {
    'nodes': function nodes(_) {
      return arguments.length > 0 ? (_nodes2 = _, this) : _nodes2;
    },
    'edges': function edges(_) {
      return arguments.length > 0 ? (_edges = _, this) : _edges;
    },
    'id': function id(_) {
      if (arguments.length > 0) id_accessor = _;
      return this;
    },
    'init_id': function init_id(_) {
      _init_id = _;return this;
    },
    'directed': function directed(_) {
      return arguments.length > 0 ? (_directed = _, this) : _directed;
    },
    'create': create,
    'edge': edge,
    'undirected_edge': undirected_edge,
    'remove_edge': remove_edge,
    'sub_graph': sub_graph
  };

  return ret;
};

var _utils = __webpack_require__(0);

;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.nominal_distance = nominal_distance;
exports.nominal_similarity = nominal_similarity;
exports.ordinal_distance = ordinal_distance;
exports.ordian_similarity = ordian_similarity;
exports.ratio_distance = ratio_distance;
exports.ratio_similarity = ratio_similarity;
exports.ratio_similarity1 = ratio_similarity1;
exports.euclidean_distance = euclidean_distance;
exports.minkowski_distance = minkowski_distance;
exports.mahalanobis_distance = mahalanobis_distance;
exports.jaccard_similarity = jaccard_similarity;
exports.jaccard_distance = jaccard_distance;
exports.tanimoto_similarity = tanimoto_similarity;
exports.tanimoto_distance = tanimoto_distance;
exports.smc_similarity = smc_similarity;
exports.smc_distance = smc_distance;
exports.cosine_distance = cosine_distance;
exports.cosine_similarity = cosine_similarity;
exports.correlation_similarity = correlation_similarity;
exports.correlation_distance = correlation_distance;

var _statistic = __webpack_require__(2);

/*
* Similarity/Dissimilarity for Simple Attributes
*/
function nominal_distance(a, b) {
	return a === b ? 1 : 0;
}

function nominal_similarity(a, b) {
	return 1 - nominal_distance(a, b);
}

function ordinal_distance(a, b, n) {
	return Math.abs(a - b) / (n - 1);
}

function ordian_similarity(a, b, n) {
	return 1 - ordinal_distance(a, b, n);
}

function ratio_distance(a, b) {
	return Math.abs(a - b);
}

function ratio_similarity(a, b, min, max) {
	if (arguments.length == 2) return 1 - ratio_distance(a, b);else if (arguments.length == 4) {
		return 1 - (ratio_distance(a, b) - min) / (max - min);
	}
}

function ratio_similarity1(a, b) {
	return -ratio_distance(a, b);
}

/*
* Similarity/Dissimilarity for Data Objects
*/
function euclidean_distance(a, b) {
	var sum = 0;
	for (var i = 0; i < a.length; i++) {
		sum += (a[i] - b[i]) * (a[i] - b[i]);
	}
	return Math.sqrt(sum);
}

function minkowski_distance(a, b, r) {
	var i;
	if (r == Infinity) {
		var max_dist = -Infinity;
		for (i = 0; i < a.length; i++) {
			var dist = Math.abs(a[i] - b[i]);
			if (dist > max) {
				max = dist;
			}
		}
		return max_dist;
	} else {
		var sum = 0;
		for (i = 0; i < a.length; i++) {
			sum += Math.pow(Math.abs(a[i] - b[i]), r);
		}
		return Math.pow(sum, 1 / r);
	}
}

function mahalanobis_distance(a, b, sigma) {}

function jaccard_similarity(a, b) {
	var m01 = 0,
	    m10 = 0,
	    m00 = 0,
	    m11 = 0;
	for (var i = 0; i < a.length; i++) {
		if (a[i] == b[i] == 1) ++m11;else if (a[i] === 1 && b[i] === 0) ++m10;else if (a[i] === 0 && b[i] === 1) ++m01;else if (a[i] === 0 && b[i] === 0) ++m00;
	}
	return m01 + m10 + m11 > 0 ? m11 / (m01 + m10 + m11) : 1;
}

function jaccard_distance(a, b) {
	return 1 - jaccard_similarity(a, b);
}

function tanimoto_similarity(a, b) {
	var sum = 0,
	    i = 0;
	for (i = 0; i < a.length; i++) {
		sum += a[i] * b[i];
	}
	var a_square = 0;
	for (i = 0; i < a.length; i++) {
		a_square += a[i] * a[i];
	}
	var b_square = 0;
	for (i = 0; i < b.length; i++) {
		b_square += b[i] * b[i];
	}
	return sum / (a_square + b_square - sum);
}
function tanimoto_distance(a, b) {
	return 1 - tanimoto_similarity(a, b);
}

function smc_similarity(a, b) {
	var m01 = 0,
	    m10 = 0,
	    m00 = 0,
	    m11 = 0;
	for (var i = 0; i < a.length; i++) {
		if (a[i] == b[i] == 1) ++m11;else if (a[i] === 1 && b[i] === 0) ++m10;else if (a[i] === 0 && b[i] === 1) ++m01;else if (a[i] === 0 && b[i] === 0) ++m00;
	}
	return (m11 + m00) / (m01 + m10 + m11 + m00);
}

function smc_distance(a, b) {
	return 1 - smc_similarity(a, b);
}

function cosine_distance(a, b) {
	return 1 - cosine_similarity(a, b);
}

function cosine_similarity(a, b) {
	var sum = 0;
	for (var i = 0; i < a.length; i++) {
		sum += a[i] * b[i];
	}
	return sum / ((0, _statistic.L2_norm)(a) * (0, _statistic.L2_norm)(b));
}

function correlation_similarity(a, b) {
	var ma = (0, _statistic.mean)(a);
	var mb = (0, _statistic.mean)(b);
	var sa = (0, _statistic.std)(a);
	var sb = (0, _statistic.std)(b);
	if (sa === 0 && sb === 0) {
		return 1;
	} else if (sa === 0 || sb === 0) {
		return 0;
	}

	var ak = a.map(function (d) {
		return (d - ma) / sa;
	});
	var bk = b.map(function (d) {
		return (d - mb) / sb;
	});
	return (0, _statistic.dotp)(ak, bk);
}

function correlation_distance(a, b) {
	return -correlation_similarity(a, b);
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.array2clustering = array2clustering;
exports.array2points = array2points;
/*
* Given array [[[..],[..]],
	[..],
	[..]]

  make a cluster object from it
*/
function array2clustering(arr) {
	var point_name = 0;
	return arr.map(function (d, i) {
		return {
			name: 'C' + i,
			value: {
				points: d.map(function (g, j) {
					++point_name;
					return {
						name: point_name.toString(),
						value: {
							point: g
						}
					};
				})
			}
		};
	});
};

/*
* Given array [[..], [..], [..]]
* Make point objects from it
*/
function array2points(arr) {
	return arr.map(function (d, i) {
		return {
			name: (i + 1).toString(),
			value: {
				point: d
			}
		};
	});
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=clustering.js.map