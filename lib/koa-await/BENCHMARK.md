#### No Delay
```js
app.use(async (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'Hello Koa ES7';
  await next();
});
```

```
################################# httperf ulimit 10240 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 993.6
reply-rate = 990.6
Maximum connect burst length: 5

Total: connections 10000 requests 10000 replies 10000 test-duration 10.079 s

Connection rate: 992.2 conn/s (1.0 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 0.2 avg 0.4 max 26.3 median 0.5 stddev 0.6
Connection time [ms]: connect 0.2
Connection length [replies/conn]: 1.000

Request rate: 992.2 req/s (1.0 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 990.6 avg 992.1 max 993.6 stddev 2.1 (2 samples)
Reply time [ms]: response 0.3 transfer 0.0
Reply size [B]: header 141.0 content 13.0 footer 0.0 (total 154.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 3.18 system 6.80 (user 31.6% system 67.5% total 99.1%)
Net I/O: 212.2 KB/s (1.7*10^6 bps)

Errors: total 23 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 23 addrunavail 0 ftab-full 0 other 0

################################# httperf ulimit 65536 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 991.6
reply-rate = 995.2
Maximum connect burst length: 3

Total: connections 10000 requests 10000 replies 10000 test-duration 10.069 s

Connection rate: 993.1 conn/s (1.0 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 0.2 avg 0.4 max 15.5 median 0.5 stddev 0.5
Connection time [ms]: connect 0.2
Connection length [replies/conn]: 1.000

Request rate: 993.1 req/s (1.0 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 991.6 avg 993.4 max 995.2 stddev 2.5 (2 samples)
Reply time [ms]: response 0.3 transfer 0.0
Reply size [B]: header 141.0 content 13.0 footer 0.0 (total 154.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 3.16 system 6.84 (user 31.4% system 67.9% total 99.3%)
Net I/O: 212.4 KB/s (1.7*10^6 bps)

Errors: total 25 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 25 addrunavail 0 ftab-full 0 other 0

```

```
################################# wrk2 10s run ulimit 10240 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000
Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.39ms    9.75ms 361.22ms   99.41%
    Req/Sec        nan       nan   0.00      0.00%
  9740 requests in 10.01s, 1.43MB read
Requests/sec:    973.31
Transfer/sec:    146.38KB

################################# wrk2 10s run ulimit 65536 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000
Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.90ms    1.05ms  24.03ms   92.20%
    Req/Sec        nan       nan   0.00      0.00%
  9984 requests in 10.00s, 1.47MB read
Requests/sec:    998.22
Transfer/sec:    150.12KB
```

#### Set Timeout 50 Delay
```js
app.use(async (ctx, next) => {
  const start = new Date();

  await delay();

  ctx.status = 200;
  ctx.body = 'Hello Koa ES7';

  debug({
    warn: {
      duration: new Date() - start
    }
  });

  await next();
});
```

```
################################# httperf ulimit 10240 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 72.8
Maximum connect burst length: 4

Total: connections 10000 requests 10000 replies 10000 test-duration 136.165 s

Connection rate: 73.4 conn/s (13.6 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 49.5 avg 52.5 max 69.8 median 52.5 stddev 2.0
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 73.4 req/s (13.6 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 72.8 avg 73.4 max 74.4 stddev 0.6 (27 samples)
Reply time [ms]: response 52.4 transfer 0.0
Reply size [B]: header 141.0 content 13.0 footer 0.0 (total 154.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 40.78 system 94.44 (user 29.9% system 69.4% total 99.3%)
Net I/O: 15.7 KB/s (0.1*10^6 bps)

Errors: total 2534 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 2534 addrunavail 0 ftab-full 0 other 0

################################# httperf ulimit 65536 ###############################
httperf --server local.hfa.io --port 3000 --uri / \
--num-conns 10000 --rate 1000 --timeout 5 \
--hog --verbose

httperf: maximum number of open descriptors = 262144
reply-rate = 73.6
Maximum connect burst length: 3

Total: connections 10000 requests 10000 replies 10000 test-duration 135.739 s

Connection rate: 73.7 conn/s (13.6 ms/conn, <=5 concurrent connections)
Connection time [ms]: min 49.4 avg 52.4 max 73.5 median 52.5 stddev 1.9
Connection time [ms]: connect 0.1
Connection length [replies/conn]: 1.000

Request rate: 73.7 req/s (13.6 ms/req)
Request size [B]: 65.0

Reply rate [replies/s]: min 72.0 avg 73.7 max 75.2 stddev 0.7 (27 samples)
Reply time [ms]: response 52.3 transfer 0.0
Reply size [B]: header 141.0 content 13.0 footer 0.0 (total 154.0)
Reply status: 1xx=0 2xx=10000 3xx=0 4xx=0 5xx=0

CPU time [s]: user 40.88 system 94.16 (user 30.1% system 69.4% total 99.5%)
Net I/O: 15.8 KB/s (0.1*10^6 bps)

Errors: total 2544 client-timo 0 socket-timo 0 connrefused 0 connreset 0
Errors: fd-unavail 2544 addrunavail 0 ftab-full 0 other 0
```

```
################################# wrk2 10s run ulimit 10240 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    52.41ms    1.16ms  65.25ms   78.28%
    Req/Sec        nan       nan   0.00      0.00%
  9944 requests in 10.00s, 1.46MB read
Requests/sec:    994.16
Transfer/sec:    149.51KB

################################# wrk2 10s run ulimit 65536 ###############################
wrk -R 1000 -d 10s -t 4 -c 100 http://localhost:3000

Running 10s test @ http://localhost:3000
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    52.21ms    1.27ms  71.17ms   84.41%
    Req/Sec        nan       nan   0.00      0.00%
  9944 requests in 10.00s, 1.46MB read
Requests/sec:    994.11
Transfer/sec:    149.50KB
```
