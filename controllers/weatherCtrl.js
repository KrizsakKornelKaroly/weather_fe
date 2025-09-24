function setMinDate() {
    let dateField = document.querySelector('#dateField')
    let today = new Date().toISOString().split('T')[0];
    dateField.setAttribute('min', today);
}

function addChangeEvent(trigger) {
    let dateField = document.querySelector('#dateField')
    dateField.setAttribute("onchange", "addChangeEvent(true)")
    if (trigger) {
        checkSeason(dateField.value)
    }
}

function SendWeatherData() {
    let dateField = document.querySelector('#dateField')
    let minTempField = document.querySelector('#minTempField')
    let maxTempField = document.querySelector('#maxTempField')
    let weatherTypeField = document.querySelector('#weatherTypeField')

    if (minTempField > maxTempField) {
        Alerts("A maximum hőmérséklet nem lehet kisebb a minimumnál!", 'danger');
        return;
    }

    console.log(checkSeason(dateField.value));
}

let seasonValues = [
    {
        season: "autumn",
        minTemp: "",
        maxTemp: "",
        optionValues: {}
    },
    {
        season: "winter",
        minTemp: "",
        maxTemp: "",
        optionValues: {}
    },
    {
        season: "summer",
        minTemp: "",
        maxTemp: "",
        optionValues: {}
    },
    {
        season: "spring",
        minTemp: "",
        maxTemp: "",
        optionValues: {}
    }
]


function checkSeason(date) {
    let month = Number(date.split('-')[1])
    let season = null;

    switch (true) {
        case (month == 1 || month == 2 || month == 12):
            season = "winter";
            break;
        case (month >= 3 && month <= 5):
            season = "spring";
            break;
        case (month >= 6 && month <= 8):
            season = "summer";
            break;
        case (month >= 9 && month <= 11):
            season = "autumn"
            break;
        default:
            break;
    }

    console.log(season)
}