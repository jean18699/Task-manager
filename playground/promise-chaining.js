const User = require('../src/models/user')

require('../src/db/mongoose')

/*User.findByIdAndUpdate('633f2f6b8c3589f92388924f', {age: 1}).then((user)=>{
    console.log(user);
    User.countDocuments({age: 1})
}).then((result)=>{
    console.log(result)
}).catch(e => console.log(e));*/


const updateAgeAndCount = async (id, updatedAge) => {
    const user = await User.findByIdAndUpdate(id, {age: updatedAge})
    const count = await User.countDocuments({age: updatedAge})
    return count;
}

updateAgeAndCount('6340354fe245bf493fe515d7', 5).then(count => {
    console.log(count);
}).catch(e => console.log(e));