import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

import { AddressInfo } from 'net';

const app = express();

const PORT = 3000;
const HOST_NAME = `localhost`;
const PUBLIC_FOLDER = 'public';

app.use(`/${PUBLIC_FOLDER}`, express.static(path.resolve(PUBLIC_FOLDER)));
app.use(`/`, express.static(path.resolve('dist')));
app.use(`/node_modules`, express.static(path.resolve('node_modules')));

app.all('/*', function(req: express.Request, res: express.Response) {
  res.sendFile('index.html', { root: path.resolve(PUBLIC_FOLDER) })
})

const server = http.createServer(app);
server.listen(PORT, HOST_NAME)
  .on('listening', function() {
    const { port, address } = server.address() as AddressInfo;
    console.log(`Express server started on port ${port} at ${address}.`);
  })