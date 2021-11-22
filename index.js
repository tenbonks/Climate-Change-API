const PORT = 8000   //Define what port is to be used, can be any, I chose 8000 due to tutorial

// define the packages in code that are within the dependincies of package.json
const express = require("express")  //Web framework
const axios = require("axios")  //Promise based HTTP client
const cheerio = require("cheerio")  //Jquery syntax for the server
const { response } = require("express")

//Start a new express application, in the app variable
const app = express()

const articles = []

//A collection of newspapers that are going to be scraped, base is used for when the base url is omitted from the address
// do not add a base randomly, as it is only needed for certain newspapers
const newspapers = [
    {
        name: "thetimes",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: ""
    },
    {
        name: "theguardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: ""
    },
    //Note the numbers on the end of the url below, these may change and cause issues
    {
        name: "bbc",
        address: "https://www.bbc.co.uk/news/science-environment-56837908",
        base: "https://www.bbc.co.uk"
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change/",
        base: "https://www.telegraph.co.uk"
    },
    {
        name: "climatechangenews",
        address: "https://www.climatechangenews.com/",
        base: ""
    }
]

// for each newspaper, axios will go to each newspaper and grab the html, cheerio will be loaded with the html
// and all the a tags which contain "climate" will be grabbed, along with the address (url) will be added to the list of articles
// this is then displayed as json when the user requests this endpoint
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            //Find any a tag which contains the work "climate" in it 
            $('a:contains("climate")', html).each(function () {
                //Save this instances title, and url, and push it to the articles list, listed with the name as the source
                const title = $(this).text()
                const url = $(this).attr("href")
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        // Catch errors and log them
        }).catch((err) => console.log(err))
})


// in the browser, if you type url "localhost:8000", you will see "Welcome to the climate change API"
//if the route was '/homepage', then you would need to type "localhost:8000/homepage" to see the same message
app.get('/', (req,res) => {
    res.json("Welcome to the climate change API")
})

// if '/news', use axios to get html of the passed website and store the data, pass the html into cheerio to scrape the data
app.get('/news', (req,res) => {
    //Respond with the articles in json format
    res.json(articles)
})

//Get the port up and running
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))