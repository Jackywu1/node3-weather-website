const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")

const app = express() 

// define paths for Express config 
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// setup handlebars engine and views location 
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath) 

// setup static directory to serve 
app.use(express.static(path.join(publicDirectoryPath)))

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather", 
        name: "Jacky Wu"
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About me", 
        name: "Jacky Wu"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        message: "This is the help page",
        title: "Help", 
        name: "Jacky Wu"
    })
})

app.get("/weather", (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: "Please provide an address"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({
                error 
            })
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({
                    error 
                })
            }

            res.send({
                forecast: forecastData, 
                location, 
                address: req.query.address 
            })
        })
    })
})

app.get("/products", (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: "Please provide a search term"
        })
    }
    
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get("/help/*", (req, res) => {
    res.render("404", {
        name: "Jacky Wu", 
        title: "404", 
        error: "Help page not found" 
    })
})

app.get("*", (req, res) => {
    res.render("404", {
        name: "Jacky Wu", 
        title: "404", 
        error: "Page not found" 
    })
})

// app.com 
// app.com/help 
// app.com/about 

app.listen(3000, () => {
    console.log("Server is up on port 3000")
})