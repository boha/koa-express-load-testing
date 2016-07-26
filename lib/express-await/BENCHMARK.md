#### No Delay
```js
app.use(async (req, res, next) => {
  res.status(200);
  res.send('Hello Express ES7');
  next();
});
```

```
################################# httperf ulimit 10240 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 995.2
reply-rate = 994.6
Maximum connect burst length: 3

Total: connections 10000 requests 10000 replies 10000 test-duration 10.057 s

Connection rate: 994.3 conn/s (1.0 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 0.2 avg 0.5 max 16.7 median 0.5 stddev 0.5
Connection time [ms]: connect 0.2
Connection length [replies/conn]: 1.000

Request rate: 994.3 req/s (1.0 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 994.6 avg 994.9 max 995.2 stddev 0.4 (2 samples)
Reply time [ms]: response 0.3 transfer 0.0
Reply size [B]: header 200.0 content 17.0 footer 0.0 (total 217.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 3.15 system 6.84 (user 31.3% system 68.0% total 99.3%)
Net I/O: 273.8 KB/s (2.2*10^6 bps)

Errors: total 23 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 23 addrunavail 0 ftab-full 0 other 0

################################# httperf ulimit 65536 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 995.2
reply-rate = 995.6
Maximum connect burst length: 4

Total: connections 10000 requests 10000 replies 10000 test-duration 10.045 s

Connection rate: 995.5 conn/s (1.0 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 0.2 avg 0.4 max 15.7 median 0.5 stddev 0.5
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 995.5 req/s (1.0 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 995.2 avg 995.4 max 995.6 stddev 0.3 (2 samples)
Reply time [ms]: response 0.3 transfer 0.0
Reply size [B]: header 200.0 content 17.0 footer 0.0 (total 217.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 3.18 system 6.80 (user 31.7% system 67.7% total 99.4%)
Net I/O: 274.2 KB/s (2.2*10^6 bps)

Errors: total 19 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 19 addrunavail 0 ftab-full 0 other 0
```

```
################################# wrk2 10s run ulimit 10240 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.97ms    2.32ms  17.76ms   79.97%
    Req/Sec        nan       nan   0.00      0.00%
  9739 requests in 10.00s, 2.02MB read
Requests/sec:    973.60
Transfer/sec:    206.32KB

################################# wrk2 10s run ulimit 65536 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.78ms    2.15ms  20.18ms   83.47%
    Req/Sec        nan       nan   0.00      0.00%
  9739 requests in 10.00s, 2.02MB read
Requests/sec:    973.49
Transfer/sec:    206.30KB
```

#### Set Timeout 50 Delay
```js
app.use(async (req, res, next) => {
  const start = new Date();

  await delay();

  debug({
    warn: {
      duration: new Date() - start
    }
  });
  res.status(200);
  res.send('Hello Express ES7');
  next();
});
```

```
################################# httperf ulimit 10240 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 71.2
Maximum connect burst length: 3

Total: connections 10000 requests 10000 replies 10000 test-duration 135.511 s

Connection rate: 73.8 conn/s (13.6 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 49.5 avg 52.5 max 71.2 median 52.5 stddev 1.9
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 73.8 req/s (13.6 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 71.2 avg 73.8 max 75.2 stddev 0.9 (27 samples)
Reply time [ms]: response 52.4 transfer 0.0
Reply size [B]: header 200.0 content 17.0 footer 0.0 (total 217.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 40.80 system 93.98 (user 30.1% system 69.4% total 99.5%)
Net I/O: 20.3 KB/s (0.2*10^6 bps)

Errors: total 2570 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 2570 addrunavail 0 ftab-full 0 other 0

################################# httperf ulimit 65536 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 72.0
Maximum connect burst length: 4

Total: connections 10000 requests 10000 replies 10000 test-duration 136.473 s

Connection rate: 73.3 conn/s (13.6 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 49.6 avg 52.9 max 68.4 median 52.5 stddev 2.0
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 73.3 req/s (13.6 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 72.0 avg 73.3 max 75.2 stddev 0.8 (27 samples)
Reply time [ms]: response 52.8 transfer 0.0
Reply size [B]: header 200.0 content 17.0 footer 0.0 (total 217.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 40.87 system 94.80 (user 29.9% system 69.5% total 99.4%)
Net I/O: 20.2 KB/s (0.2*10^6 bps)

Errors: total 2539 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 2539 addrunavail 0 ftab-full 0 other 0
```

```
################################# wrk2 10s run ulimit 10240 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    53.22ms    2.38ms  68.99ms   76.27%
    Req/Sec        nan       nan   0.00      0.00%
  9709 requests in 10.06s, 2.01MB read
Requests/sec:    965.09
Transfer/sec:    204.52KB

################################# wrk2 10s run ulimit 65536 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    53.37ms    2.37ms  70.02ms   77.05%
    Req/Sec        nan       nan   0.00      0.00%
  9709 requests in 10.06s, 2.01MB read
Requests/sec:    965.51
Transfer/sec:    204.60KB
```
