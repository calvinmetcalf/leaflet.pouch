function(doc){
	if(doc.geometry && doc.properties){
		emit(doc.geometry, doc);
	}
}