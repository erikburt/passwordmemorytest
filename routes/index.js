var express = require('express');
var router = express.Router();

var fs = require('fs');
var Promise = require('bluebird');

var ADJ_FILE = './datasets/adjectives.txt', VERB_FILE = './datasets/verbs.txt', NOUN_FILE = './datasets/nouns.txt';
var OUTPUT = './datasets/output.txt';
var adj, verb, noun, user = 1000;

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


readTextFile(ADJ_FILE).then(function(data) {
	adj = data;
	return readTextFile(VERB_FILE);
}).then(function(data) {
	verb = data;
	return readTextFile(NOUN_FILE);
}).then(function(data) {
	noun = data;
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
    var aRand = Math.floor(Math.random() * (adj.length - 1));
	var bRand = Math.floor(Math.random() * (verb.length - 1));
	var cRand = Math.floor(Math.random() * (noun.length -1));
	
	return cap(adj[aRand])+cap(noun[cRand])+cap(verb[bRand]);
    
    function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = router;
