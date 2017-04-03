var express = require('express');
var router = express.Router();

var fs = require('fs');
var Promise = require('bluebird');

var WORD_FILE = './datasets/words.txt', OUTPUT = './datasets/output.csv';
var words, user = 1000;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getpassword', function(req, res) {
    var pass = [];

    for(var i=0; i<3; i++) {
        pass.push(generatePassword());
    }

    var obj = {
            userId: user++,
            password: pass
        };

    res.send(obj);
});

router.post('/loginattempt', function(req, res) {
    logToFile(req.body);
    res.send({res: 'ok'});
});


readTextFile(WORD_FILE).then(function(data) {
	words = data;
}).catch(function(err) {
	console.error('Err:'+err);
});

function logToFile(content) {
    var str = '\n'+content.user+','+
        content.memduration+','+content.inputduration+','+
        content.status+','+content.entered+','+
        content.pass+','+content.account+','+content.order+',,';
    fs.appendFile(OUTPUT, str, function(err){
        if (err) {
            console.error('Err app: '+err);
            throw err;
        }
        console.log('Appended to file');
    });
}

function readTextFile(filename) {
	return new Promise(function(resolve, reject) {
        console.log('Reading '+filename);
		fs.readFile(filename, 'utf8', function(err,data) {
			if (err) {
				reject(err);
			}
			else {
				var arr = data.split('\n');
				console.log(filename+': '+arr.length)
				resolve(arr);
			}
		});
	});
}

function generatePassword() {
    var aRand = Math.floor(Math.random() * (words.length - 1));
	var bRand = Math.floor(Math.random() * (words.length - 1));

	return cap(words[aRand])+cap(words[bRand]);

    function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = router;
