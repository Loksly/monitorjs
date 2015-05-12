/* global __dirname */
/* global process */
(function(process){
'use strict';
	
	var	path = require('path'),
		express = require('express'),
		app = express(),
		monitorjs = require('./lib/monitor.js'),
		port = process.env.PORT ? process.env.PORT : 9999;
	
	app.use('/api/', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	
	app.get('/api/filesystem', function(req, res){
		monitorjs.filesystemsList().then(function(result){
			res.jsonp(result);
		});
	});
	
	app.get('/api/processes', function(req, res){
		monitorjs.processList(10, 'cpu', false).then(function(result){
			res.jsonp(result);
		});
	});
	
	app.get('/api/processes/:limit', function(req, res){
		monitorjs.processList(req.params.limit ? parseInt(req.params.limit) : 10, 'cpu', false).then(function(result){
			res.jsonp(result);
		});
	});
	
	app.get('/api/processes/:limit/:field', function(req, res){
		monitorjs.processList(req.params.limit ? parseInt(req.params.limit) : 10, req.params.field, false).then(function(result){
			res.jsonp(result);
		});
	});
	
	app.get('/api/processesTree', function(req, res){
		monitorjs.processTreeList(10, 'cpu', false).then(function(result){
			res.jsonp(result);
		});
	});
	
	app.get('/api/processesTree/:limit', function(req, res){
		monitorjs.processTreeList(req.params.limit ? parseInt(req.params.limit) : 10, 'cpu', false).then(function(result){
			res.jsonp(result);
		});
	});
	
	app.get('/api/processesTree/:limit/:field', function(req, res){
		monitorjs.processTreeList(req.params.limit ? parseInt(req.params.limit) : 10, req.params.field, false).then(function(result){
			res.jsonp(result);
		});
	});
	
	app.get('/api/profile', function(req, res){
		monitorjs.profileList().then(function(result){
			res.jsonp(result);
		});
	});
	
	app.get('/api/memory', function(req, res){
		monitorjs.memoryStatus().then(function(result){
			res.jsonp(result);
		});
	});
	
	app.use(express.static(path.join(__dirname, 'public')));
	app.listen(port);
	console.log('Server listening on port ' + port);
})(process);
