const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [{
	_id: userOneId,
	email: 'email1@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 's11s').toString()
	}]
}, {
	_id: userTwoId,
	email: 'email2@example.com',
	password: 'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, 's11s').toString()
	}]
}]
const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
	_creator: userOneId	
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	_creator: userTwoId,
	completed: true,
	completedAt: 666
}]

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done())
}

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save()
		var userTwo = new User(users[1]).save()

		return Promise.all([userOne, userTwo])
	}).then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers}