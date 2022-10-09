require('../src/db/mongoose');
const Task = require('../src/models/task');


const deleteTaskAndCount = async (id) =>{
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed: false});
    return count;
}


deleteTaskAndCount('63406a7c5251364eed7bf8c6').then(count => {
    console.log(count)
}).catch(err => console.log(err));
