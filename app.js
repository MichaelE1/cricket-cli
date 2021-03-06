const request = require('request');
const Table = require('cli-table');
const chalk = require('chalk');
const CFonts = require('cfonts');
const clear = require('clear');

const APIurl = "http://cricscore-api.appspot.com/csa"; 

let unique_id = null;
let input = null;

CFonts.say('GARRY', {
    font: 'block',         
    align: 'left',         
    colors: ['green'],     
    background: 'black',   
    letterSpacing: 1,      
    lineHeight: 1,         
    space: false,          
    maxLength: '0'         
});

// Simple function to get user input
function prompt(question, callback) {
    let stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        input = data.toString().trim();
        callback();
    });
}

// Create table summary of games currently being played
request.get({ 
    url: APIurl,
    json: true,
}, (err, resp, body) => { 
    let table = new Table();

    for (let i = 0; i < body.length; i++) {
        let index = i.toString();
        let game = body[i].t2 + " vs " + body[i].t1;
        table.push({[index] : [game]});
    }
    
    console.log(table.toString());
    
    prompt("Enter the match ID you would like to follow: ", function loop() {

        // Basic input error checking
        if (isNaN(input) || input >= body.length){
            console.log("That's not a valid ID :@");
            process.exit();
        }
        
        // Store the unique id of the match
        if (unique_id == null) {
            unique_id = body[input].id;
        }

        // Retrieve details for chosen match
        request.get({
            url: APIurl + "?id=" + unique_id,
            json: true,
        }, (err, resp, body) => {

            // Store the match info...
            let score = body[0].de.split("(")[0];
            let results = body[0].de.split("(")[1].split(",")
            let overs = results[0];
            let batter1 = results[1];
            let batter2 = results[2];
            let bowler = body[0].de.split("(")[1].split(",")[3].split(")")[0];
            let info = body[0].de.split("(")[1].split(",")[3].split(")")[1];
            
            // Clear the console & write ALL the things
            clear();
            console.log(chalk.blueBright(score + "(" + overs + ")" + info + "\n"));
            console.log(batter1);
            console.log(batter2);
            console.log("\n" + bowler + "\n");

            if ('si' in body[0]) {
                console.log (body[0].si + "\n");
            }

            // Update score every 20 seconds
            setInterval(loop, 20000);
        }); 
    });
});