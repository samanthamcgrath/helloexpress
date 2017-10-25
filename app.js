const express = require('express');
const https = require('https');
const app = express();


app.get('/', function (req, res) {
    https.get('https://xkcd.com', function(result) {
        //console.log("Got response: " + result.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(result.headers));
        result.setEncoding('utf8');

        getData(result, (rawData) => {
            var re = new RegExp('Permanent link to this comic: https://xkcd.com/(\\d+)/');
            var num = re.exec(rawData);
            var rand = Math.floor((Math.random() * num[1]) + 1);
            console.log('num = ' + num[1]);
            console.log('rand = ' + rand);
            var link = 'https://xkcd.com/' + rand + '/';
            console.log(link);
            https.get(link, function(result2) {
                result2.setEncoding('utf8');
                console.log("Got response: " + result2.statusCode);

                getData(result2, (allData) => {
                    //console.log(myData);
                    var reg = new RegExp('(https://imgs.xkcd.com/comics/.*.png)', 'i');
                    var imgSrc = reg.exec(allData);
                    console.log("img src = " + imgSrc[1]);
                    var html = "<img src=\"" + imgSrc[1] + "\">";
                    res.send(html);
                    res.end();
                });
            });

            
        });
    });
    
});

function getData (result, callback) {
    let myData = '';
    result.on('data', (chunk) => { 
        //console.log(chunk);
        myData += chunk; 
    });

    result.on('end', () => { callback(myData)});
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});