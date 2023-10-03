const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// Using BodyParser
app.use(bodyParser.urlencoded({extended: true}));

// To add static page like css and js
app.use(express.static("public"))

// Setting Views Engine
app.set("view engine", "ejs");

// Setting Express Port 
const port = process.env.PORT || 4000;


// Connecting to Mongoose server and creating a db locally
mongoose.connect("mongodb://127.0.0.1:27017/todoList", {useNewUrlParser: true})
.then(()=>{
    console.log("Connection Created Successfully")
})
.catch((err)=>{
    console.log(err)
})


// Creating the Item Collection structure
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
    }
})

// Creating Model based on the structure
const items = mongoose.model("item", itemSchema);




// Home Route 
app.get("/", (req, res)=>{    
    // Fetching all the items
    items.find({})
    .then((d)=>{
        res.render("index",{
            Items: d
        })

    })
    .catch((err)=>{
        console.log(err)
    })
    
})


app.get("/functions", (req,res)=>{
    
    res.redirect("/")
})



// Getting the Input Data
app.post("/", (req,res)=>{
   let input = req.body.search;

    const itemList = new items({
        name: input
    })
    itemList.save()
    res.redirect("/")
})



// Deleting Items
app.post("/functions", (req,res)=>{
    const deleteItems = req.body.delete;

    items.find({})
    .then((d)=> {
        if(deleteItems){
            items.findByIdAndDelete({_id: deleteItems})
            .then(()=>{
                console.log("Item Deleted Successfully")
            })
        }    
    })

    res.redirect("/functions")
})


app.listen(port, ()=>{
    console.log("Listening to PORT " + port )
})