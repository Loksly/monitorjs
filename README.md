Another tool to monitor filesystem, CPU usage and memory status on real time for several servers
=========

![MonitorJS capture](https://github.com/Loksly/monitorjs/blob/master/monitorjs.png)


Keywords:
angularjs, nodejs, jquery, bootstrap, realtime, dashboard, filesystem, cpu, ram.

To deploy follow these instructions:

```
git clone "https://github.com/Loksly/monitorjs"
cd monitorjs
npm install
node index.js
```

You may want to change the list of servers you want to track at public/config.json file.

To use [pm2](http://pm2.keymetrics.io/) is also recommended for deployment.

```
npm i -g pm2
pm2 start --name monitorjs index.js
pm2 save
pm2 status
```
