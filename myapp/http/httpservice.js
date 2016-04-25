var express = require( 'express' );
var app = express();
var apiUrl = require( '../config/apiUrl' );
var pierLog = require( '../pierlog.js' );


function apiAccess( url, message ){
	this.url = url;
	this.message = message;
	this.get = function(){
		console.log( 'dddddddd' );
		return { 'a':123,'b':234 };
	}
}

module.exports = apiAccess;