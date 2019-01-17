"use strict";

//const conString = "postgres://postgres:postgres@localhost:61392/snippet";

// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: "postgres://postgres:postgres@localhost:61392/snippet",
//   ssl: true
// });
// const { Client } = require('pg')
// let db = null;
// const client = new Client({
// 	user: 'postgres',
// 	host: 'localhost',
// 	database: 'snippet',
// 	password: 'postgres',
// 	port: 61392
// 	});


var functions = require("./functions.js");
var	dbconfig = require("../config/dbconfig.json")
const { Client } = require('pg')
const client = new Client(dbconfig.dbcredentials);
client.connect();

exports.getSnippets = function(req, res){
	if( req.query.id != undefined || req.query.name != undefined ||	req.query.description != undefined ||
		req.query.author != undefined || req.query.language != undefined || req.query.code != undefined || 
		req.query.tags != undefined )
		getSnippetWithAttributes(req, res);
	else if(Object.keys(req.query).length == 0)
		getAllSnippets(req, res);
	else
		functions.error404function(req, res);
};

function getAllSnippets(req, res) {
	client.query('SELECT * FROM snippet;').then(function(dbres){
		var retString = "";	
		var count = 0;
		for(let row of dbres.rows){
			retString += "\"" + count + "\":" + JSON.stringify(row) + ",";
			count++;
		}
		retString = "{" + retString.substring(0,retString.length -1) + "}";
		console.log(retString);
		var retJson = JSON.pars(retString);
		res.send(retJson);
	}).catch(function(dberr){
		if(dberr.code === "42P01")
			functions.error404function(req, res);
		else if(dberr.code === "42703")
			functions.error400function(req, res);
		else
			functions.error500function(req, res);
	});
}

function getSnippetWithAttributes(req, res) {
	res.send({url: req.originalUrl, type: "get snippets with attributes", callStatus: "success"});
}

exports.postSnippet = function(req, res){
	res.send({url: req.originalUrl, type: "post snippets", callStatus: "success"});
};

exports.getSnippetById = function(req, res){
	res.send({url: req.originalUrl, type: "get snippet id", callStatus: "success"});
};

exports.updateSnippetById = function(req, res){
	res.send({url: req.originalUrl, type: "put snippet with id", callStatus: "success"});
};

exports.deleteSnippetById = function(req, res){
	res.send({url: req.originalUrl, type: "delete snippet with id", callStatus: "success"});
};

exports.error404function =  function(req, res){
	res.status(404).send({url: req.originalUrl + ' not found'});
};