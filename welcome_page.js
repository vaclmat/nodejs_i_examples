/*eslint-env node */
var http = require('http');
var ip = "192.168.100.51";
var port = 8081;
var webserver = http.createServer(function
(req,res) {
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('Hello World\n');
});
webserver.listen(port, ip);
console.log('Server running at http://' + ip + ':' + port);