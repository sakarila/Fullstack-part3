require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :req[content-length] :response-time ms - :res[content-length] :body '));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person.toJSON())
        } else {
            res.status(404).end()
        }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            if (result) {
                res.status(204).end()
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/api/info', (req, res, next) => {
    dateTime = new Date()
    Person.find({}).then(persons => {
        res.send(`<p> Phonebook has info for ${persons.length} people </p> ${dateTime}`);
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
      return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person( {
        name: body.name,
        number: body.number
    })
    person.save()
    .then(savedPerson => {
        res.json(savedPerson.toJSON());
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})