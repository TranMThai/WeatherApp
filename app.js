const key = "b40f5664a7767d9c5a5384721dc13d5c"

const charts = [
    {
        name: "temp_chart",
        title: "Temperature",
        icon: "fa-temperature-empty",
        id: "temp-canvas"
    },
    {
        name: "humidity_chart",
        title: "Humidity",
        icon: "fa-tint",
        id: "humidity-canvas"
    },
    {
        name: "wind_chart",
        title: "Wind",
        icon: "fa-wind",
        id: "wind-canvas"
    }
]

function dailyObject(weather, day, max, min) {
    this.weather = []
    this.day = day
    this.max = max
    this.min = min
}

function hourlyObject(weather, time, temp, humidity, wind) {
    this.weather = weather
    this.time = time
    this.temp = temp
    this.humidity = humidity
    this.wind = wind
}

getWeather ("Vietnam")

function getWeather(city) {
    (
        async () => {
            try {
                // get data weather now
                const openWeatherAPINow = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${key}`
                const responseNow = await fetch(openWeatherAPINow)
                const dataNow = await responseNow.json()

                // get data weather forecast
                const openWeatherAPIForecast = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${key}`
                const responseForecast = await fetch(openWeatherAPIForecast)
                const dataForecast = await responseForecast.json()


                refresh(dataNow, dataForecast)
            } catch (error) {
                console.log("Lỗi không gọi được API")
            }
        }
    )()
}


function refresh(dataNow, dataForecast) {
    time = getTimeInTimeZone(dataNow.timezone)

    //detail
    document.querySelector("#weather_main").textContent = dataNow.weather[0].main
    document.querySelector("#weather_icon").src = `images/${getImage(dataNow.weather[0].main)}`
    document.querySelector("#temperature").textContent = Math.floor(dataNow.main.temp) + '°'
    document.querySelector("#location").textContent = `${dataNow.name}, ${dataNow.sys.country}`


    //daily
    loadDailyHTML(getDailyWeather(time, dataForecast))

    //hourly
    let hourlyWeather = getHourlyWeather(time, dataForecast)
    const hourlyNow = new hourlyObject(dataNow.weather[0].main, time.getHours(), Math.floor(dataNow.main.temp), dataNow.main.humidity, getKilometerPerHour(dataNow.wind.speed))
    hourlyWeather.unshift(hourlyNow)
    loadHourlyHTML(hourlyWeather)

    //canvas temp
    loadCanvasTemp(hourlyWeather)

    //change background color
    changeColorBackground()
}



function loadCanvasTemp(dataHourly) {
    loadChartHTML()
    drawCanvas(dataHourly, "temp-canvas", "°")
    drawCanvas(dataHourly, "humidity-canvas", "%")
    drawCanvas(dataHourly, "wind-canvas", "km/h")
    setHour(dataHourly)
}