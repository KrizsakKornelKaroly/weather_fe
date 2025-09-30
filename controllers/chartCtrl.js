let allWeatherData = []

async function getallData(){
    try {
        const res = await fetch(`${ServerURL}/weather/user/${loggedUser.id}`); 
        weatherList = await res.json();
        allWeatherData = []

        weatherList.forEach(row => {
            allWeatherData.push({
                label: row.date,
                y: [Number(row.minTemp), Number(row.maxTemp)],
                name: row.weatherType,
                indexLabelFontColor: colorMode == 'dark' ? 'white' : 'black'
            }
            );
        });
    
    }
    catch (err) {
        Alerts("Hiba történt az adatok lekérdezésekor!", 'danger');
    }
}


function chartLoad() {

    var chart = new CanvasJS.Chart("chartContainer", {
        backgroundColor: "transparent",
        title: {
            fontColor: colorMode == 'dark' ? 'white' : 'black',
            text: "Időjárás-előrejelzés"
        },
        axisY: {
            suffix: " °C",
            maximum: 40,
            gridThickness: 0,
            labelFontColor: colorMode == 'dark' ? 'white' : 'black'
        },
        axisX: {
            labelFontColor: colorMode == 'dark' ? 'white' : 'black'
        },
        toolTip: {
            shared: true,
            content: "{name} </br> <strong>Hőmérséklet: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
        },
        data: [{
            type: "rangeSplineArea",
            fillOpacity: 0.1,
            color: "#91AAB1",
            indexLabelFormatter: formatter,
            dataPoints: allWeatherData
        }]
    });
    chart.render();

    $(window).resize(function () {
        var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;
        var imageCenter = 0;
        for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
            imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
            if (chart.data[0].dataPoints[i].name == "cloudy") {
                $(".cloudy").eq(cloudyCounter++).css({ "left": imageCenter });
            } else if (chart.data[0].dataPoints[i].name == "rainy") {
                $(".rainy").eq(rainyCounter++).css({ "left": imageCenter });
            } else if (chart.data[0].dataPoints[i].name == "sunny") {
                $(".sunny").eq(sunnyCounter++).css({ "left": imageCenter });
            }
        }
    });

    function formatter(e) {
        if (e.index === 0 && e.dataPoint.x === 0) {
            return " Min " + e.dataPoint.y[e.index] + "°";
        } else if (e.index == 1 && e.dataPoint.x === 0) {
            return " Max " + e.dataPoint.y[e.index] + "°";
        } else {
            return e.dataPoint.y[e.index] + "°";
        }
    }

}
