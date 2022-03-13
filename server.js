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

// Schema - Models
const workoutSchema = new Schema ({
  description: String,
  duration: Number,
  date: String
})

const userSchema = new Schema ({
  username: String,
  count: { type: Number, default: 0 },
  log: [ workoutSchema ]
})
const User = mongoose.model('User', userSchema)


// Middleware
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

// ROUTES

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// POST new user
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
    return res.json({error: 'Cannot create user, please try again.'})
  }
})

// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await User.find({})
    return res.json(allUsers)
  } catch (err) {
    console.log(err)
    return res.json({error: 'Something went wrong, please try again.'})
  }
})

// POST workout
app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const { description, duration} = req.body
    const date = !req.body.date ? new Date().toDateString() : new Date(req.body.date).toDateString() 
    const workoutObj = {
      description,
      duration: Number(duration),
      date
    }
    const userId = req.params['_id']
    User.findByIdAndUpdate(
      userId, 
      { $push: {log: workoutObj}, $inc: {count: 1} }, 
      {new: true}, 
      (err, updatedUser) => {
        if (err) {
          console.log(err)
          return res.json({error: 'Something went wrong, please check inputs and try again.'})
        } else {
          const resObj = {
            ... workoutObj,
            username: updatedUser.username,
            _id: userId
          }
        return res.json(resObj)
        }
      }
    )
  } catch (err) {
    console.log(err)
    return res.json({error: 'Something went wrong, please try again.'})
  }
})

// GET user workout logs
app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const userId = req.params['_id']
    const { from, to, limit } = req.query
    const user = await User.findById(userId)
    let filteredLog = user.log.filter(item => {
      dateMin = !from ?  new Date(0) : new Date(from)
      dateMax = !to ? new Date(2199, 11) : new Date(to)
      return ( new Date(item.date) >= dateMin && new Date(item.date) <= dateMax)
    })
    filteredLog.sort( (item1, item2) => new Date(item1.date) - new Date(item2.date) )
    const outputLog = filteredLog.slice(filteredLog.length - limit)
    user.log = outputLog
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.json({error: 'No matching records'})
  }
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
