export function isArray(v){
	return Object.prototype.toString.call(v) === '[object Array]';
};

export function array2map (array, key){
	const f = key_functor(key);
	return array.reduce(
		(pre, cur) => pre.set(f(cur), cur),
		new Map()
	);
};
export function map2values(map){
	const values = Array(map.size);
	let idx = 0;
	map.forEach(value=>{values[idx++] = value;});
	return values;
};

export function functor(f){
	return typeof f === 'function' ? f : function(){return f;};
};

export function key_functor(f){
	return typeof f === 'function' ? f : function(d){return d[f];};
};