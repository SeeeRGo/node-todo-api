const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID()

console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err){
		return console.log('Unable to connect to MoongoDB server')
	}
	console.log('Connected to MongoDB server')

	// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((count) => {
	// 	console.log(`Deleted ${count.n} todo(s)`)
	// }, (err) => {
	// 	console.log('Unable to delete documents')
	// })
	// db.collection('Todos').deleteOne({text: 'Something to do'}).then((count) => {
	// 	console.log(`Deleted ${count.n} todo(s)`)
	// }, (err) => {
	// 	console.log('Unable to delete documents')
	// })
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result)
	// })
	db.collection('Users').deleteMany({name: 'My Name'}).then((result) => {
		console.log(result)
	})
	db.collection('Users').findOneAndDelete({
		_id: new ObjectID('5a1485ff50333718480090fa')
	}).then((result) => {
		console.log(result)
	})
	// db.close()
})