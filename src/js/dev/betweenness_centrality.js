function edge_betweenness_centrality(){
	var graph;
	var edge;
	
	function ret(){

	}

	ret.graph = function(_){
		return arguments.length > 0 ? (graph = _, ret) : graph;
	};

	return ret;
}