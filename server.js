const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { Schema } = mongoose

// Connect DB
const connectDB = (url) => {
  return mongoose.connect(url)
}

// Schema
const userSchema = new Schema ({
  username: String,
})
const User = mongoose.model('User', userSchema)

// Middleware
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  try {
    const userObj = {
      username: req.body.username
    }
    const newUser = new User(userObj)
    await newUser.save()
    return res.json(newUser)
  } catch (err) {
    console.log(err)
    return res.json({err: 'Cannot create user, please try again later.'})
  }
})

app.get('/api/users', (req, res) => {
  res.send('Get all users')
})

app.post('/api/users/:_id/exercises', (req, res) => {
  res.send('Post user workout')
})

app.get('/api/users/:_id/logs', (req, res) => {
  res.send('Get user workout logs')
})


// Basic Configuration
const port = process.env.PORT || 3000

// Run App
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => 
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (err) {
    console.log(err)
  }
}

start()
