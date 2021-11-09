import React, { useState, useEffect } from 'react'
import Entry from './components/Entry'
import Notification from './components/Notification'
import Footer from './components/Footer'
import entryService from './services/entries'

const App = () => {
  const [entries, setEntries] = useState([])
  const [numEntry, setNumEntry] = useState('')
  const [nameEntry, setNameEntry] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [entriesToShow, setEntriesToShow] = useState([])

  useEffect(() => {
    entryService
      .getAll()
      .then(initialEntries => {
      setEntries(initialEntries)
    })
  }, [])

  const addEntry = (event) => {
    event.preventDefault()
    const entryObject = {
      name: nameEntry,
      number: numEntry,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    }

    entryService
      .create(entryObject)
        .then(returnedEntry => {
        setEntries(entries.concat(returnedEntry))
        setNumEntry('')
        setNameEntry('')
      })
        .catch(error => {
          setErrorMessage(`${error.response.data.error}`)
          console.log(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
  }

  const toggleImportanceOf = id => {
    const entry = entries.find(n => n.id === id)
    const changedEntry = { ...entry, important: !entry.important }
  
    entryService
    .update(id, changedEntry)
      .then(returnedEntry => {
      setEntries(entries.map(entry => entry.id !== id ? entry : returnedEntry))
    })
    .catch(error => {
      setErrorMessage(
        `${error.response.data.error}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })    
  }

  const handleEntryChange = (event) => {
    if(event.target.name === "name") {
      setNameEntry(event.target.value)
    } else {
      setNumEntry(event.target.value)
    }
    
  }

  useEffect(() => {
    const filterImportant = showAll
      ? entries
      : entries.filter((entry) => entry.important)

    setEntriesToShow(filterImportant)

    
  },[showAll, entries])
  

  return (
    <div>
      <h1>Phonebook Entries - wow!</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>   
      <ul>
        {entriesToShow.map(entry => 

            <Entry
              key={entry.id}
              entry={entry} 
              toggleImportance={() => toggleImportanceOf(entry.id)}
            />
        )}
      </ul>
      <form onSubmit={addEntry}>
        <input 
          name="name" 
          type="name" 
          value={nameEntry}
          onChange={handleEntryChange}/>
        <input
          name="number"
          type="number"
          value={numEntry}
          onChange={handleEntryChange}
        />
        <button type="submit">save</button>
      </form>  
      <Footer />
    </div>
  )
}

export default App
