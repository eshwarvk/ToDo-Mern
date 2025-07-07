// getting express module
//getting mongoose module
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
// creating express instance
const app = express();

//middleware
app.use(express.json());
app.use(cors());
//connecting mongodb
mongoose.connect('mongodb://localhost:27017')
.then( ()=>{
    console.log("DB Conneccted");
})
.catch((err)=>{
    console.log(err);
})

//creating schema
const todoSchema = new mongoose.Schema({
    title:{required:true,
            type:String
    },
    description:{
        required:true,
        type:String}
})

//creating model
const todoModel = mongoose.model('Todo',todoSchema);

//creating todo item
let todos = []
app.post('/todos', async (req,res) => {
    const {title,description} = req.body;
    try {
        const newTodo = new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo)
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
});

//getting todo items
app.get('/todos', async (req,res)=>{
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
});

//update a todo
app.put('/todos/:id',async (req,res)=>{
    try {
        const {title,description} = req.body;
        const id = req.params.id;
        const updatedToDo = await todoModel.findByIdAndUpdate(id,{title,description},{new:true});
        if(!updatedToDo)
            return res.status(404).json({message:"Todo is not found"});
        res.json(updatedToDo);
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

//delete a todo
app.delete('/todos/:id',async (req,res)=>{
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

//server
const port = 8000;
app.listen(port);