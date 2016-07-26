```
ulimit -n 524288 #on Mac
ulimit -n 1000000 #in Node Process
```

#### No Delay
```js
app.use((ctx, next) => {
  next().then(() => {
    ctx.status = 200;
    ctx.body = 'Hello Koa ES6';
  });
});
```

```
#httperf 10s run

httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 100 --rate 10 --timeout 5 \
--hog --verbose

Total: connections 100 requests 100 replies 100 test-duration 9.901 s

Connection rate: 10.1 conn/s (99.0 ms/conn, <=1 concurrent connections)
Connection time [ms]: min 0.5 avg 0.9 max 13.0 median 0.5 stddev 1.3
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 10.1 req/s (99.0 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 10.0 avg 10.0 max 10.0 stddev 0.0 (1 samples)
Reply time [ms]: response 0.8 transfer 0.0
Reply size [B]: header 141.0 content 13.0 footer 0.0 (total 154.0)
Reply status: 1xx=0 2xx=100 3xx=0 4xx=0 5xx=0

CPU time [s]: user 3.88 system 6.00 (user 39.2% system 60.6% total 99.8%)
Net I/O: 2.2 KB/s (0.0*10^6 bps)

Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0


#1 session, 10 req burst per session
httperf --server local.hfa.io --port 3000 --uri / \
--wsess=1,10,0 --timeout 5 \
--hog --verbose

Total: connections 1 requests 10 replies 10 test-duration 0.003 s

Connection rate: 380.8 conn/s (2.6 ms/conn, <=1 concurrent connections)
Connection time [ms]: min 2.7 avg 2.7 max 2.7 median 2.5 stddev 0.0
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 10.000

Request rate: 3808.2 req/s (0.3 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 0.0 avg 0.0 max 0.0 stddev 0.0 (0 samples)
Reply time [ms]: response 0.3 transfer 0.0
Reply size [B]: header 141.0 content 13.0 footer 0.0 (total 154.0)
Reply status: 1xx=0 2xx=10 3xx=0 4xx=0 5xx=0

CPU time [s]: user 0.00 system 0.00 (user 29.2% system 70.8% total 100.1%)
Net I/O: 814.4 KB/s (6.7*10^6 bps)

Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0

Session rate [sess/s]: min 0.00 avg 380.82 max 0.00 stddev 0.00 (1/1)
Session: avg 1.00 connections/session
Session lifetime [s]: 0.0
Session failtime [s]: 0.0
Session length histogram: 0 0 0 0 0 0 0 0 0 0 1
```

```
#wrk2 10s run
wrk -R 10 -d 10s -t 1 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  1 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.15ms  792.11us   6.79ms   95.00%
    Req/Sec        nan       nan   0.00      0.00%
  101 requests in 10.01s, 15.19KB read
  Socket errors: connect 0, read 0, write 0, timeout 400
Requests/sec:     10.09
Transfer/sec:      1.52KB

#wrk2 not duration specified
wrk -R 10 -t 1 -c 1 http://localhost:3000

Running 10s test @ http://localhost:3000
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.11ms    0.95ms   6.06ms   81.00%
    Req/Sec        nan       nan   0.00      0.00%
  101 requests in 10.00s, 15.19KB read
Requests/sec:     10.09
Transfer/sec:      1.52KB
```

#### Set Timeout 50 Delay
```js
app.use((ctx, next) => {
  ctx.start = new Date();

  return delay().then(() => {
    return next();
  });
});

app.use((ctx, next) => {
  ctx.status = 200;
  ctx.body = 'Hello Koa ES6';
  debug({
    warn: {
      duration: new Date() - ctx.start
    }
  });
});
```

```
#httperf
httperf --server local.hfa.io --port 3000 --uri / \

--num-conns 100 --rate 10 --timeout 5 \
--hog --verbose
httperf --verbose --hog --timeout=5 --client=0/1 --server=local.hfa.io --port=3000 --uri=/ --rate=10 --send-buffer=4096 --recv-buffer=16384 --ssl-protocol=auto --num-conns=100 --num-calls=1
httperf: maximum number of open descriptors = 9223372036854775807
reply-rate = 10.0
Maximum connect burst length: 1

Total: connections 100 requests 100 replies 100 test-duration 9.954 s

Connection rate: 10.0 conn/s (99.5 ms/conn, <=1 concurrent connections)
Connection time [ms]: min 50.1 avg 52.8 max 67.2 median 53.5 stddev 1.9
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 10.0 req/s (99.5 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 10.0 avg 10.0 max 10.0 stddev 0.0 (1 samples)
Reply time [ms]: response 52.7 transfer 0.0
Reply size [B]: header 141.0 content 13.0 footer 0.0 (total 154.0)
Reply status: 1xx=0 2xx=100 3xx=0 4xx=0 5xx=0

CPU time [s]: user 3.25 system 6.31 (user 32.7% system 63.4% total 96.1%)
Net I/O: 2.1 KB/s (0.0*10^6 bps)

Errors: total 0 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 0 addrunavail 0 ftab-full 0 other 0
```

```
#wrk2
wrk -R 10 -d 10s -t 1 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  1 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    51.80ms    1.97ms  62.78ms   92.00%
    Req/Sec        nan       nan   0.00      0.00%
  101 requests in 10.05s, 15.19KB read
  Socket errors: connect 0, read 0, write 0, timeout 400
Requests/sec:     10.05
Transfer/sec:      1.51KB

wrk -R 5000 -d 10s -t 1 -c 500 http://localhost:3000

Running 10s test @ http://localhost:3000
  1 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   673.06ms  384.45ms   1.37s    53.56%
    Req/Sec        nan       nan   0.00      0.00%
  37295 requests in 10.03s, 5.48MB read
Requests/sec:   3717.77
Transfer/sec:    559.12KB

wrk -R 5000 -d 10s -t 1 -c 1000 http://localhost:3000

Running 10s test @ http://localhost:3000
  1 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   251.34ms  207.67ms 826.37ms   82.56%
    Req/Sec        nan       nan   0.00      0.00%
  34040 requests in 10.06s, 5.00MB read
Requests/sec:   3382.76
Transfer/sec:    508.73KB

wrk -R 50000 -d 10s -t 4 -c 500 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.98s     2.34s    8.53s    58.05%
    Req/Sec        nan       nan   0.00      0.00%
  66703 requests in 10.01s, 9.80MB read
Requests/sec:   6663.65
Transfer/sec:      0.98MB
```
