const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const express = require("express")


dotenv.config({path:".env"});
connectDB();

const app = express();
 

//used to parse the json object
app.use(bodyParser.json());

//used to parse the strings passed from url
app.use(express.urlencoded({extended: false}))


//used when html need to communicate with backend without react
app.set("view engine","ejs")

app.use(express.static(__dirname + '/public'));


app.post("/removeUrl", async(req,res,err) => {
    
    const {name} = req.body

    const reqUrl = await shortUrl.findOne({short:name})

    // console.log(reqUrl);
    if(reqUrl == null)
    {
        console.log("Link not found");
    }

    else{
        shortUrl.deleteOne({short:reqUrl.short},(err,response)=>{
            if(err)
            response.send(err.message);
            
            else{
            console.log("item deleted");
        }
        });
    }
    res.redirect("/");
});

app.get('/',async(req,res)=>{
    const shortAllUrls = await shortUrl.find();

    res.render('index',{allUrls: shortAllUrls})
})

app.post("/shortUrls", async(req,res)=>{
    await shortUrl.create({full: req.body.myUrl});

    res.redirect("/");
})


app.get("/:customUrl",async (req,res)=>{
    const reqUrl = await shortUrl.findOne({short:req.params.customUrl})

    if(reqUrl == null) return res.sendStatus(404);

    reqUrl.clicks++;
    reqUrl.save();

    res.redirect(reqUrl.full);
})

app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log("server running at port 3000");
});


// const flash = require('connect-flash')
// const session = require('express-session');

// app.use(session({
//     secret:'flashblog',
//     cookie: {maxAge: 60000},
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(flash());
