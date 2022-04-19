import { useState, useEffect } from 'react'
import phoneService from './services/persons'
import './index.css'

const Filter = ({ search, onChange }) => <>filter shown with <input value={search} onChange={onChange} /></>


const Person = ({ person, deleteResource }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={deleteResource}>delete</button>
    </p>
  )
}


const Persons = ({ searchResults, setPersons, persons, setMessageBool, setTheMessage }) => {

  // Delete resource from database
  const deleteResourceOf = (id, name) => {
    const message = `Delete ${name} ?`
    if (window.confirm(message)) {
      const resource = searchResults.find(person => person.id === id)
      phoneService
      .remove(id, resource)
      .then(ret => {
        setPersons(persons.filter(person => person.id !== id))
        const message = `${name} has been succesfully deleted`
        setTheMessage(message)
        setMessageBool(true)
        setTimeout(() => {
          setTheMessage(null)
        }, 2000)
      })
      .catch(err => {
        const message = `Information of ${name} has been removed from server`
        setTheMessage(message)
        setMessageBool(false)
        setTimeout(() => {
          setTheMessage(null)
        }, 2000)
      })
    }
  }
  return (
    <>
      {searchResults.map(person => <Person key={person.name} person={person} deleteResource={() => {deleteResourceOf(person.id, person.name)}} />)}
    </>
  )
}

const PersonForm = ({onSubmit, onNameChange, onNumberChange, newName, newNumber}) => (
  <>
    <form onSubmit={onSubmit}>
      <div>name: <input value={newName} onChange={onNameChange} /></div>
      <div>number: <input value={newNumber} onChange={onNumberChange} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>
)

const Message = ({ message, messageBool }) => {
  if (message === null) {
    return null
  }

  if (messageBool) {
    return (
      <div className='success'>
        {message}
      </div>
    )
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [theMessage, setTheMessage] = useState(null)
  const [messageBool, setMessageBool] = useState(true)

  useEffect(() => {
    phoneService
    .getAll()
    .then(resource => {
      setPersons(resource)
    })
  }, [])

  const handleFilter = (event) => {
    const filter = event.target.value

    // Check for objects whose name property math that of the filter
    setSearch(filter)
  }

  const searchResults = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
  
  const isDuplicate = (person) => {
    // Keeps track if function is duplicate
    let catches = false
    persons.forEach(human => {
      if (person.name === human.name) {
        catches = true
      }
    })
    return catches
  }

  // handle creation of a new person
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    console.log(personObject.id)
    if (isDuplicate(personObject) === true) {
      const message = `${newName} is already added to phonebook, replace the old number with a new one`
      if (window.confirm(message)) {
        const person = persons.find(p => p.name === newName)
        const updatedPerson = {...person, number: newNumber}
        phoneService
        .update(updatedPerson.id, updatedPerson)
        .then(resource => {
          console.log(resource);
          setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
          let send = `${newName} has been succesfully updated`
          setTheMessage(send)
          setMessageBool(true)
          setTimeout(() => {
            setTheMessage(null)
          }, 2000)
        }) 
        .catch(err => {
          let send = `could not update ${newName}`
          setTheMessage(send)
          setMessageBool(false)
          setTimeout(() => {
            setTheMessage(null)
          }, 2000)
        })
      }
    }
    else {
      phoneService
      .create(personObject)
      .then(resource => {
        setTheMessage(`Added ${newName}`)
        setMessageBool(true)
        setTimeout(() => {
          setTheMessage(null)
        }, 2000)
        setPersons(persons.concat(resource))
      })
      .catch(err => {
        const message = `error adding ${newName} to phonebook`
        setTheMessage(message)
        setMessageBool(false)
        setTimeout(() => {
          setTheMessage(null)
        }, 2000)
      })
    }
    // Reset input field to empty field
    setNewName('')
    setNewNumber('')
  }

  // Handle change of input field
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <Message message={theMessage} messageBool={messageBool} />
      <h2>Phonebook</h2>
      <Filter search={search} onChange={handleFilter} />

      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber}
      onNameChange={handleNameChange} onNumberChange={handleNumberChange}
      setMessageBool={setMessageBool} setTheMessage={setTheMessage} />

      <h3>Numbers</h3>
      <Persons searchResults={searchResults} setPersons={setPersons} persons={persons} 
      setMessageBool={setMessageBool} setTheMessage={setTheMessage} />
    </div>
  )
}

export default App