import {isArray} from './utils.js';
export function corr(v){
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		var SIGMA = cov(v);
		var standard_dev = std(v);
		for(var i = 0 ; i < SIGMA.length; i++){
			for(var j = 0; j < SIGMA.length; j++){
				if(standard_dev[i] === standard_dev[j] === 0){
					SIGMA[i][j] = 1;
				}
				else if(standard_div[i] === 0 || standard_dev[j] === 0){
					SIGMA[i][j] = 0;
				}
				else{
					SIGMA[i][j] /= (standard_dev[i] * standard_dev[j]);
				}
			}
		}
		return SIGMA;
	}
	else{
		return std(v);
	}
};

/*
* Compute the covariance matrix of data points a and b
* both a and b are matrix in which the rows represent the data points and
* the columns represent the attributes
* the matrix is in the form of array of array[[data point],[data point],[data point]...]
*/
export function cov(v){
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		var m = mean(v);
		var matrix = Array(v[0].length).fill(Array(v[0].length).fill(0));
		for(var i = 0; i < v[0].length; i++){
			for(var j = 0; j < v[0].length; j++){
				var sum = 0;
				for(var k = 0; k < v.length; k++){
					sum += (v[k][i] - m[i]) * (v[k][j] - m[j]);
				}
				matrix[i][j] = sum / v.length;
			}
		}
		return matrix;
	}
	else{
		return variance(v);
	}
}

function variance(v){
	var m, sum, i, j;
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		m = mean(v);
		sum = Array(v[0]).fill(0);
		for(i = 0; i < v.length; i++){
			for(j = 0; j < v[i].length; j++){
				sum[j] += (v[i][j] - m[j]) * (v[i][j] - m[j]);
			}
		}
		return sum.map(function(d){return d/v.length;});
	}
	else{
		if(v.length <= 1) return 0;
		m = mean(v);
		sum = 0;
		for(i = 0; i < v.length;i++){
			sum += (v[i] - m) * (v[i] - m);
		}
		return sum / (v.length - 1);
	}
}

export function mean(v){
	var sum, i, j;
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		sum = Array(v[0].length).fill(0);
		for(i = 0; i < v.length; i++){
			for(j = 0; j < v[i].length; j++){
				sum[j] += v[i][j];
			}
		}
		return sum.map(function(d){return d/v.length;});
	}
	else{
		sum = 0;
		for(i =0; i < v.length; i++){
			sum += v[i];
		}
		return sum / v.length;
	}
}

export function std(v){
	if(v.length === 0){
		return 0;
	}
	else if(isArray(v[0])){
		return variance(v).map(function(d){
			return Math.sqrt(d);
		});
	}
	else{
		return Math.sqrt(variance(v));
	}
}

export function L1_norm(v){
	if(v.length === 0) return 0;
	return v.reduce(function(pre, cur, ind){
		return pre + Math.abs(cur);
	}, 0);
}

export function L2_norm(v){
	if(v.length === 0) return 0;
	var sum = v.reduce(function(pre, cur, ind){
		return pre + cur * cur;
	}, 0);

	return Math.sqrt(sum);
}

export function dotp(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += a[i] * b[i];
	}
	return sum;
}

export function mult_m(a, b){

}

//find inverse of matrix m
export function inv_m(m){

}