const express = require('express')
const morgan = require('morgan')
const app = express()



let contacts = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (request, response) => {
  response.send('<h1>Server working</h1>')
})

//SHOW INFO OF REQUEST
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${contacts.length} people</p>
    <p>${new Date()}</p>
  `)
})

//LIST CONTACT BY ID
app.get('/api/contacts/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(person => person.id === id)
  
  contact ? response.json(contact) : response.status(404).end()

})

//LIST ALL CONTACTS
app.get('/api/contacts', (request, response) => {
  response.json(contacts)
})

//DELETE APP
app.delete('/api/contacts/:id', (request, response) => {
  const contact = request.params;
  
  const id = Number(contact.id)
  contacts = contacts.filter(contact => contact.id !== id);

  response.status(204).end()
})



//ADD CONTACT

//GENERATE A RANDOM ID, ITS WRONG, BUT WILL CHANGE IT LATER
const generateId = () => {
  const id = Math.floor(Math.random() * 101);
  
  return id;
}

app.post('/api/contacts', (request, response) => {
  const contact = request.body

  let exists = false;

  contacts.map(person => {
    if(person.name === contact.name){
      exists = true;
    }
  })
  
  if(exists){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  if(!contact.name || !contact.number){
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = {
    id: generateId(),
    name: contact.name,
    number: contact.number
  }

  contacts = contacts.concat(person)

  response.json(person)

})


//used for catching requests made to non-existent routes *
const unknownEndpoint = (request, response) =>{
  response.status(404).send({error: 'unknow endpoint'})
}

app.use(unknownEndpoint)

const PORT = 3000
app.listen(PORT, () =>{
  console.log("Server running on port", PORT)
})