import { useState, useEffect } from 'react'
import axios from 'axios'
import logo from './logo.svg';
import './App.css';

function App() {
  //setup state
  const [teachers, setTeachers] = useState([])
  const [error, setError] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  
  const fetchTeachers = async() => {
    try {
      const response = await axios.get("/api/teacher")
      setTeachers(response.data)
    } catch(error) {
      setError("error retrieving teachers: " + error)
    }
  }

  const createTeacher = async() => {
    try {
      await axios.post(`/api/teacher/${firstName}/${lastName}`);
    } catch(error) {
      setError("error adding a teacher: " + error);
    }
  }

  const deleteOneTeacher = async(teacher) => {
    try {
      await axios.delete("/api/teacher/" + teacher._id)
    } catch(error) {
      setError("error deleting a ticket" + error)
    }
  }
  
  useEffect(() => {
    fetchTeachers()
  }, [])
  
  const addTeacher = async(e) => {
    e.preventDefault()
    await createTeacher()
    fetchTeachers()
    setFirstName("")
    setLastName("")
  }
  
  const deleteTeacher = async(teacher) => {
    await deleteOneTeacher(teacher)
    fetchTeachers()
  }
  
  
  // render results
  return (
    <div className="App">
      {error}
      <h1>Look up a Teacher</h1>
      <form onSubmit={addTeacher()}>
        <div>
          <label>
            First Name:
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <textarea value={lastName} onChange={e=> setLastName(e.target.value)}></textarea>
          </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
      <h1>Teachers</h1>
      {teachers.map( teacher => (
        <div key={teacher._id} className="ticket">
          <div className="problem">
            <p>{teacher.name}</p>
            <p><i>-- {teacher.avgDifficulty}</i></p>
          </div>
          <button onClick={e => deleteTeacher(teacher)}>Delete</button>
        </div>
      ))}     
    </div>
  );
}

export default App;
