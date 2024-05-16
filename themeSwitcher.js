const daily_nav = document.querySelector(".daily_nav")
const locationDom = document.querySelector("#location")
const body = document.querySelector("body")
function changeColorBackground() {
    if (time.getHours() >= 18 || time.getHours() <= 5) {
        daily_nav.classList.add("bg-background-dark")
        daily_nav.classList.remove("bg-white")

        locationDom.classList.add("text-background")
        locationDom.classList.remove("text-background-dark")


        body.classList.add("body-background-dark")
        body.classList.remove("bg-background-light")
    }
    else {
        daily_nav.classList.remove("bg-background-dark")
        daily_nav.classList.add("bg-white")

        locationDom.classList.remove("text-background")
        locationDom.classList.add("text-background-dark")

        body.classList.remove("body-background-dark")
        body.classList.add("bg-background-light")
    }
}