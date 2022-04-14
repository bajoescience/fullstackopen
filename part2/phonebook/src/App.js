import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ search, onChange }) => <>filter shown with <input value={search} onChange={onChange} /></>


const Person = ({ person }) => <p>{person.name} {person.number}</p>


const Persons = ({ searchResults }) => searchResults.map(person => <Person key={person.name} person={person} />)

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

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
    .get('http://localhost:3001/persons')
    .then(res => {
      setPersons(res.data)
      console.log('set')
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
    if (isDuplicate(personObject) === true) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat(personObject))
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
      <h2>Phonebook</h2>
      <Filter search={search} onChange={handleFilter} />

      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber}
      onNameChange={handleNameChange} onNumberChange={handleNumberChange} />

      <h3>Numbers</h3>
      <Persons searchResults={searchResults} />
    </div>
  )
}

export default App