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

getWeather("Vietnam")

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

function getMinMax(datas) {
    let min = datas[0]
    let max = datas[0]
    for (let i = 0; i < 4; i++) {
        max = Math.max(max, datas[i])
        min = Math.min(min, datas[i])
    }
    return { min, max }
}

function drawCanvas(dataHourly, nameCanvas, symbol) {

    let datas = []
    if (nameCanvas === "temp-canvas") {
        datas = dataHourly.map(data => data.temp)
    }
    else if (nameCanvas === "humidity-canvas") {
        datas = dataHourly.map(data => data.humidity)
    }
    else {
        datas = dataHourly.map(data => data.wind)
    }

    const bool = time.getHours() >= 18 || time.getHours() <= 5

    const max_min = getMinMax(datas)
    const max = max_min.max
    const min = max_min.min

    const canvas = document.getElementById(nameCanvas)
    const difference = max - min
    const unitHeight = canvas.height / 200
    const width = canvas.width / 100
    const ctx = canvas.getContext("2d")

    ctx.beginPath()

    ctx.moveTo(0, (canvas.height - (((datas[0] - min) / (difference)) * 100 * unitHeight)) - 75 * unitHeight)

    for (let i = 0; i < 4; i++) {
        ctx.lineTo(width * 20 * (i + 1), (canvas.height - (((datas[i] - min) / (difference)) * 100 * unitHeight)) - 75 * unitHeight)
    }

    ctx.lineTo(width * 100, (canvas.height - (((datas[3] - min) / (difference)) * 100 * unitHeight)) - 75 * unitHeight)

    ctx.lineCap = "round"
    ctx.lineWidth = 4
    ctx.strokeStyle = bool?"rgb(255, 255, 255)":"rgb(100, 141, 229)"
    ctx.stroke()

    for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.arc(width * 20 * (i + 1), (canvas.height - (((datas[i] - min) / (difference)) * 100 * unitHeight)) - 75 * unitHeight, 10, 0, 2 * Math.PI)
        ctx.fillStyle = bool?"rgb(255, 255, 255)":"rgb(100, 141, 229)"
        ctx.fill()

        ctx.font = "bold 20px Arial";
        ctx.fillText(datas[i] + symbol, width * 20 * (i + 1) - (symbol === "°" ? 10 : symbol === "%" ? 15 : 30), (canvas.height - (((datas[i] - min) / (difference)) * 100 * unitHeight)) - 10 * unitHeight);
    }

}

function setHour(dataHourly) {
    for (let i = 0; i < 4; i++) {
        let docs = document.querySelectorAll(`.time-label${i}`)
        for (let doc of docs) {
            doc.textContent = dataHourly[i].time + ":00"
        }
    }
}

function getWeatherInDay(arrWeather) {

    let weathers = new Map([
        ["Clouds", 0],
        ["Clear", 0],
        ["Atmosphere", 0],
        ["Snow", 0],
        ["Rain", 0],
        ["Drizzle", 0],
        ["Thunderstorm", 0]
    ])

    for (const data of arrWeather) {
        weathers.set(data, weathers.get(data) + 1)
    }

    let weather = ''
    let max = 0

    weathers.forEach((value, key) => {
        if (max <= value) {
            max = value
            weather = key
        }
    })

    return weather
}

function getDailyWeather(time, dataForecast) {
    let timeDaiLy = []
    let arrDaily = []
    for (const data of dataForecast.list) {
        const date = new Date(data.dt_txt)
        const timeForecast = date.toDateString()
        if (!timeDaiLy.includes(timeForecast) && (date.getDate() >= time.getDate() || date.getMonth() > time.getMonth())) {
            timeDaiLy.push(timeForecast)
            if (timeDaiLy.length >= 5) {
                break;
            } else {
                arrDaily.push(new dailyObject())
            }
        }
        if (timeForecast == timeDaiLy[timeDaiLy.length - 1]) {
            if (arrDaily.length === 0) {
                arrDaily.push(new dailyObject())
            }
            else {

            }
            const index = arrDaily.length - 1

            arrDaily[index].day = timeForecast.substring(0, 3)

            arrDaily[index].weather.push(data.weather[0].main)

            if (arrDaily[index].min > data.main.temp || arrDaily[index].min === undefined) arrDaily[index].min = Math.floor(data.main.temp)

            if (arrDaily[index].max < data.main.temp || arrDaily[index].max === undefined) arrDaily[index].max = Math.floor(data.main.temp)

            continue;
        }
    }
    return arrDaily
}

function getHourlyWeather(time, dataForecast) {
    let arrHourly = []
    let i = 0
    for (const data of dataForecast.list) {
        const date = new Date(data.dt_txt)
        if (date > time) {

            const weather = data.weather[0].main
            const time = new Date(data.dt_txt).getHours()
            const temp = Math.floor(data.main.temp)
            const humidity = data.main.humidity
            const wind = getKilometerPerHour(data.wind.speed)
            arrHourly.push(new hourlyObject(weather, time, temp, humidity, wind))
            i++
        }

        if (i >= 5) break
    }
    return arrHourly
}

function getKilometerPerHour(speed) {
    const meterPerHour = speed * 60 * 60
    const kilometerPerHour = meterPerHour / 1000
    return Math.floor(kilometerPerHour)
}

function getTimeInTimeZone(offsetInSeconds) {
    const localTime = new Date();

    const offsetInMilliseconds = offsetInSeconds * 1000;

    const utcTime = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
    const targetTime = new Date(utcTime + offsetInMilliseconds);

    return targetTime;
}

function getImage(weather) {
    switch (weather) {
        case 'Thunderstorm': {
            return 'thunderstorm.png'
        }
        case 'Drizzle': {
            return 'drizzle.png'
        }
        case 'Rain': {
            return 'rain.png'
        }
        case 'Snow': {
            return 'snow.png'
        }
        case 'Clear': {
            return 'sun.png'
        }
        case 'Clouds': {
            return 'cloud.png'
        }
        default: {
            return 'atmosphere.png'
        }
    }
}
