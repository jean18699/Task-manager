const express = require('express');
const Task = require('../models/task');
const router = express.Router();

router.get('/tasks', async (req, res)=>{
    try {
        res.send(await Task.find({}))
    }
    catch(e){
        res.status(500).send(e)
    }
});

router.get('/tasks/:id', async (req, res)=>{
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

router.patch('/tasks/:id', async(req, res)=>{
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const validEdits = ['description']
    const isValid = updates.every((update)=> validEdits.includes(update));

    if(!isValid){
        return res.status(400).send({error: 'Cant edit these values'});
    }

    try{
        const task = await Task.findById(id);

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

       // const task = await Task.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
        if(!task){
            return res.status(404).send({error: 'The task was not found'});
        }
        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }


});

router.post('/tasks', async (req, res)=>{
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete("/tasks/:id", async (req, res)=>{
    try {
        const user = await Task.findByIdAndDelete(req.params.id);

        if(!user){
           return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    }catch(e){
        res.status(500).send(e);
    }
});

module.exports = router;