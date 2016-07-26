#### No Delay
```js
app.use((req, res, next) => {
  res.status(200);
  res.send('Hello Express ES6');
  next();
});
```

```
################################# httperf ulimit 10240 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 996.0
reply-rate = 994.8
Maximum connect burst length: 3

Total: connections 10000 requests 10000 replies 10000 test-duration 10.045 s

Connection rate: 995.5 conn/s (1.0 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 0.2 avg 0.5 max 15.1 median 0.5 stddev 0.5
Connection time [ms]: connect 0.2
Connection length [replies/conn]: 1.000

Request rate: 995.5 req/s (1.0 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 994.8 avg 995.4 max 996.0 stddev 0.8 (2 samples)
Reply time [ms]: response 0.3 transfer 0.0
Reply size [B]: header 200.0 content 17.0 footer 0.0 (total 217.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 3.20 system 6.79 (user 31.8% system 67.6% total 99.4%)
Net I/O: 274.2 KB/s (2.2*10^6 bps)

Errors: total 18 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 18 addrunavail 0 ftab-full 0 other 0

################################# httperf ulimit 65536 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 992.8
reply-rate = 984.2
Maximum connect burst length: 3

Total: connections 10000 requests 10000 replies 10000 test-duration 10.114 s

Connection rate: 988.7 conn/s (1.0 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 0.2 avg 0.5 max 16.5 median 0.5 stddev 0.8
Connection time [ms]: connect 0.2
Connection length [replies/conn]: 1.000

Request rate: 988.7 req/s (1.0 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 984.2 avg 988.5 max 992.8 stddev 6.1 (2 samples)
Reply time [ms]: response 0.3 transfer 0.0
Reply size [B]: header 200.0 content 17.0 footer 0.0 (total 217.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 3.19 system 6.86 (user 31.5% system 67.9% total 99.4%)
Net I/O: 272.3 KB/s (2.2*10^6 bps)

Errors: total 23 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 23 addrunavail 0 ftab-full 0 other 0
```

```
################################# wrk2 10s run ulimit 10240 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    11.18ms   35.19ms 261.12ms   93.01%
    Req/Sec        nan       nan   0.00      0.00%
  9984 requests in 10.00s, 2.07MB read
Requests/sec:    998.09
Transfer/sec:    211.51KB

################################# wrk2 10s run ulimit 65536 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.84ms    0.94ms  21.92ms   84.90%
    Req/Sec        nan       nan   0.00      0.00%
  9984 requests in 10.00s, 2.07MB read
Requests/sec:    998.07
Transfer/sec:    211.51KB
```

#### Set Timeout 50 Delay
```js
app.use((req, res, next) => {
  const start = new Date();

  delay().then(() => {
    debug({
      warn: {
        duration: new Date() - start
      }
    });
    res.status(200);
    res.send('Hello Express ES6');
    next();
  });
});
```

```
################################# httperf ulimit 10240 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 74.4
Maximum connect burst length: 4

Total: connections 10000 requests 10000 replies 10000 test-duration 135.034 s

Connection rate: 74.1 conn/s (13.5 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 49.5 avg 52.3 max 64.6 median 51.5 stddev 1.8
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 74.1 req/s (13.5 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 72.8 avg 74.0 max 75.2 stddev 0.7 (27 samples)
Reply time [ms]: response 52.2 transfer 0.0
Reply size [B]: header 200.0 content 17.0 footer 0.0 (total 217.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 40.56 system 93.71 (user 30.0% system 69.4% total 99.4%)
Net I/O: 20.4 KB/s (0.2*10^6 bps)

Errors: total 2558 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 2558 addrunavail 0 ftab-full 0 other 0

################################# httperf ulimit 65536 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 71.2
Maximum connect burst length: 4

Total: connections 10000 requests 10000 replies 10000 test-duration 136.192 s

Connection rate: 73.4 conn/s (13.6 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 49.5 avg 52.7 max 67.4 median 52.5 stddev 1.9
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 73.4 req/s (13.6 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 71.2 avg 73.4 max 74.4 stddev 0.8 (27 samples)
Reply time [ms]: response 52.6 transfer 0.0
Reply size [B]: header 200.0 content 17.0 footer 0.0 (total 217.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 41.19 system 94.27 (user 30.2% system 69.2% total 99.5%)
Net I/O: 20.2 KB/s (0.2*10^6 bps)

Errors: total 2535 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 2535 addrunavail 0 ftab-full 0 other 0
```

```
################################# wrk2 10s run ulimit 10240 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    52.18ms    1.28ms  71.87ms   82.57%
    Req/Sec        nan       nan   0.00      0.00%
  9944 requests in 10.00s, 2.06MB read
Requests/sec:    993.92
Transfer/sec:    210.63KB

################################# wrk2 10s run ulimit 65536 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    52.39ms    1.20ms  63.84ms   78.15%
    Req/Sec        nan       nan   0.00      0.00%
  9942 requests in 10.00s, 2.06MB read
Requests/sec:    993.88
Transfer/sec:    210.62KB
```
