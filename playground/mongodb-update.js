const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID()

console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err){
		return console.log('Unable to connect to MoongoDB server')
	}
	console.log('Connected to MongoDB server')

	db.collection('Users').findOneAndUpdate({
		name: 'Shmuck'
	}, {$set: {name: 'Shmu'},
		$inc: {age: -2}
		}, {returnOriginal: false}).then((result) => {
			console.log(result)
	})
	// db.close()
})