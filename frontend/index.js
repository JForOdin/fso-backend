const express = require('express');
const morgan = require('morgan');

const app = express()
app.use(express.json());
app.use(morgan('tiny'));
morgan.token('postData', (request,response) => {
 // if (request.method == 'GET') return ' ' + JSON.stringify(request.body) + "REsponse! ",response;
  if(request.method == 'POST') return JSON.stringify(request.body);
  else return ' ';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
);

 
let contacts = 
[
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
      "name": "Mary Poppendieckk", 
      "number": "39-23-6423122"
    }
];

const getTotalContacts = () => {
  return contacts.length;
}
const personExists = (person) =>
{
  for(let contact of contacts)
  {
    if(contact.name == person.name)
    {
      return true;
    }
  }
}

app.get('/', function (req, res) {
  res.send('hello, world!');

})


app.get('/api/persons', function(req,res) {
  if(!contacts)
  {
    return response.status(400).json({ 
      error: "no contacts  exist"
    })
  }
  res.send(contacts);
});


app.get('/info',function(req,res)  {
 // console.log("Blah"+new Date());
  res.send("phonebook has info for "+getTotalContacts()+" total contacts"+"</br>"+" "+new Date());
});
app.get('/api/persons/:id',(request,response) =>{
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  if(!contact)
  {
    return response.status(400).json({ 
      error: "contact does not exist"
    });
  }
  response.json(contact);
});
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)
  response.status(204).end()
});
const generateId = () => Math.floor(Math.random()*32000);
app.post('/api/persons',(request,response) => {
  const person = request.body
  //console.log(person)
  if (!person.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })  
  }
  if (!person.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  if(personExists(person))
  {
    return response.status(400).json({ 
      error: 'contact already exists' 
    })
  }
  const contact = {
    id: generateId(),
    name: person.name,
    number: person.number
  }

  contacts = contacts.concat(contact)
  response.json(contact)
  
});

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`);
