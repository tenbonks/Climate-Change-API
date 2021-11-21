const PORT = 8000   //Define what port is to be used, can be any, I chose 8000 due to tutorial

// define the packages in code that are within the dependincies of package.json
const express = require("express")  //Web framework
const axios = require("axios")  //Promise based HTTP client
const cheerio = require("cheerio")  //Jquery syntax for the server
const { response } = require("express")

//Start a new express application, in the app variable
const app = express()

const articles = []

// in the browser, if you type url "localhost:8000", you will see "Welcome to the climate change API"
//if the route was '/homepage', then you would need to type "localhost:8000/homepage" to see the same message
app.get('/', (req,res) => {
    res.json("Welcome to the climate change API")
})

// if '/news', use axios to get html of the passed website and store the data, pass the html into cheerio to scrape the data
app.get('/news', (req,res) => {
    axios.get('https://www.theguardian.com/environment/climate-crisis')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            //Find any a tag which contains the work "climate" in it 
            $('a:contains("climate")', html).each(function () {
                //Save this instances title, and url, and push it to the articles list
                const title = $(this).text()
                const url = $(this).attr("href")
                articles.push({
                    title,
                    url
                })
            })

            //Respond with the articles in json format
            res.json(articles)
        }).catch((err) => console.log(err))
})

//Get the port up and running
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))