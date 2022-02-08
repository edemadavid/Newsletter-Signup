const express = require("express");
const app = express();

const path = require("path/posix");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: "true"}));

const request = require("request")

const PORT = process.env.PORT || 4000;

app.use(express.static("public"));

const https = require("https")


app.get("/", function (req, res){
    res.sendFile(path.join(__dirname, "signup.html"));
})


app.post("/", function (req, res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;

    // console.log(fname, lname, email);

    const data = {
        members: [ 
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            } 
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/dd012ffab8";

    const options = {
        method: "POST",
        auth: "Davovie:ed903a9cae78a5d781d35f4a79e0fb6d-us14"
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(path.join(__dirname, "success.html"))
        }   else {
            res.sendFile(path.join(__dirname, "failure.html"))
        }

        response.on("data", function (data){
           console.log(JSON.parse(data)); 
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen (PORT, function(req, res){
    console.log("server has start on port: " + PORT );
}); 

// Api key:
// ed903a9cae78a5d781d35f4a79e0fb6d-us14


// list id
// dd012ffab8