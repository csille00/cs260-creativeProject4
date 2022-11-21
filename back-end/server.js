const express = require('express')
const bodyParse = require('body-parser')
const myMongo = require('./mongo')

const app = express()
app.use(express.static('public'))
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended:false}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
})

let teacherObjectList = []

app.get('/api/teacher', async (req, res) => {
    const listOfTeacherObjects = await myMongo.getTeacher()
    res.send(listOfTeacherObjects)
})

app.put('/api/teacher/:name/:priority', async (req, res) => {
    console.log('In update priority')
    const firstName = req.params.name
    const priority = req.params.piority
    
    
})

app.delete('/api/teacher/:name', async (req, res) => {
    console.log('In delete')
    const name = req.params.name
    try {
        await myMongo.deleteTeacher(name)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})