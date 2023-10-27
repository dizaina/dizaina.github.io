//Lets require/import the HTTP module
var http = require('http');
var url = require('url');
var fs = require('fs');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(req, res){
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    console.log(filename);
    fs.readFile(filename, function(err, data) {
        console.log(data);
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
   // res.end('It Works!! Path Hit: ' + req.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});