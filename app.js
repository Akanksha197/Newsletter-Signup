const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/", function(req,res){
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members:[
        {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: fName,
                LNAME: lName
            }
        }
        ]}

    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/916acda0f4@";
    const options = {
        method: "POST",
        auth: "akanksha:1c646cbaab8a1d9616456ff655b9d9a0-us5"
    };

    const request = https.request(url, options, function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("server is up and running at port 3000.");
})


// Mailchimp api key: 1c646cbaab8a1d9616456ff655b9d9a0-us5
// List id: 916acda0f4