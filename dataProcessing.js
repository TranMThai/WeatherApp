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
            const time = new Date(data.dt_txt).getHours()
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

function getMinMax(datas) {
    let min = datas[0]
    let max = datas[0]
    for (let i = 0; i < 4; i++) {
        max = Math.max(max, datas[i])
        min = Math.min(min, datas[i])
    }
    return { min, max }
}

function setHour(dataHourly) {
    for (let i = 0; i < 4; i++) {
        let docs = document.querySelectorAll(`.time-label${i}`)
        for (let doc of docs) {
            doc.textContent = i==0?"Now":dataHourly[i].time + ":00"
        }
    }
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
