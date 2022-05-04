const mongoose = require('mongoose')


const URI = process.env.URI

console.log('connecting to mongoDB')

// Connect to mongoDB atlas database using URI
mongoose.connect(URI)
  .then(result => {
    console.log('connected to mongoDB')
  })
  .catch(err => {
    console.log('error connecting to mongoDB', err.message)
  })

// Create the phonebook schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (val) => /\d{2,3}-\d{8}/.test(val),
      message: props => `${props.value} is not a valid phone number`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Declare personSchema as a mongoose database model 
module.exports = mongoose.model('Person', personSchema)