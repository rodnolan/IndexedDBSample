app.setupScreen = function(){

	"use strict";
	
	var pub = {};
	pub.onDOMReady = function(event) {

	};


	pub.populateDatabase = function () {
		var fillUpData = [
			{
				APpoints:"28",
				litrePrice:"118.5", 
				litresTotal:"66.296", 
				fillUpDate:"2012-11-01"
			},
			{
				fillUpDate:"2012-11-09", 
				litrePrice:"120.3", 
				litresTotal:"60.453", 
				APpoints:"27"
			}
		];

		for(var i in fillUpData){
			var transaction = app.database.db.transaction([OBJECTSTORE_NAME], "readwrite");
			var objectStore = transaction.objectStore(OBJECTSTORE_NAME);
			var request; 
			
			transaction.oncomplete = function(event){
				console.log('finished app.db.populate!');
			};
			transaction.onerror = app.database.onError;

		
			request = objectStore.put(fillUpData[i]);
			request.oncomplete = function (event) {
				console.log("request completed successfully");
			};
			request.onerror = app.database.onError;
			request.onsuccess = function(event) {
				console.log("item added with key: " + event.target.result);
			};
		}

	};

	pub.clearObjectStore = function (objectStoreNames) {
		var transaction = app.database.db.transaction(objectStoreNames, "readwrite");
		var objectStore = transaction.objectStore(OBJECTSTORE_NAME);
		var request = objectStore.clear(); 
			
		request.oncomplete = function (event) {
			console.log("request completed successfully");
		};
		request.onerror = app.database.onError;
		request.onsuccess = function(event) {
			console.log("item added with key: " + event.target.result);
		};
		
		transaction.oncomplete = function(event){
			console.log('finished app.db.populate!');
		};
		transaction.onerror = app.database.onError;

	};


	return pub;
});