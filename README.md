##### Benchmarks

* [SOS](/lib/sos-server/BENCHMARK.md)
* [KOA-ES5](/lib/koa-es5/BENCHMARK.md)
* [KOA-ES6](/lib/koa/BENCHMARK.md)
* [KOA-ES7](/lib/koa-await/BENCHMARK.md)
* [EXPRESS-ES5](/lib/express-es5/BENCHMARK.md)
* [EXPRESS-ES6](/lib/express/BENCHMARK.md)
* [EXPRESS-ES7](/lib/express-await/BENCHMARK.md)

Created using:
- [httperf](https://github.com/httperf/httperf) custom compilation
- [wrk2](https://github.com/giltene/wrk2)

###### Findings
- crank `ulimit` on the box
  - https://www.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/
  - but you also must set it in `upstart` `¯\_(ツ)_/¯`

```
# /etc/security/limits.d/custom.conf
root soft nofile 1000000
root hard nofile 1000000
* soft nofile 1000000
* hard nofile 1000000

# /etc/sysctl.conf
fs.file-max = 1000000
fs.nr_open = 1000000
net.ipv4.netfilter.ip_conntrack_max = 1048576
net.nf_conntrack_max = 1048576

# /provisioning/templates/upstart.conf.j2 => /etc/init/sos.conf
limit nofile 1000000 1000000
```
