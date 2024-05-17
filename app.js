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
let lat;
let lon;

function resolveLocation(position) {
    getWeather(position)
}

navigator.geolocation.getCurrentPosition(resolveLocation)

function getWeather(position) {
    (
        async () => {
            try {
                // get data weather now
                let openWeatherAPINow = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${position}&appid=${key}`
                if(typeof position === "object"){
                    openWeatherAPINow = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}`
                }
                const responseNow = await fetch(openWeatherAPINow)
                const dataNow = await responseNow.json()

                // get data weather forecast
                let openWeatherAPIForecast = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${position}&appid=${key}`
                if(typeof position === "object"){
                    openWeatherAPIForecast = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}`
                }
                const responseForecast = await fetch(openWeatherAPIForecast)
                const dataForecast = await responseForecast.json()

                // refresh
                refresh(dataNow, dataForecast)
            } catch (error) {
                console.log("Lỗi không gọi được API")
                console.log(error)
            }
        }
    )()
}


function refresh(dataNow, dataForecast) {
    time = getTimeInTimeZone(dataNow.timezone)

    //detail
    loadDetail(dataNow)

    //daily
    const dataDailyWeather = getDailyWeather(time, dataForecast)
    loadDailyHTML(dataDailyWeather)

    //hourly
    let hourlyWeather = getHourlyWeather(time, dataForecast)
    const hourlyNow = new hourlyObject(dataNow.weather[0].main, time.getHours(), Math.floor(dataNow.main.temp), dataNow.main.humidity, getKilometerPerHour(dataNow.wind.speed))
    hourlyWeather.unshift(hourlyNow)
    loadHourlyHTML(hourlyWeather)

    //canvas temp
    loadCanvasTemp(hourlyWeather)

    //message
    loadMessage(dataDailyWeather)

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