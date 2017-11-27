const fs = require('fs');
const path = require('path');
var querystring = require('querystring');

function handler(req,res){
  var url = req.url;
  res.writeHead(200,'Content-Type : text/html');
  if(url === '/'){
    fs.readFile(__dirname + '/../public/index.html', function (err,file) {
      if(err){
        console.log(err);
        return ;
      }
      res.end(file);
    });

  }
  else if (url === '/create-post'){
    var allTheData = '';
    req.on('data',function (chunkOfData) {
      allTheData += chunkOfData;
    });
    req.on('end',function () {
      const dataConverted = querystring.parse(allTheData);
      //
        fs.readFile(__dirname +'/posts.json',function (err,result){
          if(err){
            console.log(err);
          }
          else{
            result = JSON.parse(result);
            result[Date.now()]= dataConverted.post;
            console.log('File Content: ' ,result);
            fs.writeFile(__dirname +'/posts.json', JSON.stringify(result) ,(error, resu)=>{
              if(error){
                console.log(error);
              }else{
                res.writeHead(302, {
                  'Location': '/'
                });
                res.end();
              }});
          }
        } )
    });
  }
  else if (url === '/posts') {
    fs.readFile(__dirname +'/posts.json',function (err,result) {
      if(err) return err;
      else{
        res.writeHead(200,'Content-Type : text/html');
        res.end(JSON.stringify(JSON.parse(result)));
      }
    });
  }
  else if(url.startsWith('/')){
    const exst = url.split('.')[1];
    const typeFile = {
      'js':'application/javascript',
      'html': 'text/html',
      'css': 'text/css',
      'ico' :'image/x-icon',
      'png' : ''
    }
    fs.readFile(path.join(__dirname , '..' , '/public' , req.url), function (err,file) {
      if(err){
        console.log(err);
        return ;
      }
      res.writeHead(200,'Content-Type :' + typeFile[exst]);
      res.end(file);
    });

  }
  else{
    res.writeHead(404,'Content-Type : text/html');
    res.end('Page Not Found')
  }
}

module.exports = handler;
