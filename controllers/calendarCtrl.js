let calEvents = [];

async function getCalendarData() {
    try {
        const res = await fetch(`${ServerURL}/weather/user/${loggedUser.id}`); 
        weatherList = await res.json();
        calEvents = [];

        weatherList.forEach(row => {
            calEvents.push(
                {title: "Időjárás: " + row.weatherType, start: row.date},
                {title: "Minimum hőmérséklet: " + row.minTemp + " °C", start: row.date/*, backgroundColor: "lightorange"*/},
                {title: "Maximum hőmérséklet: " + row.maxTemp + " °C", start: row.date/*, backgroundColor: "cyan"*/}
                
            );
        });
    
    }
    catch (err) {
        Alerts("Hiba történt az adatok lekérdezésekor!", 'danger');
    }
}

function initCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'hu',
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        events: calEvents
    });
    calendar.render();
}