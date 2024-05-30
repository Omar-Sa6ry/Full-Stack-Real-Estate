const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const dotenv = require('dotenv').config() // To env
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dbConnect = require('./config/dbConnect')
const authRoute = require('./routes/authRoute')
const estateRoute = require('./routes/listingRoute')
const httpStatusText = require('./utils/httpStatusText')

const app = express()
const PORT = process.env.PORT || 4000
const _dirname = path.resolve()

dbConnect() // Database connection

// middlewales
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  })
)

// Routes
app.use('/api/user', authRoute)
app.use('/api/estate', estateRoute)
app.use(express.static(path.join(_dirname, '/client/dist')))

// Global middleware for not found router
app.use('*', (req, res, next) => {
  res.sendFile(path.join(_dirname, 'client', 'dist', 'index.html'))
  return res.status(404).json({
    status: httpStatusText.ERROR,
    message: 'This resource is not available'
  })
})

// Global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500
  })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
