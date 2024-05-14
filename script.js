const key = "b40f5664a7767d9c5a5384721dc13d5c"

let cityName = "Ha Noi"
let country = "VN"
let weatherMain = "Clear"
let currentTemp = 0
let feelTemp = 0
let humidity = 0
let windSpeed = 0
let timezone = 0

let weatherNow = document.querySelector("#weather_main")
let weatherIconNow = document.querySelector("#weather_icon")
let temperatureNow = document.querySelector("#temperature")
let locationNow = document.querySelector("#location")


function getWeather(city) {

    const openWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${key}`

    fetch(openWeatherAPI)
        .then(response => response.json())
        .then(data => {
            weatherMain = data.weather[0].main
            cityName = data.name
            country = data.sys.country
            currentTemp = data.main.temp
            feelTemp = data.main.feels_like
            humidity = data.main.humidity
            windSpeed = data.wind.speed
            timezone = data.timezone
            
            console.log(data)

            refresh()
        })
        .catch(err=>{
            console.log(err)
        })
}


function refresh(){
    //detail
    weatherNow.textContent = weatherMain
    weatherIconNow.src = `icon/${getIcon(weatherMain)}`
    temperatureNow.textContent = currentTemp+'°'
    locationNow.textContent = `${cityName}, ${country}`


    //daily

}


function getIcon(weather){
    switch(weather){
        case 'Thunderstorm':{
            return 'thunderstorm.png'
        }
        case 'Drizzle':{
            return 'drizzle.png'
        }
        case 'Rain':{
            return 'rain.png'
        }
        case 'Snow':{
            return 'snow.png'
        }
        case 'Atmosphere':{
            return 'atmosphere.png'
        }
        case 'Clear':{
            return 'sun.png'
        }
        case 'Clouds':{
            return 'cloud.png'
        }
    }
}

getWeather("ha noi")