function graph(){
	/*
	* node {id, name, edges, in_edges, out_edges}
	* edge {source, target, value}
	*/
	var nodes, edges;

	/*
	* Init the graph given edges and nodes
	*/
	function init(){

	}
    
    function all_in_neighbors(node){
		return node.in_edges.map(function(d, i){
			return d.source;
		});  	
    }

    function all_out_neighbors(node){
    	return node.out_edges.map(function(d, i){
    		return d.target;
    	});
    }

    function all_neighbors(node){
    	var neighbors = [];
    	var edge;
    	var i;
    	for(i = 0; i < node.edges.length; i++){
    		edge = node.edges[i];
    		neighbors.push(neighbor(node, edge));
    	}
    	return neighbors;
    } 

    function neighbor(node, edge){
    	if(edge.source === node){
    		return edge.target;
    	}
    	else if(edge.target === node){
    		return edge.source;
    	}
    	else{
    		return null;
    	}
    }

	var ret = {
		'nodes' : function(_){
			return arguments.length > 0 ? (nodes = _, this) : nodes;
		},
		'edges' : function(_){
			return arguments.length > 0 ? (edges = _, this) : edges;
		}
	};

	return ret;


	//Utilities

	//Template function for node
	function all_in_neighbors_OF_Node(){
		return all_in_neighbors(this);
	}

	function all_out_neighbors_OF_Node(){
		return all_out_neighbors(this);
	}

	function all_neighbors_OF_Node(){
		return all_neighbors(this);
	}
}