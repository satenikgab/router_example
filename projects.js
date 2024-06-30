const { error } = require('console')
const express = require('express')

const projectsRouter = express.Router()

const fs = require('fs')
const tasksRouter = require('./tasks')
const usersRouter = require('./users')
const json = require('body-parser/lib/types/json')
projectsRouter.use("/:projectId/tasks/", tasksRouter)
projectsRouter.use("/:projectId/users/", usersRouter)

const path = "projects.json"



  
  
projectsRouter.post("/", (req, res) => {
  const newProject = req.body
  const team = newProject.team

  fs.readFile("users.json", "utf-8", (err, data) => {
      if (err) {
          console.error("Users file does not exist")
          return res.status(500).send("Internal server error")
      }

      try {
          const users = JSON.parse(data)
          const userIds = users.map(user => user.userId)
          const invalidUserIds = team.filter(id => !userIds.includes(id))

          if (invalidUserIds.length > 0) {
              console.error(`Invalid user IDs: ${invalidUserIds.join(", ")}`)
              return res.status(400).send({ message: `Invalid team members: ${invalidUserIds.join(", ")}` })
          }

          fs.readFile(projectsPath, "utf-8", (err, data) => {
              if (err) {
                  console.error("Projects file does not exist");
                  return res.status(500).send("Internal server error");
              }

              let projects = []

              try {
                  projects = JSON.parse(data)
                  projects.push(newProject)

                  fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), (err) => {
                      if (err) {
                          console.error("Cannot add project")
                          return res.status(500).send("Internal server error")
                      }
                      return res.status(201).send({ message: "Project created" })
                  })
              } catch (err) {
                  console.error("Something went wrong while parsing project data")
                  return res.status(500).send("Internal server error")
              }
          })
      } catch (err) {
          console.error("Something went wrong while parsing user data")
          return res.status(500).send("Internal server error")
      }
  })
})


projectsRouter.get('/', (req, res) => {
    
    fs.readFile(path , 'utf-8' , (err , data) =>
         {
        if(err) {
            console.error("file does not exist")
            res.status(500).send("internal server error")
        }

        res.status(200).send(data)
    })
    
})

 projectsRouter.get(`/:projectId`, (req, res) => {
    const id = req.params.projectId
   
    fs.readFile(path , "utf-8" , (err , data) => {
        if(err) {
            console.error("file does not exist")
            return res.status(500).send("internal server error")
        }
        
        const projects = JSON.parse(data)
        const project = projects.find(x => x.id == id)
        

        if(!project) {
           
             console.error(`Project with ${id} does not exist`)
             return res.status(404).send({message:"Project not found"})
        }

        const teamUserIds = project.team
    
     
       fs.readFile("users.json" , "utf-8" , (err , data) => {
            if(err){
                console.error("File does not exist")
                return res.status(500).send({message:"file does not exist"})
            }
            try{

            const users = JSON.parse(data)
            const teamMembers = users.filter(user => teamUserIds.includes(user.userId))
            
            project.teamMembers = teamMembers
            
            res.send(project)
            }catch (error) {
                console.error("Error parsing users data:", error);
                return res.status(500).send({ message: "Error parsing users data" })
            }
           
          
        })
       
   
    })

})


projectsRouter.delete(`/:projectId`, (req, res) => {
    const id = req.params.projectId
    fs.readFile(path , "utf-8" , (err , data) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("internal server error")
        }
        const projects = JSON.parse(data)
       
        const newProjects = projects.filter(x => x.id != id)
        
    
    fs.writeFile(path , JSON.stringify(newProjects , null , 2) ,(err) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("Internal server error")
        }
        res.send(newProjects)
    } )

})
})

  


module.exports = projectsRouter