const mongodb = require('mongodb')
const client = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


client.connect(connectionUrl, {useNewUrlParser: true}, (error, client)=>{
    if(error){
        return console.log("Unable to connect to database!");
    }
    
    const db = client.db(databaseName)
    
    const users = db.collection('users').insertOne({
        name: 'Andrew',
        age: 27
    })

})
 