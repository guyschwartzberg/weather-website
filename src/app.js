const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather', 
        name: 'Guy Schwartzberg'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Guy Schwartzberg'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Guy Schwartzberg',
        message: 'Help I am stuck!',
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address!"
        })
    }
    
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {

        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecast) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "404",
        errorMessage: "Help Article not found",
        name: 'Guy Schwartzberg'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        errorMessage: "Page not found",
        name: "Guy Schwartzberg"
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${ port }.`)
})