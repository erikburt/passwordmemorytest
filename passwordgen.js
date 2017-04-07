//Used modules
var prompt = require('prompt-sync')();
var fs = require('fs');
var Promise = require('bluebird');

//Location of dataset
var WORD_FILE = './datasets/words.txt';
var words;

//Reads text file and parses into array of strings
readTextFile(WORD_FILE).then(function(data) {
	words = data;
	var input;
	
	//Prompting user for number of desired passwords
	var n = prompt('How many passwords would you like to generate? ');
	n = parseInt(n,10);
	
	//Output n passwords
	if (!isNaN(n)) {
		for(var i=0; i<n; i++) {
			console.log((i+1)+'.\t'+generatePassword());
		}
	}
}).catch(function(err) {
	console.error('Err:'+err);
});

//Reads text file and returns parsed array via promises
function readTextFile(filename) {
	return new Promise(function(resolve, reject) {
		fs.readFile(filename, 'utf8', function(err,data) {
			if (err) {
				reject(err);
			}
			else {
				var arr = data.split('\r\n');
				resolve(arr);
			}
		});
	});
}

//Generate password function, chooses two random integers from 0 to length of array-1
function generatePassword() {
    var aRand = Math.floor(Math.random() * (words.length - 1));
	var bRand = Math.floor(Math.random() * (words.length - 1));

	return cap(words[aRand])+cap(words[bRand]);

	//Makes first character of string capitalized
    function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
