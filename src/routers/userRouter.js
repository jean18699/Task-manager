const express = require('express')
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

//El segundo argumento es el middleware que se correra antes de esta funcion
router.get("/users/me", auth, async (req, res)=>{
    res.send(req.user);
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

router.post("/users/logout", auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        req.user.save();
        res.send()
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/users/logoutAll", auth, async(req, res)=>{
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
})

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
        const user = await User.findById(id);
        updates.forEach(update => user[update] = req.body[update])  //el arreglo al lado del nombre de un objeto permite acceder a sus propiedades de manera dinamica. "Bracket notation"
        await user.save();

      //  const user = await User.findByIdAndUpdate(id, updatedBody, {new: true, runValidators: true}); //new: true retorna el usuario luego de ser modificado. No antes.
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
        const token = await user.generateAuthToken();
        console.log(token);
        res.status(201).send({user, token});
    }catch(e){
        res.status(400).send(e);
    }
});


router.post('/users/login', async(req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(e){
        res.status(400).send();
    }
})

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