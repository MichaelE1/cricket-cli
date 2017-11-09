const request = require("request");
const Table = require('cli-table');

const apikey = "hNwe1emGGRRYKLkhj9OL9MuQl843";
let unique_id;

let table = new Table();

// alternative API: https://cricscore-api.appspot.com/

request.post({ 
    url: "http://cricapi.com/api/matches/", 
    form: { apikey: apikey }
}, function(err, resp, body) { 
    body = JSON.parse(body);
    for (let i = 0; i < body.matches.length; i++) {
        if (body.matches[i].matchStarted == true){
            let index = i.toString();
            let game = body.matches[i]['team-2'] + " vs " + body.matches[i]['team-1'];
            table.push({[index] : [game]}); 
        } else {
            break;
        }
    }
    
    console.log(table.toString());
    
    prompt("Enter the match ID you would like to follow: ", function (input) {
        unique_id = body.matches[input].unique_id;
        console.log(unique_id);

        request.post({
            url: "http://cricapi.com/api/cricketScore/", 
            form: { unique_id: unique_id, apikey: apikey }
        }, function(err, resp, body) { 
            console.log(body); 
        });
    });
}); 


function prompt(question, callback) {
    let stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
}