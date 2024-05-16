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