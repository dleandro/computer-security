var fs = require('fs'); 
var https = require('https'); 
var options = { 
  //key: fs.readFileSync(<ficheiro PEM com chave privada do servidor>), 
  //cert: fs.readFileSync(<ficheiro PEM com certificado do servidor>), 
  //ca: fs.readFileSync(<Ficheiro contendo Certificado PEM da CA root>), 
  //requestCert: true, 
  //rejectUnauthorized: true 
}; 

https.createServer(options, function (req, res) { 
  console.log(new Date()+' '+ 
    req.connection.remoteAddress+' '+ 
    //req.socket.getPeerCertificate().subject.CN+' '+ 
    req.method+' '+req.url); 
  res.writeHead(200); 
  res.end("Secure Hello World with node.js\n"); 
}).listen(4433);

console.log('Listening @4433');