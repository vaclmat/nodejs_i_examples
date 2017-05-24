/*eslint-env node */
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var PythonShell = require('/QOpenSys/QIBM/ProdData/OPS/Node6/lib/node_modules/python-shell');
var options = {
  mode: 'json',
  //pythonPath: '/QOpenSys/QIBM/ProdData/OPS/Python3.4',
  pythonOptions: ['-u'],
  scriptPath: '/QOpenSys/QIBM/UserData/OPS/Orion/serverworkspace/cz/cz50247/OrionContent/Node_v6',
  //args: ['value1', 'value2', 'value3']
};
var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');
var xt = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/xstoolkit/lib/itoolkit');

var DBname = "*LOCAL";
var ip = "192.168.100.51";
var port = 8081;


var webserver = http.createServer(function (req, res) {
 path.join(__dirname, 'public');
 var realPath = __dirname + url.parse(req.url).pathname;
 fs.exists(realPath, function(exists){
 if(!exists){
 	//console.log("url = ", url.parse(req.url, true));
     var sql = url.parse(req.url, true).query.sql;
     var cl = url.parse(req.url, true).query.cl;
     var  ex = url.parse(req.url, true).query.ex;
     res.writeHead(200, {'Content-Type': 'text/plain'});
     if(sql && sql.length > 0) {
     	var dbconn = new db.dbconn();
        dbconn.conn(DBname);
        var stmt = new db.dbstmt(dbconn);
        stmt.prepare(sql, function(){
          stmt.execute(function(){
            stmt.fetchAll(function callback(out){
              //console.log(out);
              res.writeHead(200, {'Content-Type': 'text/html'});
              var pyshell = new PythonShell('jsontable.py', options);
              pyshell.send(out);
              //pyshell.defaultOptions = { mode: 'text' };
              pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                //console.log("Message = ", message);
                var jsonObj = JSON.stringify(message);
                var endstr = jsonObj.length - 3;
                var subst = jsonObj.substring(10, endstr);
                //console.log(jsonObj);
                res.end(subst);
                //console.log('end message');
              });

              // end the input stream and allow the process to exit
              pyshell.end(function (err) {
                if (err){
                  throw err;
                }
                //console.log('finished');
            });
            stmt.close();
            dbconn.disconn();
            dbconn.close();  
            }); 
  
          });

        });
     }
     if(cl && cl.length > 0) {
     	console.log("CL statement : " + cl);
     	var conn = new xt.iConn(DBname, "" ,"" );
     	conn.add(xt.iSh("system -i " + cl));
     	function cb(str) { res.end(JSON.parse(JSON.stringify(xt.xmlToJson(str)[0].data)));}  	 
     	conn.run(cb); 
     }

     if (ex && ex.length > 0) {
        	console.log("Exit");
        	ex = "";
        	webserver.close();
        	process.exit(0);
     }   
 } else {
   var file = fs.createReadStream(realPath);
   res.writeHead(200, {'Content-Type':'text/html'});
   file.on('data', res.write.bind(res));
   file.on('close', res.end.bind(res));
   file.on('error', function(err){
	res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end("500 Internal Server Error");
});
}
});
});
webserver.listen(port, ip);
console.log('Server running at http://' + ip + ':' + port);