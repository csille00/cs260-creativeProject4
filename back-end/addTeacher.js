const axios = require("axios");

const teacherList = [{firstName: 'brett', lastName: 'decker'},
 {firstName: 'michael', lastName: 'goodrich'},
 {firstName: 'randy', lastName: 'skinner'},
 {firstName: 'matt', lastName: 'hill'},
 {firstName: 'Matt', lastName: 'dinger'},
 {firstName: 'paul', lastName: 'thomas'},
 {firstName: 'thomas', lastName: 'bell'},
 {firstName: 'eva', lastName: 'clark'},
 {firstName: 'john', lastName: 'clark'},
 {firstName: 'philip', lastName: 'brown'},
 {firstName: 'christian', lastName: 'smith'},
 {firstName: 'hank', lastName: 'smith'},
 {firstName: 'ray', lastName: 'smith'},
 {firstName: 'Ross', lastName: 'white'},
 {firstName: 'mark', lastName: 'white'},
 {firstName: 'Kent', lastName: 'hunter'},
 {firstName: 'brad', lastName: 'wilcox'}]

function addTeacher(teacher){

    var config = {
      method: 'get',
      url: `http://ec2-3-101-150-1.us-west-1.compute.amazonaws.com:8080/routes/name?first=${teacher.firstName}&last=${teacher.lastName}`,
      headers: { }
    };
    
    axios(config)
    .then(function (response) {
        
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    
}

function callAllTeachers(){
    for (const teacher of teacherList ){
        addTeacher(teacher);
    }
}

// addTeacher(teacherList[0])
callAllTeachers()
module.exports = addTeacher;
