import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../src/App';
import path from 'path';
import fs from 'fs';

// ...other imports and Express config
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./build'));

app.get('/*', (req, res) => {
  const context = {};
  const site = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Something went wrong');
    }

    return res.send(
      data.replace('<div id="root"></div>', <div id="root">${site}</div>)
    );
  });
});

app.listen(PORT, () => {
  console.log("Server is listening on port ${PORT}");
});