const express = require("express") ; 
const cors = require("cors");
const app = express() ;

const mongoose = require("mongoose") ;

const port = 8000 ;

// form data parsing

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json()) ;


// db connection
const db = mongoose.connect("mongodb://127.0.0.1:27017/minecraft-todo-app") 
.then(()=> console.log("MongoDb Connection success")) 
.catch((err)=> console.log("MongoDb connection failed :" + err)) ;

//Schema
const dbSchema = mongoose.Schema({
    task : {
        type : String ,
        required : true ,
        unique : true ,
    },
    status : {
        type : Boolean ,
        required : true ,
    } ,
    date : {
        type : Date 
    },
    _id : {
        type : String,
        required : true 
    }
})
const userSchema = mongoose.Schema({
    username : {
     type: String , 
     required : true,
     unique : true ,
    } ,

    password  : {
     type : String ,
     required : true,

    }
});

const getTaskModel = (collection_name, userSchema) =>{
    if(!userSchema   ){
        return mongoose.model(collection_name, dbSchema , collection_name) ;

    }else{
        return mongoose.model (collection_name, userSchema , collection_name) ;
    }
}
 
// const task = mongoose.model(collection , dbSchema) ;

app.post("/task/:id" , async(req, res) =>{

    const Task = getTaskModel(req.params.id) ;
    

    console.log(req.params.id) ;
    console.log(req.body.username) ;

    const result = await Task.create({
        task : req.body.task ,
        status : req.body.status,
        date :  Date.now() ,
        _id : `${req.body.username}-${Date.now()}`  
    })
    console.log("below db operation");
    return res.status(200).end("what uppp") ;
})

app.get("/task/:id", async (req, res) =>{
    const Task = getTaskModel(req.params.id) ; 

    const result = await Task.find({}) ;
    res.json(result) ;

 
})

app.post("/newuser", async(req,res)=>{

    const user = getTaskModel("users", userSchema) ;

    try{
        await user.create({
            username : req.body.username ,
            password :  req.body.password ,
    
        }) ;
    }catch (e) {
        return res.send("Username already exist :( ") ;
    }

}) ;

app.post("/search", async (req, res) => {
    const user = getTaskModel("users", userSchema);
    const username = String(req.body.username); // Ensure it's a string
    const password = String(req.body.password);

    console.log("Querying with:", { username, password });

    try {
        const bool = await user.findOne({ username, password });
        console.log("Query result:", bool);

        if (bool != null) {
            console.log("returned true")
            return res.end("true");
        } else {
            console.log("returned false")
            return res.end("false"); // Return "false" as a string
        }
    } catch (err) {
        console.error("Error during database query:", err);
        return res.status(500).end("Internal server error");
    }
});

app.get("/fetchtasks/:id", async(req, res)=>{
    const username = req.params.id ;
    const model = getTaskModel(username) ;

    const allTasks = await model.find({}) ;
    console.log(allTasks)

    return res.json(allTasks) ;

})
app.listen(port, (err) =>{
    if(err){   
        return console.log("Error : " + err) ;
    }
    console.log("Server started suceessfully at port " + port) ;
} ) ;
