const mongoose = require("mongoose");
const { stringify } = require("querystring");

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

module.exports = getTeacher
module.exports = addTeacher