const { error } = require('console');
const express = require('express');

const usersRouter = express.Router();
const fs = require('fs');

const path = "users.json"


usersRouter.post("/", (req, res) => {
    let newUser = req.body
  
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        console.error("File does not exit")
        return res.status(500).send("Internal server error")
      }
      let users = []
  
      try {
          
        users = JSON.parse(data)
        users.push(newUser)
  
        fs.writeFile(path, JSON.stringify(users, null, 2), (err) => {
          if (err) {
            console.error("Cannot add user")
            return res.status(500).send("Internal server error")
          }
          return res.status(201).send({ message: "User created" })
        })
      } catch (err) {
        console.error("Something went wrong while parsing data")
      }
    })
  })

usersRouter.get("/", (req, res) => {
    fs.readFile(path , "utf-8" , (err , data) => {
        if(err) {
            console.error("file does not exist")
            res.status(500).send("internal server error")
        }
        res.status(200).send(data)
    })
    
})

usersRouter.put(`/:userId`, (req, res) => {
    const id = req.params.userId
    fs.readFile(path, "utf-8" , (err , data) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("internal server error")
        } 
        try{
        
        const users = JSON.parse(data)
        const index = users.findIndex(x => x.userId == id)

        if(index == -1){
            console.error("User not found")
            return res.status(404).send("User not found")
        }
        users[index] = {...users[index] , ...req.body}
        
    
    fs.writeFile(path , JSON.stringify(users , null , 2) ,(err) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("Internal server error")
        }
        res.send(users[index])
    } )
    }catch (err) {
           console.error('Something went wrong while parsing data');
  }

})
})


usersRouter.get(`/:userId`, (req, res) => {
    const id = req.params.userId
    
    fs.readFile(path , "utf-8" , (err , data) => {
        if(err) {
            console.error("file does not exist")
            return res.status(500).send("internal server error")
        }
        
        const users = JSON.parse(data)
        
        const user = users.find(x => x.userId == id)
      
        if(!user) {
           
             console.error(`User with ${id} does not exist`)
             return res.status(404).send({message:"User not found"})
        }
        res.status(200).send(user)
        
    })
   
})

usersRouter.delete(`/:userId`, (req, res) => {
    const id = req.params.userId
    fs.readFile(path , "utf-8" , (err , data) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("internal server error")
        }
        const users = JSON.parse(data)
       
        const newUsers = users.filter(x => x.userId != id)
        
    
    fs.writeFile(path , JSON.stringify(newUsers , null , 2) ,(err) => {
        if(err){
            console.error("File does not exist")
            return res.status(500).send("Internal server error")
        }
        res.send(newUsers)
    } )

})
})

module.exports = usersRouter
