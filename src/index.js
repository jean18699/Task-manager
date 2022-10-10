const express = require('express');
const app = express();

require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const port = process.env.PORT || 3000;


app.use(express.json()); //esto debe ir antes de las llamadas a los routers o no se podran leer los request.body
app.use(userRouter, taskRouter);

app.listen(port, ()=>{
    console.log('connected to port ' + port)
});

const bcrypt = require('bcryptjs');

const myFunction = async()=>{
    const password = 'Red12345';
    const hashedPassword = await bcrypt.hash(password, 8);
    

    console.log(password);
    
    console.log(hashedPassword);
    
    
    const isMatch = await bcrypt.compare(password, hashedPassword2);

    console.log(isMatch);
}


myFunction()

