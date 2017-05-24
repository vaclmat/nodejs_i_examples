/*
 First edit /QOpenSys/QIBM/ProdData/OPS/Node6/os400/xstoolkit/lib/idataq.js and modify receiveFromDataQueue to have a wait parameter and apply it to the fifth program call parameter. 

iDataQueue.prototype.receiveFromDataQueue = function(name, lib, length, wait, cb){ 
        var pgm = new xt.iPgm("QRCVDTAQ", {"lib":"QSYS"});                      
        pgm.addParam(name, "10A");                                              
        pgm.addParam(lib == ""?"*CURLIB":lib, "10A");                           
        pgm.addParam(length, "5p0");                                            
        pgm.addParam("", length + 1 + "A");                                     
        pgm.addParam(wait, "5p0"); 

 */
/*eslint-env node */
var xt = require("/QOpenSys/QIBM/ProdData/OPS/Node6/os400/xstoolkit/lib/itoolkit");
var dq = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/xstoolkit/lib/idataq');
const EventEmitter = require('events');
const util = require('util');

var conn = new xt.iConn("*LOCAL");
var dtq = new dq.iDataQueue(conn);


function MyEmitter() {
  EventEmitter.call(this);
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', (x) => {
  console.log('an event occurred! Received:' + x);
});

var recDtaQ = function(){
  dtq.receiveFromDataQueue("QREQFI2", "QGPL", 20, -1, function(data){
      if(data !== 'end'){
        recDtaQ();
      }
      myEmitter.emit('event', data);
  }); 
};

recDtaQ(); 