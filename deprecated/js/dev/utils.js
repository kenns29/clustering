function isArray(v){
	return Object.prototype.toString.call(v) === '[object Array]';
}

dm.isArray = isArray;