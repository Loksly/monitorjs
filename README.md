Another tool to monitor filesystem, CPU usage and memory status on real time for several servers 
=========

![MonitorJS capture](https://github.com/Loksly/monitorjs/blob/master/monitorjs.png)


Note it uses CDN for bootstrap, angularjs and jquery.

Keywords:
angularjs, nodejs, jquery, bootstrap, realtime, dashboard, filesystem, cpu, ram.

To deploy follow these instructions:

```
git clone "https://github.com/Loksly/monitorjs"
cd monitorjs
npm install
nohup forever index.js &
```


You may want to change the list of servers you want to track at public/script.js file.

```
$rootScope.servers = [//add here your servers
						{ url: '/', timeout: 60 },
						{ url: 'http://192.168.1.2:9999/', timeout: 60 },
						{ url: 'http://192.168.1.4:9999/', timeout: 60 }
					];
```

