#### No Delay
```js
app.use(async (ctx, next) => {
  const start = duration();
  await read();
  duration(start, 'READ_JSON');

  await next();
  duration(start);
});
```

```
################################# assemble ###############################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/assemble

[2016-07-27T17:20:50.925Z]  WARN: templating-koa/85482 on dfp.local:  (READ_JSON=116)
[2016-07-27T17:20:50.927Z]  WARN: templating-koa/85482 on dfp.local:  (ASSEMBLE_CACHED_RENDER=23)
[2016-07-27T17:20:50.928Z]  WARN: templating-koa/85482 on dfp.local:  (DURATION=120)

Running 20s test @ http://localhost:3000/assemble
  4 threads and 500 connections
  Thread calibration: mean lat.: 106.516ms, rate sampling interval: 389ms
  Thread calibration: mean lat.: 107.065ms, rate sampling interval: 389ms
  Thread calibration: mean lat.: 106.494ms, rate sampling interval: 388ms
  Thread calibration: mean lat.: 140.520ms, rate sampling interval: 348ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   126.25ms   67.71ms 295.42ms   66.09%
    Req/Sec   255.11     87.93   359.00     72.45%
  19678 requests in 20.04s, 6.10MB read
Requests/sec:    981.96
Transfer/sec:    311.66KB

###################### assemble new instance per request #################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/assemble-new

[2016-07-27T17:22:07.517Z]  WARN: templating-koa/85482 on dfp.local:  (READ_JSON=3695)
[2016-07-27T17:22:07.522Z]  WARN: templating-koa/85482 on dfp.local:  (TEMPLATE_SETUP=4)
[2016-07-27T17:22:07.528Z]  WARN: templating-koa/85482 on dfp.local:  (ASSEMBLE_NEW_RENDER=569)
[2016-07-27T17:22:07.531Z]  WARN: templating-koa/85482 on dfp.local:  (DURATION=4100)

Running 20s test @ http://localhost:3000/assemble-new
  4 threads and 500 connections
  Thread calibration: mean lat.: 3002.615ms, rate sampling interval: 14499ms
  Thread calibration: mean lat.: 5382.694ms, rate sampling interval: 15941ms
  Thread calibration: mean lat.: 5444.747ms, rate sampling interval: 15941ms
  Thread calibration: mean lat.: 5474.365ms, rate sampling interval: 15949ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.95s     2.08s   16.07s    65.42%
    Req/Sec        nan       nan   0.00      0.00%
  2364 requests in 20.65s, 780.30KB read
  Socket errors: connect 0, read 454, write 0, timeout 2262
Requests/sec:    114.51
Transfer/sec:     37.80KB

################################# nunjucks #############################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/nunjucks

[2016-07-27T17:18:50.313Z]  WARN: templating-koa/85482 on dfp.local:  (READ_JSON=54)
[2016-07-27T17:18:50.313Z]  WARN: templating-koa/85482 on dfp.local:  (NUNJUCKS_RENDER=46)
[2016-07-27T17:18:50.320Z]  WARN: templating-koa/85482 on dfp.local:  (DURATION=90)

Running 20s test @ http://localhost:3000/nunjucks
  4 threads and 500 connections
  Thread calibration: mean lat.: 93.442ms, rate sampling interval: 409ms
  Thread calibration: mean lat.: 93.976ms, rate sampling interval: 408ms
  Thread calibration: mean lat.: 221.898ms, rate sampling interval: 461ms
  Thread calibration: mean lat.: 214.507ms, rate sampling interval: 460ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   147.56ms   78.91ms 299.26ms   73.58%
    Req/Sec   252.87     55.31   306.00     85.71%
  19453 requests in 20.10s, 6.03MB read
  Socket errors: connect 0, read 163, write 0, timeout 0
Requests/sec:    967.86
Transfer/sec:    307.18KB
```

#### Set Timeout 50 Delay
```js
app.use(async (ctx, next) => {
  const start = duration();

  //delay for 50ms
  await delay();
  duration(start, 'ARBITRARY_DELAY');
  await next();

  duration(start);
});

app.use(async (ctx, next) => {
  const start = duration();
  await read();
  duration(start, 'READ_JSON');

  await next();
});
```

```
################################# assemble ###############################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/assemble

[2016-07-27T17:27:56.297Z]  WARN: templating-koa/86693 on dfp.local:  (ARBITRARY_DELAY=75)
[2016-07-27T17:27:56.510Z]  WARN: templating-koa/86693 on dfp.local:  (READ_JSON=213)
[2016-07-27T17:27:56.516Z]  WARN: templating-koa/86693 on dfp.local:  (ASSEMBLE_CACHED_RENDER=6)
[2016-07-27T17:27:56.516Z]  WARN: templating-koa/86693 on dfp.local:  (DURATION=294)

Running 20s test @ http://localhost:3000/assemble
  4 threads and 500 connections
  Thread calibration: mean lat.: 225.521ms, rate sampling interval: 707ms
  Thread calibration: mean lat.: 309.669ms, rate sampling interval: 747ms
  Thread calibration: mean lat.: 225.746ms, rate sampling interval: 707ms
  Thread calibration: mean lat.: 309.445ms, rate sampling interval: 743ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   265.77ms   88.92ms 432.13ms   72.39%
    Req/Sec   247.54     62.09   342.00     50.00%
  19424 requests in 20.16s, 6.02MB read
  Socket errors: connect 0, read 3, write 0, timeout 0
Requests/sec:    963.57
Transfer/sec:    305.82KB
###################### assemble new instance per request #################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/assemble-new

[2016-07-27T17:30:08.978Z]  WARN: templating-koa/86693 on dfp.local:  (ARBITRARY_DELAY=1203)
[2016-07-27T17:30:11.540Z]  WARN: templating-koa/86693 on dfp.local:  (READ_JSON=2562)
[2016-07-27T17:30:11.543Z]  WARN: templating-koa/86693 on dfp.local:  (TEMPLATE_SETUP=3)
[2016-07-27T17:30:11.897Z]  WARN: templating-koa/86693 on dfp.local:  (ASSEMBLE_NEW_RENDER=354)
[2016-07-27T17:30:11.902Z]  WARN: templating-koa/86693 on dfp.local:  (DURATION=4127)

################################# nunjucks #############################
wrk -R 1000 -d 20s -t 4 -c 500 http://localhost:3000/nunjucks

[2016-07-27T17:24:39.735Z]  WARN: templating-koa/86693 on dfp.local:  (ARBITRARY_DELAY=69)
[2016-07-27T17:24:39.811Z]  WARN: templating-koa/86693 on dfp.local:  (READ_JSON=76)
[2016-07-27T17:24:39.941Z]  WARN: templating-koa/86693 on dfp.local:  (NUNJUCKS_RENDER=130)
[2016-07-27T17:24:39.941Z]  WARN: templating-koa/86693 on dfp.local:  (DURATION=275)

Running 20s test @ http://localhost:3000/nunjucks
  4 threads and 500 connections
  Thread calibration: mean lat.: 575.745ms, rate sampling interval: 3256ms
  Thread calibration: mean lat.: 173.413ms, rate sampling interval: 642ms
  Thread calibration: mean lat.: 588.705ms, rate sampling interval: 3745ms
  Thread calibration: mean lat.: 557.319ms, rate sampling interval: 3153ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   220.69ms   72.51ms 340.99ms   77.43%
    Req/Sec   233.00     53.93   349.00     76.19%
  17498 requests in 20.25s, 5.42MB read
  Socket errors: connect 0, read 280, write 0, timeout 337
Requests/sec:    864.22
Transfer/sec:    274.29KB
```
