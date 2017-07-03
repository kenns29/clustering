(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dm"] = factory();
	else
		root["dm"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(2);

Object.defineProperty(exports, 'isArray', {
  enumerable: true,
  get: function get() {
    return _utils.isArray;
  }
});

var _distance_metrics = __webpack_require__(3);

Object.keys(_distance_metrics).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _distance_metrics[key];
    }
  });
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isArray = isArray;
function isArray(v) {
	return Object.prototype.toString.call(v) === '[object Array]';
};

/***/ }),
/* 3 */
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
	return sum / (L2_norm(a) * L2_norm(b));
}

function correlation_similarity(a, b) {
	var ma = mean(a);
	var mb = mean(b);
	var sa = std(a);
	var sb = std(b);
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
	return dotp(ak, bk);
}

function correlation_distance(a, b) {
	return -correlation_similarity(a, b);
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=dm.js.map