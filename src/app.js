const express = require('express');
const cors = require('cors');
const app = express();


require('./db/mongoose');

const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

app.use(cors({
    origin: 'http://localhost:4200'
}))
app.use(express.json()); //esto debe ir antes de las llamadas a los routers o no se podran leer los request.body
app.use(userRouter, taskRouter);

module.exports = app;