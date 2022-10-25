const express = require('express');
const app = express();

require('./db/mongoose');

const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

app.use(express.json()); //esto debe ir antes de las llamadas a los routers o no se podran leer los request.body
app.use(userRouter, taskRouter);

module.exports = app;