const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')
const {ObjectID} = require('mongodb')

// var id = "5a15502dc85fac542135ae9923"
// if(!ObjectID.isValid(id)){
// 	console.log('ID not valid')
// }
// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos)
// })

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo)
// })

// Todo.findById(id).then((todo) => {
// 	if(!todo) {
// 		return console.log('Id not found')
// 	}
// 	console.log('Todo By Id', todo)
// }).catch((e) => console.log(e))

var id = "5a15267ffff9d8641bfc271e"

User.findById(id).then((user) => {
	if(!user){
		return console.log('Id not found')
	}
	console.log('User by Id', user)
}).catch((e) => console.log(e))