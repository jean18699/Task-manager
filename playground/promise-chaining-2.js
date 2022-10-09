require('../src/db/mongoose');
const Task = require('../src/models/task');


Task.findByIdAndRemove('633f838183cb0fd959d2d23d').then(task =>{
    console.log(task);
    return Task.countDocuments({completed: false})
}).then((result)=>{
    console.log(result);
}).catch(err => console.log(err));

