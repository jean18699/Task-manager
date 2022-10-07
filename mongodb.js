const {MongoClient: client, ObjectID, ObjectId} = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


const id = new ObjectId()


client.connect(connectionUrl).then(client => {
    const db = client.db(databaseName);

    //FindOne
   /* db.collection('tasks').findOne({_id: new ObjectId('633bcdff0448d65842bbd3cb')})
    .then(result => console.log(result))
    .catch(error =>  console.log('Could not fetch'));

    //FindMany
    db.collection('tasks').find({completed: false}).toArray()
    .then(result => console.log(result))
    .catch(error => console.log('could not query'));*/

    //Update
    /*db.collection('tasks').updateMany(
        {completed: false}, {$set: {completed: true}}
    )
    .then(result => console.log(result))
    .catch(error => console.log(error));*/

    //Delete
    /*db.collection('users').deleteMany({name: 'Edited'})
    .then(result => console.log(result))
    .catch(error => console.log(error));
    */

})
.catch(error => console.log(error));

