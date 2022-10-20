const express = require('express')
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { response } = require('express');
const sharp = require('sharp');
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account');

//El segundo argumento es el middleware que se correra antes de esta funcion
router.get("/users/me", auth, async (req, res)=>{
    res.send(req.user);
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

router.patch('/users/me', auth, async (req, res)=>{
    
    //Agregando validacion de lo que se puede modificar
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation){
       return res.status(400).send({error: 'Invalid update'});
    }

    try {
        const user = req.user;
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
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
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

router.delete("/users/me", auth, async (req, res)=>{
    try {
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.status(200).send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
});

//configuring the upload of files with multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        const validExtensions = ['.jpg', '.jpeg', '.png'];
        const extension = path.extname(file.originalname).toLocaleLowerCase(); //path.extname me da la extension del nombre del archivo
        if(!validExtensions.includes(extension)){
            return cb(new Error('Upload a file with these compatible formats: jpg, jpeg or png'))
        }

        cb(undefined, true);
        //cb = callback
      // cb(new Error('File must be a PDF'));
      // cb(undefined, true);
      // cb(undefined, false);
    }

});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
  
    if(req.file){
        const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer(); //sharp permite transformar las imagenes (recortarlas por ejemplo)
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    }
    else{
        res.status(404).send({error: 'Must upload a file'});
    }
}, (error, req, res, next)=>{ //funcion creada para manejar errores
    res.status(400).send({error: error.message});
});


router.delete('/users/me/avatar', auth, async (req, res)=>{
    try {
        if(req.user.avatar){
            req.user.avatar = undefined;
            await req.user.save();
            res.send();
        }   
        else {
            throw new Error('Avatar not found');
        }
    } catch (e) {
        res.status(404).send({error: e.message});
    }
})

router.get('/users/:id/avatar', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg'); //indicando que el contenido de la respuesta sera una imagen
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;