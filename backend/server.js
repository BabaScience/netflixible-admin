const express = require('express')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const path  = require('path')
// app
const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json())
app.use(cors())



// database connection
uri = process.env.ATLAS_URI

mongoose.connect(uri)
const connection = mongoose.connection
connection.once('open', () => {
    console.log("MongoDB database connection established successfully!")
})


// Routes
const superUsersRouter = require('./routes/superusers')
const customersRouer = require('./routes/customers')
const subscriptionsRouter = require('./routes/subscriptions')
const generatorRouter = require('./routes/generator')
const accountsRouter = require('./routes/accounts')
const profileRouter = require('./routes/profiles')



app.use('/superusers', superUsersRouter)
app.use('/customers', customersRouer)
app.use('/subscriptions', subscriptionsRouter)
app.use('/generator', generatorRouter)
app.use('/accounts', accountsRouter)
app.use("/profiles", profileRouter)



// ---------------- deployment ---------------

__dirname = path.resolve()
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '/frontend/build')))


    app.get('/static/css/:file', (req, res) => {
        res.sendFile(`../frontend/build/static/css/${req.params.file}`)
    })

    app.get('/static/js/:file', (req, res) => {
        res.sendFile(`../frontend/build/static/js/${req.params.file}`)
    })

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}
else{
    app.get('/', (req, res) => {
        res.send('Hello Human! you are currently in development environmnent.')
    })
}

// ---------------- deployment ---------------



app.get('/', (req, res)=> {
    res.json('Hello World')
})


app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})
