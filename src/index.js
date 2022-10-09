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

app.get("/users", (req, res)=>{
    User.find({}).then(users => res.send(users))
    .catch(err => res.status(500).send(err)); 
});

app.get("/users/:id", (req,res)=>{
    User.findById(req.params.id)
    .then(user => {
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }) 
    .catch(err => res.status(500).send(err));
});

app.post("/users", (req, res)=>{
    const user = new User(req.body);
    
    user.save().then(()=>{
        res.status(201).send(user)
    })
    .catch((err)=>{
        res.status(400).send(err)
    });
    
});

app.get('/tasks', (req, res)=>{
    Task.find({}).then(tasks => res.send(tasks))
    .catch(err => res.status(500).send(err));
});

app.get('/tasks/:id', (req, res)=>{
    Task.findById(req.params.id).then((task)=>{
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    })
    .catch(err => res.status(500).send(err));
});


app.post('/tasks', (req, res)=>{
    const task = new Task(req.body);
    task.save().then(()=> {
        res.status(201).send(task)
    })
    .catch((err)=> res.status(400).send(err));
});