const express = require('express')
const bodyParse = require('body-parser')
const myMongo = require('./mongo')
const ratings = require('@mtucourses/rate-my-professors').default
const mongoose = require("mongoose");
const { stringify } = require("querystring");

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

app.get('/api/teacher/:firstName/:lastName', async (req, res) => {
    console.log('In RMP API call')
    const firstName = req.params.firstName
    const lastName = req.params.lastName
    const name = `${firstName} ${lastName}`
    await getProfessorData(name)

})


//MONGO DATABASE CALLS 

//TODO: mongoose.connect

const teacherSchema = mongoose.schema({
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
        averageDifficulty: data.averageDifficulty,
        averageRating: data.averageRating,
        numRatings: data.numRatings,
        wouldTakeAgain: data.wouldTakeAgain,
        priority: data.priority
    })

    await newTeacher.save();

}

async function deleteTeacher(nameToDelete) {
    await teacherModel.deleteOne({
        name: nameToDelete
    })
}

async function getTeacher(){
    let teachers = await teacherModel.find();
    console.log(teachers)
    return teachers
}


//RMP API call
getProfessorData = async function getProfessorData(name) {
    const teacher = await ratings.searchTeacher(name, 'U2Nob29sLTEzNQ==')
    if (teacher.length === 0) {
        return {'response': 'No available data for that name'}
    }
    else {
        const teacherInfo = await ratings.getTeacher(teacher[0].id)
        return {avgRating: teacherInfo.avgRating, avgDifficulty: teacherInfo.avgDifficulty, numRatings: teacherInfo.numRatings, wouldTakeAgainPercent: teacherInfo.wouldTakeAgainPercent}
    }
}