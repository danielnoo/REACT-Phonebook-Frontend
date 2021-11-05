import React, { useState, useEffect } from 'react'
import Entry from './components/Entry'
import Notification from './components/Notification'
import Footer from './components/Footer'
import entryService from './services/entries'

const App = () => {
  const [entries, setEntries] = useState([])
  const [newEntry, setNewEntry] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    entryService
      .getAll()
      .then(initialEntries => {
      setEntries(initialEntries)
    })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newEntry,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    }

    entryService
      .create(noteObject)
        .then(returnedNote => {
        setEntries(entries.concat(returnedNote))
        setNewEntry('')
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
        `Entry '${entry.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })    
  }

  const handleEntryChange = (event) => {
    console.log(event.target.value)
    setNewEntry(event.target.value)
  }

  const entriesToShow = showAll
  ? entries
  : entries.filter(entry => entry.important)

  return (
    <div>
      <h1>Phonebook Entries</h1>
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
      <form onSubmit={addNote}>
        <input
          value={newEntry}
          onChange={handleEntryChange}
        />
        <button type="submit">save</button>
      </form>  
      <Footer />
    </div>
  )
}

export default App
