const request = require("request");
const apikey = "hNwe1emGGRRYKLkhj9OL9MuQl843";

request.post({ 
    url: "http://cricapi.com/api/matches/", 
    form: { apikey: apikey }
}, function(err, resp, body) { 
    body = JSON.parse(body);
    for (let i = 0; i < body.matches.length; i++) {
        if (body.matches[i].matchStarted == true){
            console.log(body.matches[i]);
        } else {
            break;
        }
    }
});