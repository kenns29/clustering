/*
* Similarity/Dissimilarity for Simple Attributes
*/
function nominal_distance(a, b){
	return (a === b) ? 1 : 0;
}

function nominal_similarity(a, b){
	return 1 - nominal_distance(a, b);
}

function ordinal_distance(a, b, n){
	return Math.abs(a - b) / (n - 1);
}

function ordian_similarity(a, b, n){
	return 1 - ordinal_distance(a, b, n);
}

function ratio_distance(a, b){
	return Math.abs(a - b);
}

function ratio_similarity(a, b, min, max){
	if(arguments.length == 2)
		return 1-ratio_distance(a, b);
	else if(arguments.length == 4){
		return 1 - (ratio_distance(a, b) - min) / (max - min);
	}
}

function ratio_similarity1(a, b){
	return -ratio_distance(a, b);
}

/*
* Similarity/Dissimilarity for Data Objects
*/
function euclidean_distance(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += (a[i] - b[i]) * (a[i] - b[i]);
	}
	return Math.sqrt(sum);
}

function minkowski_distance(a, b, r){
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

function mahalanobis_distance(a, b, sigma){

}

function jaccard_similarity(a, b){
	var m01 = 0, m10 = 0, m00 = 0, m11 = 0;
	for(var i = 0; i < a.length; i++){
		if(a[i] == b[i] == 1) ++m11;
		else if(a[i] === 1 && b[i] === 0) ++m10;
		else if(a[i] === 0 && b[i] === 1) ++m01;
		else if(a[i] === 0 && b[i] === 0) ++m00;
	}
	return (m01 + m10 + m11 > 0) ? m11 / (m01 + m10 + m11) : 1;
}

function jaccard_distance(a, b){
	return 1 - jaccard_similarity(a, b);
}

function tanimoto_similarity(a, b){
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
function tanimoto_distance(a, b){
	return 1 - tanimoto_similarity(a, b);
}

function smc_similarity(a, b){
	var m01 = 0, m10 = 0, m00 = 0, m11 = 0;
	for(var i = 0; i < a.length; i++){
		if(a[i] == b[i] == 1) ++m11;
		else if(a[i] === 1 && b[i] === 0) ++m10;
		else if(a[i] === 0 && b[i] === 1) ++m01;
		else if(a[i] === 0 && b[i] === 0) ++m00;
	}
	return (m11 + m00) / (m01 + m10 + m11 + m00);
}

function smc_distance(a, b){
	return 1 - smc_similarity(a, b);
}

function cosine_distance(a, b){
	return 1 - cosine_similarity(a, b);
}

function cosine_similarity(a, b){
	var sum = 0;
	for(var i = 0; i < a.length; i++){
		sum += a[i] * b[i];
	}
	return sum / (L2_norm(a) * L2_norm(b));
}

function correlation_similarity(a, b){
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

function correlation_distance(a, b){
	return -correlation_similarity(a, b);
}



dm.nominal_distance = nominal_distance;
dm.nominal_similarity = nominal_similarity;
dm.ordinal_distance = ordinal_distance;
dm.ordian_similarity = ordian_similarity;
dm.ratio_distance = ratio_distance;
dm.ratio_similarity = ratio_similarity;
dm.ratio_similarity1 = ratio_similarity1;
/*
* Similarity/Dissimilarity for Data Objects
*/
dm.euclidean_distance = euclidean_distance;
dm.minkowski_distance = minkowski_distance;
dm.mahalanobis_distance = mahalanobis_distance;
dm.jaccard_similarity = jaccard_similarity;
dm.jaccard_distance = jaccard_distance;
dm.tanimoto_similarity = tanimoto_similarity;
dm.tanimoto_distance = tanimoto_distance;
dm.smc_similarity = smc_similarity;
dm.smc_distance = smc_distance;
dm.cosine_distance = cosine_distance;
dm.cosine_similarity = cosine_similarity;
dm.correlation_similarity = correlation_similarity;
dm.correlation_distance = correlation_distance;