const key = "b40f5664a7767d9c5a5384721dc13d5c"

let weatherNow = document.querySelector("#weather_main")
let weatherIconNow = document.querySelector("#weather_icon")
let temperatureNow = document.querySelector("#temperature")
let locationNow = document.querySelector("#location")

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
    const time = getTimeInTimeZone(dataNow.timezone)

    //detail
    weatherNow.textContent = dataNow.weather[0].main
    weatherIconNow.src = `icon/${getIcon(dataNow.weather[0].main)}`
    temperatureNow.textContent = Math.round(dataNow.main.temp) + '°'
    locationNow.textContent = `${dataNow.name}, ${dataNow.sys.country}`


    //daily
    refreshDailyHTML(getDailyWeather(time, dataForecast))

    //hourly
    let hourlyWeather = getHourlyWeather(time, dataForecast)
    const hourlyNow = new hourlyObject(dataNow.weather[0].main, "Now", Math.round(dataNow.main.temp), dataNow.main.humidity, getKilometerPerHour(dataNow.wind.speed))
    hourlyWeather.unshift(hourlyNow)
    refreshHourlyHTML(hourlyWeather)

    //canvas temp
    refreshCanvasTemp(hourlyWeather)
}

function refreshDailyHTML(data) {
    let html = ``
    for (const i in data) {
        html += `
        <div class="col-3">
            <div class="row justify-content-center align-items-center my-3 mx-3 rounded-3 ${i == 0 ? 'today' : ''}">
                <div class="col-5 d-flex justify-content-center align-items-center">
                    <img src="icon/${getIcon(getWeatherInDay(data[i].weather))}" alt="" height="60px">
                </div>
                <div class="col-7">
                    <p class="text-background name-daily">${i == 0 ? 'Today' : data[i].day + '.'}</p>
                        <span class="max_temp_daily text-background me-2">${data[i].max}°</span>
                        <span class="min_temp_daily text-background">${data[i].min}°</span>
                </div>
            </div>
        </div>
        `
    }
    document.querySelector(".daily_nav").innerHTML = html
}

function refreshHourlyHTML(dataHourly) {
    let html = ``
    for (const data of dataHourly) {
        html += `
        <div class="col-2">
            <div class="bg-white py-2 rounded-4 hourly_now">
                <p class="text-background py-2 m-0" style="font-size: 23px; text-align: center;">${data.time}</p>
                <div class="d-flex justify-content-center">
                    <img src="icon/${getIcon(data.weather)}" alt="" width="60px">
                </div>
                <p class="text-background py-2 m-0 fw-bold" style="font-size: 22px; text-align: center;">${data.temp}°</p>
            </div>
        </div>
        `
    }
    document.querySelector(".hourly_nav").innerHTML = html
}

function refreshCanvasTemp(dataHourly) {
    drawCanvasTemp(dataHourly)
    setHour(dataHourly)
}

function getMinMax(datas) {
    let min = datas[0].temp
    let max = datas[0].temp
    for (let i = 0; i < 4; i++) {
        max = Math.max(max, datas[i].temp)
        min = Math.min(min, datas[i].temp)
    }
    return { min, max }
}

function drawCanvasTemp(dataHourly) {

    const max_min = getMinMax(dataHourly)
    const max = max_min.max
    const min = max_min.min

    const canvas = document.getElementById("temp-canvas")
    const difference = max - min
    const unitHeight = canvas.height / 150
    const width = canvas.width / 100
    const ctx = canvas.getContext("2d")


    ctx.beginPath()

    ctx.moveTo(0,(canvas.height - (((dataHourly[0].temp - min) / (difference)) * 100 * unitHeight))-30)

    for (let i = 0; i < 4; i++) {
        ctx.lineTo(width * 20 * (i + 1),(canvas.height - (((dataHourly[i].temp - min) / (difference)) * 100 * unitHeight))-30)
    }

    ctx.lineTo(width * 100, (canvas.height - (((dataHourly[3].temp - min) / (difference)) * 100 * unitHeight))-30)

    ctx.lineCap = "round"
    ctx.lineWidth = 4
    ctx.strokeStyle = "rgb(100, 141, 229)"
    ctx.stroke()


    for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.arc(width * 20 * (i + 1),(canvas.height - (((dataHourly[i].temp - min) / (difference)) * 100 * unitHeight))-30, 10, 0, 2 * Math.PI)
        ctx.fillStyle = "rgb(100, 141, 229)"
        ctx.fill()
    }

}

function setHour(dataHourly) {
    for (let i = 0; i < 4; i++) {
        let docs = document.querySelectorAll(`.time-label${i}`)
        for (let doc of docs) {
            doc.textContent = dataHourly[i].time
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

            if (arrDaily[index].min > data.main.temp || arrDaily[index].min === undefined) arrDaily[index].min = Math.round(data.main.temp)

            if (arrDaily[index].max < data.main.temp || arrDaily[index].max === undefined) arrDaily[index].max = Math.round(data.main.temp)

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
            const time = `${new Date(data.dt_txt).getHours()}:00`
            const temp = Math.round(data.main.temp)
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
    return Math.round(kilometerPerHour)
}

function getTimeInTimeZone(offsetInSeconds) {
    const localTime = new Date();

    const offsetInMilliseconds = offsetInSeconds * 1000;

    const utcTime = localTime.getTime() + (localTime.getTimezoneOffset() * 60000);
    const targetTime = new Date(utcTime + offsetInMilliseconds);

    return targetTime;
}

function getIcon(weather) {
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
        case 'Atmosphere': {
            return 'atmosphere.png'
        }
        case 'Clear': {
            return 'sun.png'
        }
        case 'Clouds': {
            return 'cloud.png'
        }
    }
}

getWeather("Ha Noi")

