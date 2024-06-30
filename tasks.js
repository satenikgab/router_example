const { error } = require('console')
const express = require('express')

const tasksRouter = express.Router()
const fs = require('fs')

const path = "tasks.json"

tasksRouter.post("/", (req, res) => {
    const newTask = req.body
    const userName = newTask.assignee

    
    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            console.error("Users file does not exist")
            return res.status(500).send("Internal server error")
        }

        try {
            const users = JSON.parse(data)
            const userExists = users.some(user => user.name == userName)

            if (!userExists) {
                console.error(`User with name ${userName} does not exist`)
                return res.status(400).send({ message: "Assignee does not exist" })
            }

            
            fs.readFile("tasks.json", "utf-8", (err, data) => {
                if (err) {
                    console.error("Tasks file does not exist")
                    return res.status(500).send("Internal server error")
                }

                let tasks = []

                try {
                    tasks = JSON.parse(data)
                    tasks.push(newTask)

                    fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2), (err) => {
                        if (err) {
                            console.error("Cannot add task")
                            return res.status(500).send('Internal server error')
                        }
                        return res.status(201).send({ message: "Task created" })
                    })
                } catch (err) {
                    console.error("Something went wrong while parsing task data")
                    return res.status(500).send('Internal server error')
                }
            })
        } catch (err) {
            console.error("Something went wrong while parsing user data")
            return res.status(500).send('Internal server error')
        }
    })
})



tasksRouter.get('/', (req, res) => {
    fs.readFile(path , 'utf-8' , (err , data) => {
        if(err) {
            console.error("file does not exist")
            res.status(500).send("internal server error")
        }
        res.status(200).send(data)
    })
    
})

tasksRouter.put(`/:taskId`, (req, res) => {
    const id = req.params.taskId
    fs.readFile(path, "utf-8" , (err , data) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("internal server error")
        }
        const tasks = JSON.parse(data)
        const index = tasks.findIndex(x => x.id == id)

        if(index == -1){
            console.error("Task not found")
            return res.status(404).send("Task not found")
        }
        tasks[index] = {...tasks[index] , ...req.body}
        
    
    fs.writeFile(path , JSON.stringify(tasks , null , 2) ,(err) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("Internal server error")
        }
        res.send(tasks[index])
    } )

})
})


tasksRouter.get(`/:taskId`, (req, res) => {
    const id = req.params.taskId
    fs.readFile(path , "utf-8" , (err , data) => {
        if(err) {
            console.error("file does not exist")
            return res.status(500).send("internal server error")
        }
        const tasks = JSON.parse(data)
        const task = tasks.find(x => x.id == id)
        

        if(!task) {
           
             console.error(`Task with ${id} does not exist`)
             return res.status(404).send({message:"Task not found"})
        }
        res.send(task)
       
    })

})


tasksRouter.delete(`/:taskId`, (req, res) => {
    const id = req.params.taskId
    fs.readFile(path , "utf-8" , (err , data) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("internal server error")
        }
        const tasks = JSON.parse(data)
       
        const newTasks = tasks.filter(x => x.id != id)
        
    
    fs.writeFile(path , JSON.stringify(newTasks , null , 2) ,(err) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("Internal server error")
        }
        res.send(newTasks)
    } )

})
})

module.exports = tasksRouter
