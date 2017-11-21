const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID()

console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err){
		return console.log('Unable to connect to MoongoDB server')
	}
	console.log('Connected to MongoDB server')

	db.collection('Users').find(
		{name: 'My Name'}
		).toArray().then((docs) => {
		console.log('Todos')
		console.log(JSON.stringify(docs, undefined, 2))
	}, (err) => {
		console.log('Unable to fetch todos', err)
	})
	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`)		
	// }, (err) => {
	// 	console.log('Unable to fetch todos', err)
	// })
	// db.close()
})