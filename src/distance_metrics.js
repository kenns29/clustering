/*
* Similarity/Dissimilarity for Simple Attributes
*/
export function nominal_distance(a, b){
	return (a === b) ? 1 : 0;
}

export function nominal_similarity(a, b){
	return 1 - nominal_distance(a, b);
}

export function ordinal_distance(a, b, n){
	return Math.abs(a - b) / (n - 1);
}

export function ordian_similarity(a, b, n){
	return 1 - ordinal_distance(a, b, n);
}

export function ratio_distance(a, b){
	return Math.abs(a - b);
}

export function ratio_similarity(a, b, min, max){
	if(arguments.length == 2)
		return 1-ratio_distance(a, b);
	else if(arguments.length == 4){
		return 1 - (ratio_distance(a, b) - min) / (max - min);
	}
}

export function ratio_similarity1(a, b){
	return -ratio_distance(a, b);
}

/*
* Similarity/Dissimilarity for Data Objects
*/
export function euclidean_distance(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += (a[i] - b[i]) * (a[i] - b[i]);
	}
	return Math.sqrt(sum);
}

export function minkowski_distance(a, b, r){
	var i;
	if(r == Infinity){
		var max_dist = -Infinity;
		for(i = 0; i < a.length; i++){
			var dist = Math.abs(a[i] - b[i]);
			if(dist > max){
				max = dist;
			}
		}
		return max_dist;
	}
	else{
		var sum = 0;
		for(i = 0; i < a.length; i++){
			sum += Math.pow(Math.abs(a[i] - b[i]), r);
		}
		return Math.pow(sum, 1/r);
	}
}

export function mahalanobis_distance(a, b, sigma){

}

export function jaccard_similarity(a, b){
	var m01 = 0, m10 = 0, m00 = 0, m11 = 0;
	for(var i = 0; i < a.length; i++){
		if(a[i] == b[i] == 1) ++m11;
		else if(a[i] === 1 && b[i] === 0) ++m10;
		else if(a[i] === 0 && b[i] === 1) ++m01;
		else if(a[i] === 0 && b[i] === 0) ++m00;
	}
	return (m01 + m10 + m11 > 0) ? m11 / (m01 + m10 + m11) : 1;
}

export function jaccard_distance(a, b){
	return 1 - jaccard_similarity(a, b);
}

export function tanimoto_similarity(a, b){
	var sum = 0, i = 0;
	for(i = 0; i < a.length; i++){
		sum += a[i] * b[i];
	}
	var a_square = 0;
	for(i = 0; i < a.length; i++){
		a_square += a[i] * a[i];
	}
	var b_square = 0;
	for(i = 0; i < b.length; i++){
		b_square += b[i] * b[i];
	}
	return sum / (a_square + b_square - sum);
}
export function tanimoto_distance(a, b){
	return 1 - tanimoto_similarity(a, b);
}

export function smc_similarity(a, b){
	var m01 = 0, m10 = 0, m00 = 0, m11 = 0;
	for(var i = 0; i < a.length; i++){
		if(a[i] == b[i] == 1) ++m11;
		else if(a[i] === 1 && b[i] === 0) ++m10;
		else if(a[i] === 0 && b[i] === 1) ++m01;
		else if(a[i] === 0 && b[i] === 0) ++m00;
	}
	return (m11 + m00) / (m01 + m10 + m11 + m00);
}

export function smc_distance(a, b){
	return 1 - smc_similarity(a, b);
}

export function cosine_distance(a, b){
	return 1 - cosine_similarity(a, b);
}

export function cosine_similarity(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += a[i] * b[i];
	}
	return sum / (L2_norm(a) * L2_norm(b));
}

export function correlation_similarity(a, b){
	var ma = mean(a);
	var mb = mean(b);
	var sa = std(a);
	var sb = std(b);
	if (sa === 0 && sb === 0){
		return 1;
	}
	else if(sa === 0 || sb === 0){
		return 0;
	}

	var ak = a.map(function(d){
		return (d - ma) / sa;
	});
	var bk = b.map(function(d){
		return (d - mb) / sb;
	});
	return dotp(ak, bk);
}

export function correlation_distance(a, b){
	return -correlation_similarity(a, b);
}
