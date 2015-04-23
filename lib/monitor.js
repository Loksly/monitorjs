(function(module){
	'use strict';

	var	child_process = require('child_process'),
		njds = require('nodejs-disks'),
		q = require('q'),
		os = require('os');

	module.exports.profileList = function(){
		//pretend to be async, first approach
		var defer = q.defer();
		defer.resolve(
		{
			loadavg: os.loadavg(),
			totalmem: os.totalmem(),
			freemem: os.freemem(),
			cpus: os.cpus(),
			hostname: os.hostname(),
			time: new Date()
		});
		return defer.promise;
	};


	module.exports.filesystemsList = function(){
		var defer = q.defer();

		njds.drives(function (err, drives) {
			if (err){
				defer.reject(err);
				return;
			}
			njds.drivesDetail( drives, function (erro, data) {
				if (err){
					defer.reject(erro);
				}else{
					defer.resolve(data);
				}
			});
		});
		return defer.promise;
	};


	module.exports.processList = function(max, sortby, asc) {
		var defer = q.defer();
		child_process.exec('ps -Awo comm,pid,pcpu,pmem', function (error, stdout, stderr) {
			if (error){
				defer.reject(error);
				console.error(stderr);
				return;
			}
			var processes = [];
			var psout = stdout.split("\n");
			psout.shift();
			psout.forEach(function(processdetails){
				var parts = processdetails.trim().split(' ').filter(function(a){ return a; }); //TODO: replace this, although it works but it's not very elegant
				if (parts.length >= 4) {
					var mem = parts.pop(), cpu = parts.pop(), pid = parts.pop();
					processes.push( {
						commandname: parts.join(' '),
						pid: pid,
						cpu: cpu,
						mem: mem
					});
				}
			});
			processes.sort(function(a, b){ return (asc) ? ( a[sortby] - b[sortby] ) : ( b[sortby] - a[sortby] ); });
			defer.resolve( processes.slice(0, max) );
		});
		return defer.promise;
	};
})(module);
