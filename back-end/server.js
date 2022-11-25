const express = require('express')
const bodyParser = require('body-parser')
const ratings = require('@mtucourses/rate-my-professors').default
const mongoose = require("mongoose");
const { stringify } = require("querystring");

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()    
})

let teacherObjectList = []

app.get('/api/teacher', async (req, res) => {
    console.log('In get teacher')
    const listOfTeacherObjects = await getTeacher()
    res.send(listOfTeacherObjects)
})

app.post('/api/teacher/:firstName/:lastName', async (req, res) => {
    console.log('In post teacher')
    try {
        const firstName = req.params.firstName
        const lastName = req.params.lastName
        const name = `${firstName} ${lastName}`
        const data = await getProfessorData(name)
        data.priority = 0
        data.name = name
        addTeacher(data)
        res.sendStatus(200)
    } catch {
        console.log('Unable to add teacher')
        res.sendStatus(400)
    }
})

app.put('/api/teacher/:id/:priority', async (req, res) => {
    console.log('In update priority')
    try {
        const id = req.params.id
        const priority = req.params.priority
        await updateTeacher(id, priority)
        res.sendStatus(200)
    } catch {
        console.log('Unable to update teacher data')
        res.sendStatus(400)
    }
})

app.delete('/api/teacher/:id', async (req, res) => {
    console.log('In delete')
    const id = req.params.id
    try {
        await deleteTeacher(id)
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

// app.get('/api/teacher/:firstName/:lastName', async (req, res) => {
//     console.log('In RMP API call')
//     const firstName = req.params.firstName
//     const lastName = req.params.lastName
//     const name = `${firstName} ${lastName}`
//     await getProfessorData(name)
// })


//MONGO DATABASE CALLS 

mongoose.connect('mongodb://localhost:27017/teacher', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const teacherSchema = mongoose.Schema({
    name: String,
    averageDifficulty: Number,
    averageRating: Number,
    numRatings: Number,
    wouldTakeAgain: Number,
    priority: Number
})
const teacherModel = mongoose.model('Teacher', teacherSchema)

async function addTeacher(data) {
    const newTeacher = new teacherModel({
        name: data.name,
        averageDifficulty: data.avgDifficulty,
        averageRating: data.avgRating,
        numRatings: data.numRatings,
        wouldTakeAgain: data.wouldTakeAgainPercent,
        priority: data.priority
    })

    await newTeacher.save();

}

async function deleteTeacher(id) {
    await teacherModel.deleteOne({
        _id: id
    })
}

async function updateTeacher(id, priority) {
    const mypriority = parseInt(priority)
    await teacherModel.updateOne({ _id:id }, { $set: {priority: mypriority}})
}

async function getTeacher(){
    let teachers = await teacherModel.find();
    console.log(teachers)
    return teachers
}


//RMP API call
async function getProfessorData(name) {
    const teacher = await ratings.searchTeacher(name, 'U2Nob29sLTEzNQ==')
    if (teacher.length === 0) {
        return {'response': 'No available data for that name'}
    }
    else {
        const teacherInfo = await ratings.getTeacher(teacher[0].id)
        return {avgRating: teacherInfo.avgRating, avgDifficulty: teacherInfo.avgDifficulty, numRatings: teacherInfo.numRatings, wouldTakeAgainPercent: teacherInfo.wouldTakeAgainPercent}
    }
}

app.listen(3000, () => console.log('Server listening on port 3000!'));