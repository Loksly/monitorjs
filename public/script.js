/* global angular */
(function(angular){
	'use strict';
	angular.module('monitorjs', ['ngRoute', 'ngAnimate']).config(['$routeProvider', function($routeProvider){
			$routeProvider.when('/', {templateUrl: 'partials/dashboard.html', controller: 'DashboardCtrl'});
			$routeProvider.when('/details/:index', {templateUrl: 'partials/dashboard.html', controller: 'DashboardCtrl'});
			$routeProvider.otherwise({redirectTo: '/'});

		}]).directive('server', function() {
			return {
				restrict: 'E',
				scope: {server: '=urlprefix', timeout: '=timeout', index: '=index', detailed: '=detailed'},
				controller: function($scope, $http, $interval, $location) {
					$scope.update = function (){
						/* TODO: add history record between executions, so we can compare and see how it evolves */
						$http.get($scope.server + 'api/filesystem').then(function(data) {
							$scope.filesystems = data.data;
						}, function(){
							Reflect.deleteProperty($scope.filesystems);
						});
						$http.get($scope.server + 'api/profile').then(function(data) {
							$scope.profile = data.data;
							$scope.profile.occupedpercent = 100 - (data.data.freemem * 100 / data.data.totalmem);
						}, function(){
							Reflect.deleteProperty($scope.profile);
						});
						$http.get($scope.server + 'api/processesTree/' + $scope.maxprocesses + '/' + $scope.sortby).then(function(data) {
							$scope.processes = data.data;
						}, function(){
							Reflect.deleteProperty($scope.processes);
						});
						$http.get($scope.server + 'api/memory' ).then(function(data) {
							$scope.memory = data.data;
							$scope.memory.available = data.data.MemFree + data.data.Cached;
							$scope.memory.occuped = data.data.MemTotal - $scope.memory.available;
							$scope.memory.rate = {
								occuped: 100 * $scope.memory.occuped / $scope.memory.MemTotal,
								cached: 100 * $scope.memory.Cached / $scope.memory.MemTotal
							};
							$scope.memory.occupedKB = $scope.toHumanReadable($scope.memory.occuped);
							$scope.memory.cachedKB = $scope.toHumanReadable($scope.memory.Cached);
						}, function(){
							Reflect.deleteProperty($scope.memory);
						});
					};
					$scope.mutex = function(){
						$scope.showprocesses = !$scope.showprocesses;
						$scope.showdrives = !$scope.showprocesses;
					};
					$scope.setSortBy = function(field){
						$scope.sortby = field;
						$scope.update();
					};

					$scope.toHumanReadable = function(kilobytes){

						//this could have been implemented as a filter but I guess this runs faster or at least as fast an isolated one can
						var units = ['MB', 'GB', 'TB'];
						var value = parseFloat(kilobytes);

						var hr = units.reduce(function(p, u){
							if (p.value > 1024){
								p.value = value / 1024;
								p.unit = u;
							}

							return p;
						}, {value: value, unit: 'KB'});

						return hr.value.toFixed(1) + ' ' + hr.unit;
					};

					$scope.showprocesses = true;
					$scope.maxprocesses = $scope.detailed ? 100 : 10;
					$scope.sortby = 'cpu';
					$scope.update();
					$scope.mutex();

					$scope.progressClass = function(percent){
						if (percent > 0.8) return 'bg-danger';
						if (percent > 0.6) return 'bg-warning';
						if (percent > 0.4) return 'bg-info';
						return 'bg-success';
					};
					$scope.trClass = function(percent){
						if (percent > 0.3) return 'table-danger';
						if (percent > 0.2) return 'table-warning';
						if (percent > 0.1) return 'table-info';
						return 'table-success';
					};
					$scope.alertClass = function(percent){
						if (percent > 0.8) return 'alert-danger';
						if (percent > 0.6) return 'alert-warning';
						if (percent > 0.4) return 'alert-info';
						return 'alert-success';
					};
					$scope.focus = function(index){
						$location.url('/details/' + index);
					};
					var listeners = [
						$interval($scope.update, $scope.timeout * 10000),
						$interval($scope.mutext, $scope.timeout * 5000)
					];
					$scope.$on('$destroy', function(){
						listeners.foreach(function(f){
							$interval.cancel(f);
						});
					});
				},
				templateUrl: 'partials/server.html'
			};
		}).controller('DashboardCtrl', ['$rootScope', '$scope', '$routeParams', '$http', function($rootScope, $scope, $routeParams, $http){
				$rootScope.servers = [];
				$scope.servers = [];
				$scope.detailed = false;

				$http.get('config.json').then(function(c){
					if (typeof c.data.servers !== 'undefined' && Array.isArray(c.data.servers)){
						$rootScope.servers = c.data.servers;
						$scope.servers = $rootScope.servers;
							
						if (typeof $rootScope.servers !== 'undefined' && typeof $rootScope.servers[$routeParams.index] !== 'undefined'){
							$scope.servers = [$rootScope.servers[$routeParams.index]];
							$scope.detailed = true;
						}
					}
				});
				

				$scope.serverClass = function(){
					if ($scope.servers.length >= 5){
						return 'col-lg-4 col-md-6 col-sm-12';
					}
					if ($scope.servers.length === 1){
						return 'col-lg-11 col-md-11 col-sm-12';
					}

					return 'col-lg-6 col-md-6 col-sm-12';
				};
			}
		]);
})(angular);
