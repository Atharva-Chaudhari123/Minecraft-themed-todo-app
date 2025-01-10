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

const getTaskModel = (collection_name) =>{
    return mongoose.model(collection_name,dbSchema) ;
}

// const task = mongoose.model(collection , dbSchema) ;

app.post("/task/:id" , async(req, res) =>{

    const Task = getTaskModel(req.params.id) ;

    console.log("its coming here")

    const result = await Task.create({
        task : req.body.task ,
        status : req.body.status,
        date :  Date.now() ,
        _id : req.params.id
    })
    console.log("below db operation");
    return res.status(200).end("what uppp") ;
})

app.get("/task/:id", async (req, res) =>{
    const Task = getTaskModel(req.params.id) ; 

    const result = await Task.find({}) ;
    res.json(result) ;

 
})



app.listen(port, (err) =>{
    if(err){   
        return console.log("Error : " + err) ;
    }
    console.log("Server started suceessfully at port " + port) ;
} ) ;
