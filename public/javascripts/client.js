var EMAIL_ID = 0, BANK_ID = 1, FB_ID = 2;
var startMemory = [], endMemory = [], startEnter;
var user, password = [], order = [EMAIL_ID,BANK_ID,FB_ID], numEntered = 0;
var attempts = 0, practiced = 0;

function nextPractice() {
    practiced++;
    var now = new Date();
    endMemory.push(now);
    
    if (practiced == 1) {
        $('#passworddisplayone').hide();
        $('#passworddisplaytwo').show();
        $('#passwordtest').val('');
        startMemory.push(now);
        $('#togview').prop('disabled', true);
    }
    else if (practiced == 2) {
        $('#passworddisplaytwo').hide();
        $('#passworddisplaythree').show();
        $('#passwordtest').val('');
        startMemory.push(now);
        $('#togview').prop('disabled', true);
    }
    else {
        $('#passwordtest').val('');
        $('#passwordmemory').hide();
        $('#login').show();
        $('#togview').hide();
        var text = getTextForPrompt(order[0]);
        $('#passwordprompt').text(text);
        $('#togview').prop('disabled', true);
        startEnter = new Date();
    }  
}

function submitPassword() {
    var entered = $('#password').val();
    var correct = (entered == password[order[numEntered]]);
    var index = order[numEntered];
    $('#password').val('');
    
    var req = {
        user: user,
        memduration: endMemory[index].getTime()-startMemory[index].getTime(),
        inputduration:(new Date()).getTime()-startEnter.getTime(),
        status: ((correct) ? 'success' : 'failure'),
        entered: entered,
        pass: password[index],
        account: getTextForPrompt(index),
        order: numEntered
    }
    
    $.post('loginattempt', req, function(data) {
        console.log(data);
    });
    
    attempted++;
    
    if (correct) {
        alert('Correct!');
        nextPassword();
    }
    else {
       alert('Incorrect! You entered '+entered+'. '+attempted+'/3 attempts used.');  
        
        if (attempted >= 3) {
            nextPassword();
        }       
    }
    
    function nextPassword() {
        numEntered++;
        
        if (numEntered < 3) {
            var text = getTextForPrompt(order[numEntered]);
            $('#passwordprompt').text(text);
            startEnter = new Date();
            attempted = 0;
        }
        else {
            resetPage();
        }     
    }
}

$('#passwordtest').keyup(function() {
    var input = $('#passwordtest').val();
    
    if (input == password[practiced]) {
        $('#togview').prop('disabled', false);
    }
    else {
        $('#togview').prop('disabled', true);
    }
});
    
$(document).ready(function() {
    resetPage();                
});

function getTextForPrompt(i) {
    switch(i) {
        case EMAIL_ID:
            return 'Email';
        case BANK_ID:
            return 'Bank';
            break;
        case FB_ID:
            return 'Facebook';
        default:
            return 'error in switch';
    }
}

function resetPage() {
    startMemory.push(new Date());
    attempted = 0;
    practiced = 0;
    
    $.get('getpassword', function(data) {
        user = data.userId;
        password = data.password;
        console.log(password);
        $('#passworddisplayone').text('Email: '+password[EMAIL_ID]);
        $('#passworddisplayone').show();
        
        $('#passworddisplaytwo').text('Bank: '+password[BANK_ID]);
        $('#passworddisplaytwo').hide();
        
        $('#passworddisplaythree').text('Facebook: '+password[FB_ID]);
        $('#passworddisplaythree').hide();
        
        $('#passwordmemory').show();
        $('#login').hide();
        $('#togview').show();
    });
    
    var randA, randB, save;
    
    for (var i=0; i<5; i++) {    //Make 5 permutations of the order
        randA = Math.floor(Math.random()*3);
        while(randA == (randB = Math.floor(Math.random()*3)));
        
        save = order[randA];
        order[randA] = order[randB];
        order[randB] = save;
    }
}