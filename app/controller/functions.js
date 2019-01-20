"use strict";

var functions = require("./functions.js");
var	logindata = require("../config/logindata.json")
const { Client } = require('pg')
const client = new Client(logindata.dblogindata);
client.connect();

exports.getSnippets = function(req, res){
	if( req.query.id != undefined || req.query.name != undefined ||	req.query.description != undefined ||
		req.query.author != undefined || req.query.language != undefined || req.query.code != undefined || 
		req.query.tags != undefined )
		getSnippetWithAttributes(req, res);
	else if(Object.keys(req.query).length == 0)
		getAllSnippets(req, res);
	else
		functions.error404(req, res);
};

function getAllSnippets(req, res) {
	client.query('SELECT * FROM snippet;').then(function(result){
		var dbresult = "";	
		var count = 0;
		for(let row of result.rows){
			dbresult += "\"" + count + "\":" + JSON.stringify(row) + ",";
			count++;
		}
		dbresult = "{" + dbresult.substring(0, dbresult.length -1) + "}";
		var retJson = JSON.parse(dbresult);
		res.send(retJson);
	}).catch(function(error){
		if(error.code === "42P01")
			functions.error404(req, res);
		else if(error.code === "42703")
			functions.error400(req, res);
		else{
			functions.error500(req, res);
		}
	});
}

function getSnippetWithAttributes(req, res) {
	var id = '%';
	if(req.query.id !== undefined)
		id = "%" + req.query.id + "%";
	var name = '%';
	if(req.query.name !== undefined)
		name = "%" + req.query.name + "%";	
	var description = '%';
	if(req.query.description !== undefined)
		description = "%" + req.query.description + "%";
	var author = '%';
	if(req.query.author !== undefined)
		author = "%" + req.query.author + "%";
	var language = '%';
	if(req.query.language !== undefined)
		language = "%" + req.query.language + "%";
	var code = '%';
	if(req.query.code !== undefined)
		code = "%" + req.query.code + "%";
	var tags = "";
	if(req.query.tags !== undefined)
		tags = " AND '" + req.query.tags + "' = ANY(tags)";

	client.query('SELECT * FROM snippet WHERE ID::text LIKE $1 AND name LIKE $2 AND description LIKE $3 AND author LIKE $4 AND language LIKE $5 AND code LIKE $6' + tags,
	 [id, name, description, author, language, code]).then(function(result){
		var dbresult = "";	
		var count = 0;
		for(let row of result.rows){
			dbresult += "\"" + count + "\":" + JSON.stringify(row) + ",";
			count++;
		}
		dbresult = "{" + dbresult.substring(0, dbresult.length -1) + "}";
		var retJson = JSON.parse(dbresult);
		res.send(retJson);
	}).catch(function(error){
		if(error.code === "42P01")
			functions.error404(req, res);
		else if(error.code === "42703")
			functions.error400(req, res);
		else{
			functions.error500(req, res);
		}
	});
}

exports.postSnippet = function(req, res){
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
		functions.error422(req, res);
		return;
	}
	client.query('INSERT INTO snippet VALUES(DEFAULT, $1, $2, $3, $4, $5, $6);',[req.body.name, req.body.description, req.body.author, req.body.language, req.body.code, req.body.tags]).then(function(result){
	res.send({url: req.originalUrl, type: "post snippets", callStatus: "success"});
	}).catch(function(error){
		if(error.code === "42P01")
			functions.error404(req, res);
		else if(error.code === "42703")
			functions.error400(req, res);
		else{
			functions.error500(req, res);
		}
	});	
};

exports.getSnippetById = function(req, res){	
	client.query('SELECT * FROM snippet WHERE id=$1;',[req.path.substr(req.path.length - 1)]).then(function(result){
		var dbresult = JSON.stringify(result.rows[0]);	
		var retJson = JSON.parse(dbresult);
		res.send(retJson);
	}).catch(function(error){
		if(error.code === "42P01")
			functions.error404(req, res);
		else if(error.code === "42703")
			functions.error400(req, res);
		else{
			functions.error500(req, res);
		}
	});
};

exports.updateSnippetById = function(req, res){
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
		functions.error422(req, res);
		return;
	}
	client.query('UPDATE snippet SET name = $1, description = $2, author = $3, language = $4, code = $5, tags = $6 WHERE id=$7;',
		[req.body.name, req.body.description, req.body.author, req.body.language, req.body.code, req.body.tags, req.path.substr(req.path.length - 1)]).then(function(result){
	res.send({url: req.originalUrl, type: "put snippet", callStatus: "success"});
	}).catch(function(error){
		if(error.code === "42P01"){
			functions.error404(req, res);
		}
		else if(error.code === "42703")
			functions.error400(req, res);
		else{
			functions.error500(req, res);
		}
	});	};

exports.deleteSnippetById = function(req, res){
	client.query('DELETE FROM snippet WHERE id=$1;',[req.path.substr(req.path.length - 1)]).then(function(result){
		res.send({url: req.originalUrl, type: "delete snippet", callStatus: "success"});
	}).catch(function(error){
		if(error.code === "42P01")
			functions.error404(req, res);
		else if(error.code === "42703")
			functions.error400(req, res);
		else{
			functions.error500(req, res);
		}
	});
};

exports.error404 =  function(req, res){
	res.status(404).send({url: req.originalUrl + ' not found'});
};

exports.error400 =  function(req, res){
	res.status(400).send({url: req.originalUrl + ' request error'});
};

exports.error500 =  function(req, res){
	res.status(500).send({url: req.originalUrl + ' server error'});
};

exports.error422 =  function(req, res){
	res.status(422).send({url: req.originalUrl + ' invalid JSON'});
};