function loadDetail(data, time) {
    let html = `
    <span class="row align-items-center">
        <div class="col-6">
            <img src="images/${getImage(data.weather[0].main,time)}" alt="" height="120px" id="weather_icon">
        </div>
        <div class="col-6">
            <p id="weather_main" class="text-white">${data.weather[0].main}</p>
            <p id="temperature" class="text-white">${Math.round(data.main.temp)}°</p>
            <p id="location">${data.name}, ${data.sys.country}</p>
        </div>
    </span>
    `
    document.querySelector(".detail").innerHTML = html
}

function loadDailyHTML(data) {
    const bool = time.getHours() >= 18 || time.getHours() <= 5

    let html = ``
    for (const i in data) {
        html += `
        <div class="col-3 ${bool ? "text-white" : "text-background"}">
            <div class="row justify-content-center align-items-center my-3 mx-3 rounded-3 ${i == 0 ? (bool ? "today-dark" : "today-light") : ''}">
                <div class="col-5 d-flex justify-content-center align-items-center">
                    <img src="images/${getImage(getWeatherInDay(data[i].weather))}" alt="" height="60px">
                </div>
                <div class="col-7">
                    <p class="text-inherit name-daily">${i == 0 ? 'Today' : data[i].day + '.'}</p>
                        <span class="max_temp_daily text-inherit me-2">${data[i].max}°</span>
                        <span class="min_temp_daily text-inherit">${data[i].min}°</span>
                </div>
            </div>
        </div>
        `
    }
    document.querySelector(".daily_nav").innerHTML = html
}

function loadHourlyHTML(data) {
    let html = ``
    for (const i in data) {
        html += `
        <div class="col-2 ${data[i].time >= 18 || data[i].time <= 5 ? "text-white" : "text-background"}">
            <div class="${data[i].time >= 18 || data[i].time <= 5 ? "bg-background-dark" : "bg-white"} py-2 rounded-4 hourly_now">
                <p class="text-inherit py-2 m-0" style="font-size: 23px; text-align: center;">${i != 0 ? data[i].time + ":00" : "Now"}</p>
                <div class="d-flex justify-content-center">
                    <img src="images/${getImage(data[i].weather,data[i].time)}" alt="" width="60px">
                </div>
                <p class="text-inherit py-2 m-0 fw-bold" style="font-size: 22px; text-align: center;">${data[i].temp}°</p>
            </div>
        </div>
        `
    }
    document.querySelector(".hourly_nav").innerHTML = html
}

function loadChartHTML() {
    const bool = time.getHours() >= 18 || time.getHours() <= 5
    let html = ``
    for (const chart of charts) {
        html += `
        <div class="col-12 ${chart.name} rounded-5 overflow-hidden flex-grow-1 ${bool ? "text-white" : "text-background"} ${bool ? "bg-background-dark" : "bg-white"}">
                        <div class="w-100 h-100">
                            <div class="info d-flex px-4 pt-3 justify-content-between">
                                <div>
                                    <h3 class="text-inherit fw-bold m-0">${chart.title}</h3>
                                    <p class="text-inherit mb-1">Summary</p>
                                </div>
                                <div>
                                    <div class="${bool ? "body-background-dark" : "bg-background-light"} rounded-circle mt-2 d-flex justify-content-center align-items-center"
                                        style="aspect-ratio: 1/1; width: 50px;">
                                        <i class="fa-solid ${chart.icon} text-white fs-3"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="container-canvas">
                                <canvas id="${chart.id}"></canvas>
                            </div>
                            <div class="d-flex justify-content-center">
                                <div class="d-flex justify-content-evenly hour_canvas mx-4">
                                    <div class="text-inherit time-label0">Now</div>
                                    <div class="text-inherit time-label1">6:00</div>
                                    <div class="text-inherit time-label2">9:00</div>
                                    <div class="text-inherit time-label3">12:00</div>
                                </div>
                            </div>
                        </div>
                    </div>
        `
    }
    document.querySelector(".chart_nav").innerHTML = html
    resizeCanvas()
}

function loadMessage(data){
    document.querySelector("#message").textContent = dataMessage.find(d=>d.weather==getWeatherInDay(data[0].weather)).message
}