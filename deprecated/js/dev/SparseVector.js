function SparseVector(indices, values, size){
	var self = this;
	//init the indices
	if(indices)
		this.indices = indices;
	else
		this.indices = [];
	//init the values
	if(values)
		this.values = values;
	else 
		this.values = [];
	
	//init the size
	if(size)
		this.size = size;
	else if(this.indices.length === 0){
		this.size = 0;
	}
	else{
		this.size = this.indices[this.indices.length -1] + 1;
	}
		
	
	/*
	 * get the dense vector array from the sparse vector
	 */
	this.toDenseVector = function(){
		var vec = [];
		for(var i = 0; i < this.size; i++){
			vec[i] = this.getValue(i);
		}
		return vec;
	};
	/*
	 * Set the value of item in array given the index of value
	 */
	this.setValue = function(index, value){
		var location = this.locationAtIndex(index);
		if(location >= 0){
			this.values[location] = value;
		}
		else if(location === -Infinity){
			if(index >= this.size)
				this.size = index + 1;
			this.indices.splice(0, 0, index);
			this.values.splice(0, 0, value);
		}
		else{
			if(index >= this.size){
				this.size = index + 1;
			}
			this.indices.splice(-location, 0, index);
			this.values.splice(-location, 0, value);
		}
	};
	/*
	 * Compute the difference of two sparse vectors
	 */
	this.diff = function(other) {
		'use strict';
		var indices = mergeArray(self.indices, other.indices);
		var values = [];
		indices.forEach(function(d, i){
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if(location >= 0 && otherLocation >= 0){
				values[i] = self.values[location] - other.values[otherLocation];
			}
			else if(location >= 0){
				values[i] = self.values[location];
			}
			else if(otherLocation >= 0){
				values[i] = -other.values[otherLocation];
			}
		});

		return new SparseVector(indices, values, Math.max(self.size, other.size));
	};
	
	/*
	 * Compute the sum of two sparse vectors
	 */
	this.sum = function(other) {
		'use strict';
		var indices = mergeArray(self.indices, other.indices);
		var values = [];
		indices.forEach(function (d, i) {
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if(location >= 0 && otherLocation >= 0){
				values[i] = self.values[location] + other.values[otherLocation];
			}
			else if(location >= 0){
				values[i] = self.values[location];
			}
			else if(otherLocation >= 0){
				values[i] = other.values[otherLocation];
			}
		});
		return new SparseVector(indices, values, Math.max(self.size, other.size));
	};
	
	/*
	 * Compute the L2 norm of two sparse vectors
	 */
	this.L2norm = function(){
		'use strict';
		var sq = self.values.reduce(function(pre, cur, ind) {
			return pre + cur*cur;
		}, 0);
		
		return Math.sqrt(sq);
	};
	
	/*
	 * Compute the dot product between two sparse vectors
	 */
	this.dotp = function(other) {
		var r = 0;
		var indSet = new Set();
		self.indices.forEach(function (d) {
			indSet.add(d);
		});
		
		other.indices.forEach(function (d) {
			indSet.add(d);
		});
		
		indSet.forEach(function (d) {
			var location = self.locationAtIndex(d);
			var otherLocation = other.locationAtIndex(d);
			if(location >= 0 && otherLocation >= 0){
				r += self.values[location] * other.values[otherLocation];
			}
		});
		return r;
	};
	
	/*
	 * find the location of an index in an array 
	 * 	if found, return the location
	 * 	if not found, return the negated would be location:
	 *   - the location of largest index of smaller indexes - 1  
	 */
	this.locationAtIndex = function(index) {
		return binaryIndexOf(index, self.indices);
	};
	
	/*
	 * find the index of a given location 
	 */
	this.indexAtLocation = function(location) {
		return self.indices[location];
	};
	
	/*
	 * Get the value of item by index
	 */
	this.getValue = function(index) {
		var location = self.locationAtIndex(index);
		var value = self.values[location];
		if(value)
			return self.values[location];
		else
			return 0;
	};
	
	/*
	 * Compute the Cosine similarity of two sparse vectors
	 */
	this.cosineSimilarity = function(other) {
		return self.dotp(other) / (self.L2norm() * other.L2norm());
	};
	
	/*
	 * find the location of an item in an array 
	 * 	if found, return the location
	 * 	if not found, return the negated would be location:
	 *   location = - location of largest item smaller than the item - 1  
	 *   if the would be location happened to be zero, return -Infinity
	 */
	function binaryIndexOf(searchElement, array) {
	    'use strict';
	    var minIndex = 0;
	    var maxIndex = array.length - 1;
	    var currentIndex;
	    var currentElement;
	 
	    while (minIndex <= maxIndex) {
	        currentIndex = (minIndex + maxIndex) / 2 | 0;
	        currentElement = array[currentIndex];
	 
	        if (currentElement < searchElement) {
	            minIndex = currentIndex + 1;
	        }
	        else if (currentElement > searchElement) {
	            maxIndex = currentIndex - 1;
	        }
	        else {
	            return currentIndex;
	        }
	    }
	 
	    return (minIndex === 0) ? -Infinity : -minIndex;
	}
	
	/*
	 * Merge two sorted arrays
	 */
	function mergeArray(a, b) {
		var r = [];
		var i=0, j=0, k=0;
		while(i < a.length && j < b.length){
			if(a[i] < b[j]){
				r[k] = a[i];
				++i;
				++k;
			}
			else if(a[i] > b[j]){
				r[k] = b[j];
				++j;
				++k;
			}
			else{
				r[k] = a[i];
				++i;
				++j;
				++k;
			}
		}
		
		while(i < a.length){
			r[k] = a[i];
			++i;
			++k;			
		}
		
		while(j < b.length){
			r[k] = b[j];
			++j;
			++k;
		}
		return r;
	}
}

dm.SparseVector = SparseVector;