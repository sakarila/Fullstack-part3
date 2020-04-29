const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :req[content-length] :response-time ms - :res[content-length] :body '));

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Matti Meikäläinen",
      "number": "050-098765",
      "id": 5
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
})

app.get('/api/info', (req, res) => {
    people = persons.length;
    dateTime = new Date()
    res.send(`<p> Phonebook has info for ${people} people </p> ${dateTime}`);
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'content missing' 
      })
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ 
            error: 'name must be unique' 
          })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.round(Math.random()*1000)
    }

    persons = persons.concat(person);
    res.json(person);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})