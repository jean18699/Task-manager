const User = require('../src/models/user')

require('../src/db/mongoose')

User.findByIdAndUpdate('633f2f6b8c3589f92388924f', {age: 1}).then((user)=>{
    console.log(user);
    User.countDocuments({age: 1})
}).then((result)=>{
    console.log(result)
}).catch(e => console.log(e));