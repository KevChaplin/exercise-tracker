const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

// Routes

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  console.log(req.body)
  res.send('Post new user')
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







const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
