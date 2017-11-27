const http = require('http');
const handler = require('./handler')
const server = http.createServer(handler);
server.listen(4000,function () {
  console.log('The server run on port 4000');
})
