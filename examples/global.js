function output(s){
	d3.select('#json-output').append('pre').html(s);
}

function pretty_print(obj){
	return JSON.stringify(obj, null, 2);
}