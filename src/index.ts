/*
 * Copyright (c) 2020 genshin.dev
* Licensed under the Open Software License version 3.0
*/
//import https from 'https';
//import http from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import * as Sentry from '@sentry/node';
import chalk from 'chalk';

import router from './routes';

const sentryDsn = process.env.SENTRY_DSN;

// Check if Sentry
if (sentryDsn && sentryDsn.length > 0) {
  console.log(chalk.blue('[Sentry]'), 'Enabled Sentry error logging');
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.5,
  });
}

(async () => {
  const app = new Koa();
  const port = process.env.PORT || 8080;
 // const fs = require('fs');



  //const options = {
   // key: fs.readFileSync('selfsigned.key'),
   // cert: fs.readFileSync('selfsigned.crt')
  //};

  //const https = require('https');
  app.use(koaBody());
  app.use(helmet());
  app.use(cors());

  app.use(router.routes());

  app.listen(port, () => {
    console.log(
      chalk.blue('[API]'),
      'Running on',
      chalk.yellow(`0.0.0.0:${port}`),
    );
  });

  //https.createServer(options, app.callback()).listen(5000);
  //http.createServer(app.callback()).listen(80)
})();
