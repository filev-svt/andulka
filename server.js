// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';

import routes from './routes';

export const app = express();

app.use(bodyParser.json());


app.use(routes);

app.use((req, res, next) => {
  res.status(404);
  res.json({ error: '404: Not found' });
});
