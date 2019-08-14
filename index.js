/* global __dirname */
/* global process */
(function(process, logger){
'use strict';

	function errorHandler(res){
		return function(err){
			res.status(500).jsonp(err);
		};
	}

	function okHandler(res){
		return function(result){
			res.jsonp(result);
		};
	}
	
	const path = require('path'),
		express = require('express'),
		fs = require('fs'),
		app = express(),
		monitorjs = require('./lib/monitor.js'),
		port = process.env.PORT ? process.env.PORT : 9999,
		staticfiles = JSON.parse(fs.readFileSync(path.join(__dirname, 'staticfiles.json'), 'utf8'));
	
	app.use('/api/', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	}).get('/api/filesystem', function(req, res){
		monitorjs.filesystemsList().then(okHandler(res), errorHandler(res));
	}).get('/api/processes', function(req, res){
		monitorjs.processList(10, 'cpu', false).then(okHandler(res), errorHandler(res));
	}).get('/api/processes/:limit', function(req, res){
		monitorjs.processList(req.params.limit ? parseInt(req.params.limit, 10) : 10, 'cpu', false).then(okHandler(res), errorHandler(res));
	}).get('/api/processes/:limit/:field', function(req, res){
		monitorjs.processList(req.params.limit ? parseInt(req.params.limit, 10) : 10, req.params.field, false).then(okHandler(res), errorHandler(res));
	}).get('/api/processesTree', function(req, res){
		monitorjs.processTreeList(10, 'cpu', false).then(okHandler(res), errorHandler(res));
	}).get('/api/processesTree/:limit', function(req, res){
		monitorjs.processTreeList(req.params.limit ? parseInt(req.params.limit, 10) : 10, 'cpu', false).then(okHandler(res), errorHandler(res));
	}).get('/api/processesTree/:limit/:field', function(req, res){
		monitorjs.processTreeList(req.params.limit ? parseInt(req.params.limit, 10) : 10, req.params.field, false).then(okHandler(res), errorHandler(res));
	}).get('/api/profile', function(req, res){
		monitorjs.profileList().then(okHandler(res), errorHandler(res));
	}).get('/api/memory', function(req, res){
		monitorjs.memoryStatus().then(okHandler(res), errorHandler(res));
	});

	const staticContent = staticfiles.filter((s) => s.files).reduce((p, c) => {
		p.set(c.name, {
			name: c.name,
			content: c.files.reduce((content, filename) => {
				content.push(fs.readFileSync(path.join(__dirname, filename), 'utf8'));

				return content;
		}, []).join("\n")
		});

		return p;
	}, new Map());

	staticfiles.forEach((sm) => {
		app.get('/' + sm.name, function(req, res) {
			if (staticContent.get(sm.name)) {
				res.header('Content-type', sm.mimetype);
				res.send(staticContent.get(sm.name).content);
			} else {
				res.sendFile(path.resolve(__dirname, sm.file));
			}
		});
	});
	
	app.use(express.static(path.join(__dirname, 'public')));
	app.listen(port);
	logger.log('Server listening on port', port);

})(process, console);
