app.databaseUtils = function(){

	"use strict";

	var DATABASE_NAME = "gasTrackerIDB",
		OBJECTSTORE_NAME = "fillUpsStore",
		DATABASE_VERSION = "1",
		idb = null,
		pub = {};

	window.indexedDB = window.indexedDB || window.webkitIndexedDB;,
	if ('webkitIndexedDB' in window) {
		window.IDBTransaction = window.webkitIDBTransaction;
		window.IDBKeyRange = window.webkitIDBKeyRange;
	}


	pub.handleError = function (e) {
		console.log("error: " + e);
	};
	pub.doOpenSuccess = function(event) {
		console.log("in doOpenSuccess");
		idb = event.target.result;
	};
	
	pub.openDatabase = function () {
		console.log("in pub.openDatabase");
		var openRequest = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
		
		openRequest.onsuccess = pub.doOpenSuccess;
		openRequest.onupgradeneeded = pub.doUpgrade;
		//openRequest.oncomplete = pub.getAll;
		openRequest.onerror = pub.handleError;
		
		console.log("finished app.database.open");
	};
	
	pub.doDatabaseUpgrade = function(event) {
		console.log("start doDatabaseUpgrade from " + event.oldVersion + " to " + event.newVersion);
		var idb;

		if (!pub.idb) {
			idb = pub.idb = event.target.result;
		}
		try {
			idb.deleteObjectStore(OBJECTSTORE_NAME);
		} catch (e) {}
		
		var objectStore = idb.createObjectStore(OBJECTSTORE_NAME, {keyPath:"fillUpDate", autoIncrement:"true"});
		objectStore.createIndex("fillUpDateIdx","fillUpDate");

		console.log("finished doUpgrade " + counter++);	
	};

	return pub;
});