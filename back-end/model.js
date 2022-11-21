class Teacher {
    constructor (data) {
        this.name = data.name
        this.avgDifficulty = data.avgRating
        this.avgRating = data.avgRating
        this.numRatings = data.numRatings
        this.wouldTakeAgainPercent = data.wouldTakeAgainPercent
        this.priority = data.priority
    }
    
    updatePriority(priority) {
        this.priority = priority
    }
}

class Teachers {
    constructor (teacherObjectList) {
        this.teacherObjectList = teacherObjectList  
    }
    
    addTeacher(teacherObject) {
        this.teacherObjectList.push(teacherObject)
    }
    
    removeTeacher(teacherObject) {
        for (let i = 0; i < this.teacherObjectList.length; i++) {
            if (this.teacherObjectList[i].name === teacherObject.name) {
                this.teacherObjectList.slice(i, 1)
            }
        }
    }
}