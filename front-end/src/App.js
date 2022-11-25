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
      console.log('In fetch Teachers')
      const response = await axios.get("/api/teacher")
      console.log(`response : ${response.data[0]}`)
      let teacherList = response.data
      teacherList.sort((a,b) => {
        return b.priority - a.priority
      })
      setTeachers(teacherList)
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
  
  const updateOneTeacher = async(teacher, priority) => {
    try {
      await axios.put("/api/teacher/" + teacher._id + "/"+ parseInt(priority))
    } catch(error) {
      setError("error updating a teacher priority");
    }
  }
  
  useEffect(() => {
    fetchTeachers()
  }, [])
  
  const addTeacher = async(e) => {
    // e.preventDefault()
    e.preventDefault();
    await createTeacher()
    fetchTeachers()
    setFirstName("")
    setLastName("")
  }
  
  const deleteTeacher = async(teacher) => {
    await deleteOneTeacher(teacher)
    fetchTeachers()
  }
  
  const updateTeacher = async(teacher, priority) => {
    await updateOneTeacher(teacher, priority);
    fetchTeachers();
  } 
  
  // render results
  return (
    <div className="App">
      {error}
      <h1>Look up a Teacher</h1>
      <form onSubmit={addTeacher}>
        <div>
          <label>
            First Name:
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input type="text" value={lastName} onChange={e=> setLastName(e.target.value)}></input>
          </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
      <h1>Teachers</h1>
      {teachers.map( teacher => (
        <div key={teacher._id} className="teacher">
          <div className='teacher-info-div'>
            <div className='teacher-name'>
              <p>{teacher.name}</p>
            </div>
            <div className="main-teacher-info-container">
              <div className="teacher-info">
                <p><i>Difficulty : {teacher.averageDifficulty}</i></p>
                <p><i>Rating : {teacher.averageRating}</i></p>
              </div>
              <div className="teacher-info">
                <p><i>Number of Ratings : {teacher.numRatings}</i></p>
                <p><i>Percentage of students that would take again : {teacher.wouldTakeAgain}</i></p>
              </div>
              <div className="teacher-info">
                <p><i>Priority {teacher.priority}</i></p>
              </div>
            </div>
          </div>
          <div className="button-div">
            <button onClick={e => deleteTeacher(teacher)}>Delete</button>
            <button onClick={e => updateTeacher(teacher, teacher.priority - 1)}>Decrease Priority</button>
            <button onClick={e => updateTeacher(teacher, teacher.priority + 1)}>Increase Priority</button>
          </div>
        </div>
      ))}     
    </div>
  );
}

export default App;
