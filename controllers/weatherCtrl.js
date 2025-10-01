let seasonData = {}
let weatherUserData = []
let optionData = ["Borult", "Esős", "Felhős", "Hóesés", "Jégeső", "Köd", "Napos", "Szeles", "Zápor", "Zivatar"]


async function editWeatherRow(rowId, rowNumberId) {
    let minTempField = document.querySelector('#minTempFieldEdit')
    let maxTempField = document.querySelector('#maxTempFieldEdit')
    let weatherTypeField = document.querySelector('#weatherTypeSelect')

    if (minTempField.value == '' || maxTempField.value == '' || weatherTypeField.value == '') {
        Alerts("Hiányzó adatok!", 'danger');
        return;
    }

    if (Number(minTempField.value) > Number(maxTempField.value)) {
        Alerts("A maximum hőmérséklet nem lehet kisebb a minimumnál!", 'danger');
        return;
    }

    seasonData = checkSeason(weatherUserData[rowId].date)

    if (!seasonData.optionValues.includes(weatherTypeField.value)) {
        if (!confirm("A megadott időjárástípus nem jellemző az évszakra. Biztosan folytatod?")) {
            return;
        }
    }

    if (Number(minTempField.value) < Number(seasonData.minTemp) || Number(maxTempField.value) > Number(seasonData.maxTemp)) {
        if (!confirm("A megadott hőmérséklet tartomány nem jellemző az évszakra. Biztosan folytatod?")) {
            return;
        }
    }

    console.log(rowId, rowNumberId)

    try {
        const res = await fetch(`${ServerURL}/weather/${rowId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: String(loggedUser.id),
                date: weatherUserData[weatherUserData.findIndex(item => item.id == rowId)].date,
                minTemp: minTempField.value,
                maxTemp: maxTempField.value,
                weatherType: weatherTypeField.value,
            })
        });

        let data = await res.json();
        if (res.status == 200) {
            await getWeatherData();
            displayWeatherData();
        }
        Alerts(data.msg, res.status == 200 ? "success" : "danger")
    }
    catch (error) {
        Alerts("Hiba történt a módosítás során!", "danger")
        console.log(error)
    }

}

async function openEditWeatherRow(rowId, rowNumberId) {
    let tableBody = document.querySelector("tbody")
    let currentButton = document.querySelector(`#editBtn${rowNumberId}`);
    currentButton.disabled = true;

    if (document.querySelector(`#collapse${rowNumberId}`)) {
        return;
    }

    for (let j = 0; j < tableBody.childElementCount; j++) {
        let selectedRow = tableBody.children[j];

        if (selectedRow.children[0].hasAttribute('colspan')) {
            let selectedButton = document.querySelector(`#editBtn${j - 1}`);
            selectedButton.disabled = false;
            selectedRow.remove();
        }
    }

    let targetRow = tableBody.rows[rowNumberId + 1]
    let tr = document.createElement("tr")
    let td = document.createElement("td")

    let editCollapse = document.createElement("div")
    editCollapse.classList.add("collapse")
    editCollapse.id = `collapse${rowNumberId}`

    let collapseBody = document.createElement("div")
    collapseBody.classList.add("card", "card-body", "row")

    let collapseRowBody = document.createElement("div")
    collapseRowBody.classList.add("row", "justify-content-center", "mx-auto")


    //minTempField creation
    let minTempFieldParent = document.createElement("div")
    minTempFieldParent.classList.add("form-floating", "mb-3", "col-lg-4")

    let minTempField = document.createElement("input")
    minTempField.setAttribute("type", "number")
    minTempField.setAttribute("placeholder", "")
    minTempField.classList.add("form-control")
    minTempField.id = "minTempFieldEdit"

    let minTempFieldLabel = document.createElement("label")
    minTempFieldLabel.setAttribute("for", "minTempFieldEdit")
    minTempFieldLabel.classList.add("TempFieldEdit")
    minTempFieldLabel.innerHTML = "Min. °C"

    minTempFieldParent.appendChild(minTempField)
    minTempFieldParent.appendChild(minTempFieldLabel)

    //maxTempField creation
    let maxTempFieldParent = document.createElement("div")
    maxTempFieldParent.classList.add("form-floating", "mb-3", "col-lg-4")

    let maxTempField = document.createElement("input")
    maxTempField.setAttribute("type", "number")
    maxTempField.setAttribute("placeholder", "")
    maxTempField.classList.add("form-control")
    maxTempField.id = "maxTempFieldEdit"

    let maxTempFieldLabel = document.createElement("label")
    maxTempFieldLabel.setAttribute("for", "maxTempFieldEdit")
    maxTempFieldLabel.classList.add("TempFieldEdit")
    maxTempFieldLabel.innerHTML = "Max. °C"

    maxTempFieldParent.appendChild(maxTempField)
    maxTempFieldParent.appendChild(maxTempFieldLabel)

    //weathertype creation
    let weatherTypeParent = document.createElement("div");
    weatherTypeParent.classList.add("input-group", "mb-3", "col-lg-4", "customWidth")

    let weatherTypeSelect = document.createElement("select")
    weatherTypeSelect.classList.add("form-select", "w-70")
    weatherTypeSelect.id = "weatherTypeSelect";

    let weatherTypeLabel = document.createElement("label")
    weatherTypeLabel.classList.add("input-group-text", "w-30")
    weatherTypeLabel.setAttribute("for", "weatherTypeSelect")
    weatherTypeLabel.innerHTML = "Időjárástípusok"

    weatherTypeParent.appendChild(weatherTypeSelect)
    weatherTypeParent.appendChild(weatherTypeLabel)

    for (let i = 0; i < optionData.length; i++) {
        let option = document.createElement("option")
        option.value = optionData[i]
        option.innerHTML = optionData[i]
        weatherTypeSelect.appendChild(option)
    }

    let buttonParent = document.createElement("div")
    buttonParent.classList.add("row", "justify-content-center", "mx-auto")


    //close button creation
    let closeButton = document.createElement("button")
    closeButton.classList.add("btn", "btn-secondary", "m-3", "col-lg-3")
    closeButton.innerHTML = "Mégsem"
    closeButton.onclick = function () {
        tr.remove();
        currentButton.disabled = false;
    }

    //save button creation
    let saveButton = document.createElement("button")
    saveButton.classList.add("btn", "btn-primary", "m-3", "col-lg-3")
    saveButton.innerHTML = "Mentés"
    saveButton.setAttribute("onClick", `editWeatherRow(${rowId}, ${rowNumberId})`)

    collapseRowBody.appendChild(minTempFieldParent)
    collapseRowBody.appendChild(maxTempFieldParent)
    collapseRowBody.appendChild(weatherTypeParent)

    buttonParent.appendChild(saveButton)
    buttonParent.appendChild(closeButton)

    collapseBody.appendChild(collapseRowBody)
    collapseBody.appendChild(buttonParent)

    editCollapse.appendChild(collapseBody)
    td.appendChild(editCollapse)
    tr.appendChild(td)

    editCollapse.classList.add("show")
    td.setAttribute("colspan", "6")
    tableBody.insertBefore(tr, targetRow)


}

async function deleteWeatherRow(rowId) {
    if (confirm("Biztosan szeretnéd törölni a sort?")) {
        try {
            const res = await fetch(`${ServerURL}/weather/${rowId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json"
                }
            });

            let data = await res.json();
            if (res.status == 200) {
                await getWeatherData();
                displayWeatherData();
            }

            Alerts(data.msg, res.status == 200 ? "success" : "danger");

        } catch (error) {
            Alerts("Hiba történt az adat törlése során!", "danger")
        }
    }
}

function displayWeatherData() {
    let tableBody = document.querySelector("tbody")
    tableBody.innerHTML = "";

    weatherUserData.forEach((row, index) => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');

        let editBtn = document.createElement('button');
        let delBtn = document.createElement('button');

        editBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
        delBtn.classList.add('btn', 'btn-sm', 'btn-danger');

        td1.innerHTML = (index + 1) + '.';
        td2.innerHTML = row.date;
        td3.innerHTML = row.minTemp;
        td4.innerHTML = row.maxTemp;
        td5.innerHTML = row.weatherType;

        editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>';
        delBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';

        delBtn.setAttribute('onClick', `deleteWeatherRow(${row.id})`)
        editBtn.setAttribute('onClick', `openEditWeatherRow(${row.id}, ${index})`)
        editBtn.setAttribute('data-bs-toggle', "collapse")
        editBtn.setAttribute('data-bs-target', `#collapse${index}`)
        editBtn.setAttribute('aria-expanded', "false")
        editBtn.setAttribute('aria-controls', `collapse${index}`)

        editBtn.id = `editBtn${index}`

        td6.appendChild(editBtn);
        td6.appendChild(delBtn);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tableBody.appendChild(tr);

    });
}

async function getWeatherData() {
    try {
        const res = await fetch(`${ServerURL}/weather/user/${loggedUser.id}`);
        weatherUserData = await res.json();
        weatherUserData = weatherUserData.sort((a, b) => { return a['date'].localeCompare(b['date']) });
    } catch (error) {
        Alerts("Hiba történt az adatok lekérdezése során!", "danger")
    }
}

function setMinDate() {
    let dateField = document.querySelector('#dateField')
    let today = new Date().toISOString().split('T')[0];
    dateField.setAttribute('min', today);
}

function addChangeEvent(trigger) {
    let dateField = document.querySelector('#dateField')
    dateField.setAttribute("onchange", "addChangeEvent(true)")
    if (trigger) {
        seasonData = checkSeason(dateField.value)
    }
}

async function SendWeatherData() {
    let dateField = document.querySelector('#dateField')
    let minTempField = document.querySelector('#minTempField')
    let maxTempField = document.querySelector('#maxTempField')
    let weatherTypeField = document.querySelector('#weatherTypeField')

    seasonData = checkSeason(dateField.value)

    if (dateField.value == '' || minTempField.value == '' || maxTempField.value == '' || weatherTypeField.value == '') {
        Alerts("Hiányzó adatok!", 'danger');
        return;
    }

    if (Number(minTempField.value) > Number(maxTempField.value)) {
        Alerts("A maximum hőmérséklet nem lehet kisebb a minimumnál!", 'danger');
        return;
    }

    if (!seasonData.optionValues.includes(weatherTypeField.value)) {
        if (!confirm("A megadott időjárástípus nem jellemző az évszakra. Biztosan folytatod?")) {
            return;
        }
    }

    if (Number(minTempField.value) < Number(seasonData.minTemp) || Number(maxTempField.value) > Number(seasonData.maxTemp)) {
        if (!confirm("A megadott hőmérséklet tartomány nem jellemző az évszakra. Biztosan folytatod?")) {
            return;
        }
    }

    try {
        console.log(loggedUser.id)
        const res = await fetch(`${ServerURL}/weather/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    userID: loggedUser.id,
                    date: dateField.value,
                    minTemp: minTempField.value,
                    maxTemp: maxTempField.value,
                    weatherType: weatherTypeField.value
                }
            )
        });

        const data = await res.json();
        Alerts(data.msg, res.status == 200 ? "success" : "danger")
    } catch (error) {
        Alerts("Hiba történt a mentés során!", "danger")
    }
    await getWeatherData();
    displayWeatherData();

}

let seasonValues = [
    {
        season: "autumn",
        minTemp: "-5",
        maxTemp: "35",
        optionValues: ["Napos", "Esős", "Zápor", "Szeles", "Felhős", "Borult", "Köd", "Zivatar"]
    },
    {
        season: "winter",
        minTemp: "-15",
        maxTemp: "20",
        optionValues: ["Napos", "Esős", "Zápor", "Szeles", "Felhős", "Borult", "Jégeső", "Köd", "Zivatar", "Hóesés"]
    },
    {
        season: "summer",
        minTemp: "20",
        maxTemp: "45",
        optionValues: ["Napos", "Esős", "Zápor", "Szeles", "Felhős", "Borult", "Zivatar"]
    },
    {
        season: "spring",
        minTemp: "0",
        maxTemp: "25",
        optionValues: ["Napos", "Esős", "Zápor", "Szeles", "Felhős", "Borult", "Köd", "Zivatar"]
    }
]

function checkSeason(date) {
    let month = Number(date.split('-')[1])
    let currentSeason = null;

    switch (true) {
        case (month == 1 || month == 2 || month == 12):
            currentSeason = "winter";
            break;
        case (month >= 3 && month <= 5):
            currentSeason = "spring";
            break;
        case (month >= 6 && month <= 8):
            currentSeason = "summer";
            break;
        case (month >= 9 && month <= 11):
            currentSeason = "autumn"
            break;
        default:
            break;
    }

    return seasonValues[seasonValues.findIndex(season => season.season == currentSeason)]
}

function fillOptions() {
    let weatherTypeField = document.querySelector('#weatherTypeField')

    for (let i = 0; i < optionData.length; i++) {
        let option = document.createElement("option")
        option.value = optionData[i]
        option.innerHTML = optionData[i]

        weatherTypeField.appendChild(option)
    }

}