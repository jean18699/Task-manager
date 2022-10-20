const express = require('express');
const app = express();

require('./db/mongoose');

const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');


const port = process.env.PORT;

app.use(express.json()); //esto debe ir antes de las llamadas a los routers o no se podran leer los request.body
app.use(userRouter, taskRouter);


app.listen(port, ()=>{
    console.log('connected to port ' + port)
});


