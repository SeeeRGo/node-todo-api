const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const{Todo} = require('./../models/todo')
const{User} = require('./../models/user')
const {ObjectID} = require('mongodb')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
	it('should create a new todo', (done) =>{
		var text = 'Test text'

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text)
			})
			.end((err, res) => {
				if(err){
					return done(err)
				}
				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1)
					expect(todos[0].text).toBe(text)
					done()
				}).catch((e) => done(e))
			})
	})

	it('should not create todo with bad data', (done) => {
		var text = ''

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({text})
			.expect(400)
			.end((err, res) => {
				if(err){
					return done(err)
				}
			})

		Todo.find().then((todos) => {
			expect(todos.length).toBe(2)
			done()
		}).catch((e) => done(e))

	})
})

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(1)
			})
			.end(done)

			// Todo.find().then((todosT) => {
			// 	expect(todosT[0]).toInclude(todos[0])
			// 	done()
			// }).catch((e) => done(e))
	})
})

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		var hexId = todos[0]._id.toHexString()
		request(app)
			.get(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text)

			})
			.end(done)
	})
it('should not return todo doc created by another user', (done) => {
		var hexId = todos[0]._id.toHexString()
		request(app)
			.get(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done)
	})

	it('should return 404 if todo not found', (done) => {
		request(app)
			.get(`todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done)
	})
	it('should return 404 for non-objectIDs', (done) => {
		request(app)
			.get('todos/123')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done)
	})
})

describe('DELETE /todos/:id', () => {
	it('should remove todo', (done) => {
		request(app)
			.delete(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text)

			})
			.end((err, res) => {
				if(err){
					return done(err)
				}
				Todo.findById(todos[0]._id.toHexString()).then((todo) => {
				expect(todo).toNotExist()
				done()
				}).catch(e => done(e))
			})			
	})
	it('should not remove todo created by another user', (done) => {
		request(app)
			.delete(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if(err){
					return done(err)
				}
				Todo.findById(todos[0]._id.toHexString()).then((todo) => {
				expect(todo).toExist()
				done()
				}).catch(e => done(e))
			})			
	})
	it('should return 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done)
	})
	it('should return 404 if invalid ObjectID', (done) => {
		request(app)
			.delete(`/todos/404`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done)
	})
})

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString()
		var completed = !todos[0].completed
		var text = 'Entirely new text'
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[0].tokens[0].token)
		.send({text, completed})
		.expect(200)
		.end((err, res) => {
			if(err){
				return done(err)
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo.completedAt).toBeA('number')
				expect(todo.completed).toBe(true)
				expect(todo.text).toBe(text)
				done()
			}).catch((e) => done(e))
		})
	})
	it('should not update the todo created by another user', (done) => {
		var hexId = todos[0]._id.toHexString()
		var completed = !todos[0].completed
		var text = 'Entirely new text'
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
		.send({text, completed})
		.expect(404)
		.end((err, res) => {
			if(err){
				return done(err)
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo.completedAt).toNotExist()
				expect(todo.completed).toBe(false)
				expect(todo.text).toBe(todos[0].text)
				done()
			}).catch((e) => done(e))
		})
	})
	it('should clear completedAt when todo is not completed', (done) => {
		var hexId = todos[1]._id.toHexString()
		var completed = !todos[1].completed
		var text = 'Entirely different new text'
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
		.send({text, completed})
		.expect(200)
		.end((err, res) => {
			if(err){
				return done(err)
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo.completedAt).toNotExist()
				expect(todo.completed).toBe(false)
				expect(todo.text).toBe(text)
				done()
			}).catch((e) => done(e))
		})
	})
})

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			 .get('/users/me')
			 .set('x-auth', users[0].tokens[0].token)
			 .expect(200)
			 .expect((res) => {
			 	expect(res.body._id).toBe(users[0]._id.toHexString())
			 	expect(res.body.email).toBe(users[0].email)
			 })
			 .end(done)
	})
	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({})
			})
			.end(done)
	})
})

describe('POST /users', () => {
	it('should create user', (done) => {
		var email = 'example@example.com'
		var password = '123mnb!'

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist()
				expect(res.body._id).toExist()
				expect(res.body.email).toBe(email)
			})
			.end((err, res) => {
			if(err){
				return done(err)
			}
			User.findOne({email}).then((user) => {
				expect(user).toExist()
				expect(user.password).toNotBe(password)
				done()
			}).catch((e) => done(e))
		})
	})
	it('should not create user for duplicate email', (done) => {
		var email = 'example@example.com'
		var password = '123mnb!'
		request(app)
			.post('/users')
			.send({email: users[0].email, password})
			.expect(400)
			.end(done)
	})
	it('should return validation errors if request invalid', (done) => {
		var email = 'example@example.com'
		var password = '123mnb!'
		request(app)
			.post('/users')
			.send({email, password: '123'})
			.expect(400)
			.end(done)
	})
})

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		var email = users[1].email
		var password = users[1].password
		request(app)
			.post('/users/login')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist()
			})
			.end((err, res) => {
				if(err) {
					return done(err)
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[1]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					})
					done()
				}).catch((e) => done(e))
			})
	})
	it('should reject invalid login', (done) => {
		var email = users[1].email
		var password = users[1].password + '0'
		request(app)
			.post('/users/login')
			.send({email, password})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist()
			})
			.end((err, res) => {
				if(err) {
					return done(err)
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1)
					done()
				}).catch((e) => done(e))
			})
	})
})

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', (done) => {
		var email = users[0].email
		var password = users[0].password
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if(err) {
					return done(err)
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0)
					done()
				}).catch((e) => done(e))
			})
	})
})