#### No Delay With JSON Async Read Middleware
```js
app.use((req, res, next) => {
  const start = duration();
  const end = res.end;

  res.end = function(chunk, encoding) {
    res.end = end;
    res.end(chunk, encoding);
    duration(start);
  };

  next();
});

app.use((req, res, next) => {
  const start = duration();

  read().then(() => {
    duration(start, 'READ_JSON');
    next();
  });
});
```

```
################################# assemble ###############################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/assemble

[2016-07-27T16:50:59.847Z]  WARN: templating-express/76258 on dfp.local:  (READ_JSON=393)
[2016-07-27T16:50:59.848Z]  WARN: templating-express/76258 on dfp.local:  (ASSEMBLE_CACHED_RENDER=117)
[2016-07-27T16:50:59.848Z]  WARN: templating-express/76258 on dfp.local:  (DURATION=498)

Running 20s test @ http://localhost:3000/assemble
  4 threads and 500 connections
  Thread calibration: mean lat.: 249.586ms, rate sampling interval: 827ms
  Thread calibration: mean lat.: 249.782ms, rate sampling interval: 829ms
  Thread calibration: mean lat.: 249.714ms, rate sampling interval: 827ms
  Thread calibration: mean lat.: 285.661ms, rate sampling interval: 829ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   602.48ms   54.98ms 799.23ms   71.20%
    Req/Sec   242.20     43.53   301.00     68.18%
  18987 requests in 20.30s, 6.97MB read
Requests/sec:    935.50
Transfer/sec:    351.73KB

###################### assemble new instance per request #################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/assemble-new

[2016-07-27T16:52:42.684Z]  WARN: templating-express/76258 on dfp.local:  (READ_JSON=3878)
[2016-07-27T16:52:43.099Z]  WARN: templating-express/76258 on dfp.local:  (ASSEMBLE_NEW_RENDER=389)
[2016-07-27T16:52:43.099Z]  WARN: templating-express/76258 on dfp.local:  (DURATION=4293)

Running 20s test @ http://localhost:3000/assemble-new
  4 threads and 500 connections
  Thread calibration: mean lat.: 4540.057ms, rate sampling interval: 16171ms
  Thread calibration: mean lat.: 4670.967ms, rate sampling interval: 12566ms
  Thread calibration: mean lat.: 4539.683ms, rate sampling interval: 16171ms
  Thread calibration: mean lat.: 4547.624ms, rate sampling interval: 16179ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.61s     2.12s   16.96s    52.70%
    Req/Sec        nan       nan   0.00      0.00%
  2435 requests in 20.65s, 0.92MB read
  Socket errors: connect 0, read 0, write 0, timeout 2485
Requests/sec:    117.93
Transfer/sec:     45.83KB
################################# nunjucks #############################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/nunjucks

[2016-07-27T16:56:29.417Z]  WARN: templating-express/82038 on dfp.local:  (READ_JSON=66)
[2016-07-27T16:56:29.534Z]  WARN: templating-express/82038 on dfp.local:  (NUNJUCKS_RENDER=117)
[2016-07-27T16:56:29.534Z]  WARN: templating-express/82038 on dfp.local:  (DURATION=182)

Running 20s test @ http://localhost:3000/nunjucks
  4 threads and 500 connections
  Thread calibration: mean lat.: 92.924ms, rate sampling interval: 417ms
  Thread calibration: mean lat.: 92.989ms, rate sampling interval: 418ms
  Thread calibration: mean lat.: 92.976ms, rate sampling interval: 417ms
  Thread calibration: mean lat.: 135.600ms, rate sampling interval: 484ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   173.62ms  109.50ms 397.31ms   62.45%
    Req/Sec   252.34     47.69   330.00     74.12%
  19678 requests in 20.05s, 7.23MB read
Requests/sec:    981.62
Transfer/sec:    369.06KB
```

#### Set Timeout 50 Delay
```js
app.use((req, res, next) => {
  const start = duration();
  const end = res.end;

  res.end = function(chunk, encoding) {
    res.end = end;
    res.end(chunk, encoding);
    duration(start);
  };

  //delay for 50ms
  delay().then(() => {
    duration(start, 'ARBITRARY_DELAY');
    next();
  });
});

app.use((req, res, next) => {
  const start = duration();

  read().then(() => {
    duration(start, 'READ_JSON');
    next();
  });
});
```

```
################################# assemble ###############################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/assemble

[2016-07-27T17:08:52.763Z]  WARN: templating-express/83428 on dfp.local:  (ARBITRARY_DELAY=148)
[2016-07-27T17:08:52.740Z]  WARN: templating-express/83428 on dfp.local:  (READ_JSON=307)
[2016-07-27T17:08:52.783Z]  WARN: templating-express/83428 on dfp.local:  (ASSEMBLE_CACHED_RENDER=42)
[2016-07-27T17:08:52.783Z]  WARN: templating-express/83428 on dfp.local:  (DURATION=535)

Running 20s test @ http://localhost:3000/assemble
  4 threads and 500 connections
  Thread calibration: mean lat.: 1110.050ms, rate sampling interval: 3205ms
  Thread calibration: mean lat.: 1110.082ms, rate sampling interval: 3205ms
  Thread calibration: mean lat.: 1231.052ms, rate sampling interval: 3291ms
  Thread calibration: mean lat.: 1242.968ms, rate sampling interval: 3352ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.21s   317.08ms   2.89s    61.81%
    Req/Sec   219.75      4.26   227.00     62.50%
  16759 requests in 20.23s, 6.15MB read
  Socket errors: connect 0, read 83, write 0, timeout 0
Requests/sec:    828.49
Transfer/sec:    311.49KB

###################### assemble new instance per request #################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/assemble-new

[2016-07-27T17:13:52.339Z]  WARN: templating-express/83428 on dfp.local:  (ARBITRARY_DELAY=644)
[2016-07-27T17:04:40.136Z]  WARN: templating-express/83428 on dfp.local:  (READ_JSON=2488)
[2016-07-27T17:04:40.138Z]  WARN: templating-express/83428 on dfp.local:  (TEMPLATE_SETUP=2)
[2016-07-27T17:04:40.390Z]  WARN: templating-express/83428 on dfp.local:  (ASSEMBLE_NEW_RENDER=928)
[2016-07-27T17:04:40.390Z]  WARN: templating-express/83428 on dfp.local:  (DURATION=3634)

Running 20s test @ http://localhost:3000/assemble-new
  4 threads and 500 connections
  Thread calibration: mean lat.: 4382.755ms, rate sampling interval: 16777ms
  Thread calibration: mean lat.: 4383.107ms, rate sampling interval: 16777ms
  Thread calibration: mean lat.: 4388.720ms, rate sampling interval: 16793ms
  Thread calibration: mean lat.: 4590.342ms, rate sampling interval: 12271ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.06s     2.37s   16.61s    59.66%
    Req/Sec        nan       nan   0.00      0.00%
  2671 requests in 20.63s, 1.01MB read
  Socket errors: connect 0, read 0, write 0, timeout 1953
Requests/sec:    129.44
Transfer/sec:     50.31KB

################################# nunjucks #############################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/nunjucks

[2016-07-27T17:00:06.766Z]  WARN: templating-express/82536 on dfp.local:  (ARBITRARY_DELAY=65)
[2016-07-27T17:00:06.792Z]  WARN: templating-express/82536 on dfp.local:  (READ_JSON=35)
[2016-07-27T17:00:06.793Z]  WARN: templating-express/82536 on dfp.local:  (NUNJUCKS_RENDER=36)
[2016-07-27T17:00:06.792Z]  WARN: templating-express/82536 on dfp.local:  (DURATION=98)

Running 20s test @ http://localhost:3000/nunjucks
  4 threads and 500 connections
  Thread calibration: mean lat.: 140.500ms, rate sampling interval: 454ms
  Thread calibration: mean lat.: 140.433ms, rate sampling interval: 454ms
  Thread calibration: mean lat.: 140.553ms, rate sampling interval: 453ms
  Thread calibration: mean lat.: 183.619ms, rate sampling interval: 445ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   148.27ms   58.90ms 267.78ms   64.92%
    Req/Sec   249.25     44.08   281.00     91.36%
  19646 requests in 20.10s, 7.21MB read
Requests/sec:    977.27
Transfer/sec:    367.43KB
```
