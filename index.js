const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
const Person = require('./models/person')

const date = new Date();
const options = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short'
};

const formattedDate = date.toLocaleString('en-US', options);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('<h3>Random for the / path</h3>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
      res.json(person)
    })
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${notes.length} people</p> 
    <p>${formattedDate}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(removed => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson =>{
    res.json(savedPerson)
  })

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
  .then(updated => {
    response.json(updated)
  })
  .catch(error => next(error))
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
