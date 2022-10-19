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



const User = require('./models/user');

const Task = require('./models/task');

const main = async ()=>{
  //const task = await Task.findById('634d9cb0b66b166e0b8bc334')
  //await task.populate('user');
  //console.log(task);

 // const user = await User.findById('634dacaee237a5d1559f975e');
 // await user.populate('tasks')
  //console.log(user.tasks);
}

main()