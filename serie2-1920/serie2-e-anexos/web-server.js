var fs = require('fs'); 
var https = require('https'); 
let autenthication=true;
var options1 = { 
  key: fs.readFileSync('./privatekey.pem'), 
  cert: fs.readFileSync('./certificate.pem'), 
  ca: fs.readFileSync('./CA1.pem'), 
  requestCert: true, 
  rejectUnauthorized: true 
}; 

var options2 = { 
  key: fs.readFileSync('./privatekey.pem'), 
  cert: fs.readFileSync('./certificate.pem'), 
 // ca: fs.readFileSync('./CA1.pem'), 
  //requestCert: true, 
  //rejectUnauthorized: true 
}; 

var options;

if(autenthication){
  options=options1
}
else{
  options=options2
}

  console.log('@Listening on 4433')
  https.createServer(options, function (req, res) { 
    console.log(new Date()+' '+ 
      req.connection.remoteAddress+' '+ 
     // req.socket.getPeerCertificate().subject.CN+' '+ 
      req.method+' '+req.url); 
    res.writeHead(200); 
    res.end("Secure Hello World with node.js\n"); 
  }).listen(4433);

