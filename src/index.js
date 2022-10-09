const express = require('express');
const { default: mongoose, Model, model } = require('mongoose');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose');
const router = require('./routers/user');
const {MongoClient} = require('mongodb');
const app = express();

const port = process.env.PORT || 3000;

app.use(router);
app.use(express.json());

const dbUrl = "mongodb://localhost:27017";

app.listen(port, ()=>{
    console.log('connected to port ' + port)
});

app.get("/users", async (req, res)=>{
    try {
        res.send(await User.find({}));    
    }catch(e){
        res.status(500).send(e);
    }
});

app.get("/users/:id", async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
        res.status(500).send(e);
    }
});

app.patch('/users/:id', async (req, res)=>{
    const id = req.params.id;
    const updatedBody = req.body;

    //Agregando validacion de lo que se puede modificar
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

    if(!isValidOperation){
       return res.status(400).send({error: 'Invalid update'});
    }

    try {
        const user = await User.findByIdAndUpdate(id, updatedBody, {new: true, runValidators: true}); //new: true retorna el usuario luego de ser modificado. No antes.
        if(!user){
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    }catch(e){
        res.status(500).send(e);
    }
})

app.post("/users", async (req, res)=>{
    const user = new User(req.body);
    
    try {
        await user.save();
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
});

app.get('/tasks', async (req, res)=>{
    try {
        res.send(await Task.find({}))
    }
    catch(e){
        res.status(500).send(e)
    }
});

app.get('/tasks/:id', async (req, res)=>{
    try {
        const task = await Task.findById(req.params.id);
        if(!task){
           return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
});

app.patch('/tasks/:id', async(req, res)=>{
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const validEdits = ['description']
    const isValid = updates.every((update)=> validEdits.includes(update));

    if(!isValid){
        return res.status(400).send({error: 'Cant edit these values'});
    }

    try{
        const task = await Task.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
        if(!task){
            return res.status(404).send({error: 'The task was not found'});
        }
        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }


});

app.post('/tasks', async (req, res)=>{
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
});