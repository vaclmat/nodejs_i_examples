/*eslint-env node */
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');
var Excel = require("/QOpenSys/QIBM/ProdData/OPS/Node6/lib/node_modules/exceljs");
var nodemailer = require("/QOpenSys/QIBM/ProdData/OPS/Node6/lib/node_modules/nodemailer");
var transporter = nodemailer.createTransport("smtp://linux-1.stg.lab");

var DBname = "*LOCAL";
var ip = "192.168.100.51";
var port = 8081;

var last_sql_opt = "";


var webserver = http.createServer(function (req, res) {
 path.join(__dirname, 'public');
 var realPath = __dirname + url.parse(req.url).pathname;
 fs.exists(realPath, function(exists){
 if(!exists){
 	//console.log("url = ", url.parse(req.url, true));
    var sql_options = url.parse(req.url, true).query.sql_options;
    var mail_adr_option = url.parse(req.url, true).query.mail_adr_options;
    //var sal = url.parse(req.url, true).query.sal;
    var sql = url.parse(req.url, true).query.sql;    
    //console.log("sql = ", sql, "sql_options = ", sql_options);
    var ex = url.parse(req.url, true).query.ex;
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(sql_options === "emp" && sql.length > 0) {
       console.log("sql_options : " + sql_options);
       last_sql_opt = sql_options;
       var workbook_emp = new Excel.Workbook();
       var worksheet_emp = workbook_emp.addWorksheet("Employees");

       // Add column definitions to the worksheet.
       // The column keys are named after the DB2 column names.
       worksheet_emp.columns = [
          { header: "First Name ", key: "FIRSTNME", width: 16 },
          { header: "Last Name ", key: "LASTNAME", width: 16 },
          { header: "Job ", key: "JOB", width: 10 },
          { header: "Employee Number", key: "EMPNO", width: 16, style:{ alignment: { horizontal: 'center' } } },
          { header: "Sex", key: "SEX", width: 4, style:{ alignment: { horizontal: 'center' } }}
        ];
        worksheet_emp.getRow(1).font = { name: "Calibri", size: 11, bold: true };

 	    var dbconn = new db.dbconn();
        dbconn.conn(DBname);
        var stm = new db.dbstmt(dbconn);
        var sql_e = "select firstnme, lastname, job, empno, sex from sample.employee";
        stm.exec(sql_e, function(rs) {
           rs.forEach(function(row) {
           // Cast numeric fields to numbers (so Excel sees them as
           // numbers rather than strings)
              worksheet_emp.addRow(row);
           });
         // Write spreadsheet to IFS
         workbook_emp.xlsx.writeFile("employees.xlsx");
       });
       //stm.close();
       //dbconn.disconn();
       //dbconn.close();
       
       res.end("<h3>Worksheet employees.xlsx was created.</h3><br><h5>Press <b>Go back</> to return.<h5>");
       
     }
     if(sql_options === "dep" && sql.length > 0) {
     	console.log("sql_options : " + sql_options);
     	last_sql_opt = sql_options;
        var workbook_dep = new Excel.Workbook();
        var worksheet_dep = workbook_dep.addWorksheet("Departments");

        // Add column definitions to the worksheet.
        // The column keys are named after the DB2 column names.
        worksheet_dep.columns = [
           { header: "Department Name ", key: "DEPTNAME", width: 16 },
           { header: "Location ", key: "LOCATION", width: 16 },
           { header: "Department Number # ", key: "DEPTNUMB", width: 20, style:{numFmt: "0", alignment: { horizontal: 'center' } } },
           { header: "Division ", key: "DIVISION", width: 16 },
           { header: "Manager # ", key: "MANAGER", width: 10, style:{numFmt: "0", alignment: { horizontal: 'center' } }}
         ];
         worksheet_dep.getRow(1).font = { name: "Calibri", size: 11, bold: true };

 	     var dbconn_d = new db.dbconn();
         dbconn_d.conn(DBname);
         var stm_d = new db.dbstmt(dbconn_d);
         var sql_d = "select * from sample.org";
         stm_d.exec(sql_d, function(rs) {
            rs.forEach(function(row) {
            // Cast numeric fields to numbers (so Excel sees them as
            // numbers rather than strings)
            row.DEPTNUMB = Number(row.DEPTNUMB);
            row.MANAGER = Number(row.MANAGER);
            worksheet_dep.addRow(row);
         });
         // Write spreadsheet to IFS
         workbook_dep.xlsx.writeFile("departments.xlsx");
       });
       //stm_d.close();
       //dbconn_d.disconn();
       //dbconn_d.close();
       res.end("<h3>Worksheet departments.xlsx was created.</h3><br><h5>Press <b>Go back</> to return.<h5>");
     }
     if(sql_options === "sal" && sql.length > 0) {
     	console.log("CL statement : " + sql_options);
     	last_sql_opt = sql_options;
     	var workbook_sal = new Excel.Workbook();
        var worksheet_sal = workbook_sal.addWorksheet("Sales");

        // Add column definitions to the worksheet.
        // The column keys are named after the DB2 column names.
        worksheet_sal.columns = [
           { header: "Sales date ", key: "SALES_DATE", width: 16 },
           { header: "Sales person ", key: "SALES_PERSON", width: 16 },
           { header: "Region ", key: "REGION", width: 16 },
           { header: "Sales # ", key: "SALES", width: 8, style:{numFmt: "0", alignment: { horizontal: 'center' } }}
         ];
         worksheet_sal.getRow(1).font = { name: "Calibri", size: 11, bold: true };

 	     var dbconn_s = new db.dbconn();
         dbconn_s.conn(DBname);
         var stm_s = new db.dbstmt(dbconn_s);
         var sql_s = "select * from sample.sales";
         stm_s.exec(sql_s, function(rs) {
            rs.forEach(function(row) {
            // Cast numeric fields to numbers (so Excel sees them as
            // numbers rather than strings)
            row.SALES = Number(row.SALES);
            worksheet_sal.addRow(row);
         });
         // Write spreadsheet to IFS
         workbook_sal.xlsx.writeFile("sales.xlsx");
       });
       res.end("<h3>Worksheet sales.xlsx was created.</h3><br><h5>Press <b>Go back</> to return.<h5>");
 
     }
     if(mail_adr_option === "vaclmat") {
     	console.log("CL statement : " + mail_adr_option, "Last sql option = ", last_sql_opt);
     	var sheet = "";
     	switch(last_sql_opt) {
           case "emp":
             sheet = "employees.xlsx";
             break;
           case "dep":
             sheet = "departments.xlsx";
             break;
           case "sal":
             sheet = "sales.xlsx";
             break;
           default:
             sheet = "";
} 
     	
     	var message = {
           from: "Node.js Email Example <root@stg.lab>",
           to: "Vaclav Matousek <cz50247@stg.lab>",
           subject: "Node.js Email Example",
           html: "<b>Sent from Node.js on IBM i</b>",
           attachments: [{
              path: sheet
           }]
        };

        transporter.sendMail(message, function(error, info) {
           if (error) {
              console.log(error);
              res.end("Mail finished with error");
           } else {
           	  console.log("Mail info", info);
           	  res.end("<h3>Mail finished sucessfully</h3><br><h5>Press <b>Go back</> to return.<h5>");
           }
           
        });
 
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