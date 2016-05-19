function isArray(v){
	return Object.prototype.toString.call(v) === '[object Array]';
}

function output(s){
	d3.select('#json-output').append('pre').html(s);
}

function pretty_print(obj){
	return JSON.stringify(obj, null, 2);
}