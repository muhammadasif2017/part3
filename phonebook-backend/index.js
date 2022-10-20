const express = require('express');

const app = express();

app.use(express.json());

let persons = [
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

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const responseStr = `<div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  </div>`;
  response.send(responseStr);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).send('Person not found');
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);

  console.log(person);

  if (!person) {
    return response.status(404).send('Person not found');
  }

  persons = persons.filter(p => p.id !== id);
  console.log(persons);
  response.status(204).end();
});

const findIdForPerson = () => Math.floor(Math.random() * 1000000);

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'Missing required values' });
  }

  const { name, number } = body;
  const personAlreadyExist = persons.find(person => person.name === name);
  if (personAlreadyExist) {
    return response.status(409).json({ error: 'name must be unique' });
  }
  const id = findIdForPerson();
  persons = [...persons, { id, name, number }];
  response.status(201).json({ id, name, number });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});