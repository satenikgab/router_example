const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const usersRouter = require('./users')
const projectsRouter = require("./projects")
const tasksRouter = require("./tasks")
const port = 3001

app.use(bodyParser.json())


app.use("/users", usersRouter)
app.use("/projects", projectsRouter)
app.use("/tasks" , tasksRouter)


app.listen(port, () => {
  console.log(`Server is runing on http://localhost:${port}`)
})
