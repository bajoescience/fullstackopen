const mongoose = require('mongoose')


// Handle incorrect entry usage
const entryLength = process.argv.length
if (entryLength < 3) {
  console.log('Proper usage: node mongo.js password name number')
  console.log('or node mongo.js password')
  process.exit(1)
}

const password = process.argv[2]
const databaseName = 'phonebookApp'   
const URI = 
`mongodb+srv://Josephjoe:${password}@cluster0.0co6e.mongodb.net/${databaseName}?retryWrites=true&w=majority`

// Connect to mongoDB atlas database using URI
mongoose.connect(URI)

// Create the phonebook schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

// Declare personSchema as a mongoose database model 
const Person = mongoose.model('Person', personSchema)


if (entryLength === 3) {
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(p)
    })
    mongoose.connection.close()
  })
}
else {
  const name = process.argv[3]
  const number = process.argv[4]

  // Create new person
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
