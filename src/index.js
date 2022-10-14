const express = require('express');
const app = express();

require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const port = process.env.PORT || 3000;

//middleware
/*app.use((req, res, next)=>{
   if(req.method === 'GET'){
     res.send('GET requests are disabled')
   }else {
     next();
   }
});*/
/*
app.use((req, res, next)=>{
    res.status(503).send('The server is currently in mantenimiento');
});
*/

app.use(express.json()); //esto debe ir antes de las llamadas a los routers o no se podran leer los request.body
app.use(userRouter, taskRouter);


app.listen(port, ()=>{
    console.log('connected to port ' + port)
});

const jwt = require('jsonwebtoken');

const myFunction = async()=>{
   const token = jwt.sign({_id: 'abc123'}, 'thisismynewcourse');
  // console.log(token);

    const data = jwt.verify(token, 'thisismynewcourse');
  //  console.log(data);

}


myFunction()

