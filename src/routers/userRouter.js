const express = require('express')
const router = express.Router();
const User = require('../models/user');

router.get("/users", async (req, res)=>{
    try {
        res.send(await User.find({}));    
    }catch(e){
        res.status(500).send(e);
    }
});

router.get("/users/:id", async (req,res)=>{
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

router.patch('/users/:id', async (req, res)=>{
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

router.post("/users", async (req, res)=>{
    const user = new User(req.body);
    
    try {
        await user.save();
        res.status(201).send(user);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete("/users/:id", async (req, res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user){
           return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    }catch(e){
        res.status(500).send(e);
    }
});


module.exports = router;