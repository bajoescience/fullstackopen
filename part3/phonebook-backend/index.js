const express = require('express')

const morgan = require('morgan')

const dotenv = require('dotenv')


dotenv.config()

const Person = require('./models/person')


const app = express()

app.use(express.static('build'))

app.use(express.json())

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      res.json(person)
    })
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(
      `<div>
            <p>phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
            </div>`
    )
  })
})

app.post('/api/persons', (req, res, next) => {
  const {name, number} = req.body
  if (!name || !number) {
    return res.status(400).json({
      error: 'missing name or number'
    })
  }
 
  const person = new Person({
    name: name,
    number: number
  })
  person.save()
    .then(person => {
      res.json(person)
    })
    .catch(err => {
      console.log(err.name)
      next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(404).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`server is currently running on port ${PORT}`)
})