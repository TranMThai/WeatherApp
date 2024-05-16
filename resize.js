function resizeCanvas() {
    const tempCanvas = document.getElementById('temp-canvas');
    const humidityCanvas = document.getElementById('humidity-canvas');
    const windCanvas = document.getElementById('wind-canvas');
    const container = document.querySelector('.container-canvas');
    const hourCanvas = document.getElementsByClassName("hour_canvas");

    tempCanvas.width = container.clientWidth;
    tempCanvas.height = container.clientHeight;

    humidityCanvas.width = container.clientWidth;
    humidityCanvas.height = container.clientHeight;

    windCanvas.width = container.clientWidth;
    windCanvas.height = container.clientHeight;

    for (let con of Array.from(hourCanvas)) {
        con.style.width = tempCanvas.clientWidth + "px";
    }
}