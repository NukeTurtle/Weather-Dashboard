//get current date
let currentDate = moment();
let apiKey = "418a089da6eee963f8933fd7698f0cd9";
let searchButton = $(".search-button");
let lat;
let lon;
const citiesHistory = [];
let history = $("#history");
let span = $("<span>");

// display history of cities
if(citiesHistory){
    citiesHistory.forEach(city => {
        console.log("HAHAHAHHA: ", city);
        span.append(city)
        history.append(span);
    })
}

searchButton.on("click", function(event){
    event.preventDefault();
    if($("#search-input").val() !== ""){
        $("#forecast").html("");
        $("#notification").text("");
        cityName = $("#search-input").val();
        citiesHistory.push(cityName);
        if (citiesHistory.length > 5) {
            citiesHistory.shift();
        }
        localStorage.setItem("citiesHistory", citiesHistory);

        citiesHistory.forEach(city => {
            console.log("HAHAHAHHA: ", city);
            span.append(city)
            history.append(span);
        })
        
        // citiesHistory.forEach(function(city) {
        //     const span = document.createElement("span");
        //     span.innerText = city;
        //     span.addEventListener("click", function(event) {
        //         event.preventDefault();
        //         cityName = city;
        //     });
        //     history.append(span);
        // })

        currentCityWeather(cityName);
        console.log($("#search-input").val());
        localStorage.setItem("cityName", cityName[0].toUpperCase() + cityName.slice(1));
        $("#city-icon").html('<i class="fa-solid fa-location-dot"></i>');
        $("#city-name").html(cityName[0].toUpperCase() + cityName.slice(1));
        $("#form-heading").text("Today");
    } else {
        $("#notification").text("Type in a city name");
    }
})

//convert kelvin to celsius
function k2c(kelvin){
    return Math.round(kelvin - 273.15);
}

// convert mph to kmph
function mph2kmph(mph){
    return (mph * 1.609).toFixed(2);
}

if(localStorage.getItem("cityName")){
    cityName = localStorage.getItem("cityName");
    $("#city-icon").html('<i class="fa-solid fa-location-dot"></i>');
    $("#city-name").html(cityName);
    $("#form-heading").text("Today");
    currentCityWeather(cityName);
}

// function to convert city name to lan&lon
function currentCityWeather(cityName){
    let apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        lat = response[0].lat;
        lon = response[0].lon;
        let todaySection = $("#today");
        let weatherCard = $("<div>").attr({class: "card today"});
        let weatherHeader = $("<div>").attr({class: "weather_header today darker"});

        todaySection.html(weatherCard);
        weatherHeader.html(`<div>${currentDate.format("dddd")}</div><div>${currentDate.format("LT")}</div>`);
        console.log(currentDate.add(1, "days").format("dddd"));
        console.log(currentDate.format("LT"));
        weatherCard.append(weatherHeader);
    

    // function to display todays weather data for selected city
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(response){
            console.log(response);
            // card for todays weather
            let weatherBody = $("<div>").attr({class: "card_body"});
            let weatherBodyLeft = $("<div>").attr({class: "card_left"});
            let weatherBodyRight = $("<div>").attr({class: "card_right right"});
            let weatherSunrise = $("<div>").attr({class: "card_sunrise"});
            weatherSunrise.html("Sunrise: <b>"+moment(response.sys.sunrise).format("LT")+"</b>");
            let weatherSunset = $("<div>").attr({class: "card_sunset"});
            weatherSunset.html("Sunset: <b>"+moment(response.sys.sunset).format("LT")+"</b>");
            let weatherTemp = $("<h1>");
            weatherTemp.text(k2c(response.main.temp)+"°");
            let weatherIcon = $("<img>");
            weatherIcon.attr({class: "card_icon", src: `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`});
            let weatherFeel = $("<div>").attr({class: "card_feel"});
            weatherFeel.html("Real Feel: <b>"+k2c(response.main.feels_like)+"°</b>");
            let weatherWind = $("<div>").attr({class: "card_wind"});
            weatherWind.html("Wind: <b>"+mph2kmph(response.wind.speed)+" km/h</b>");
            let weatherPressure = $("<div>").attr({class: "card_pressure"});
            weatherPressure.html("Pressure: <b>"+response.main.pressure+"MB</b>");
            let weatherHumidity = $("<div>").attr({class: "card_humidity"});
            weatherHumidity.html("Humidity: <b>"+response.main.humidity+"%</b>");

            // append all children to the card
            weatherBodyLeft.append(weatherTemp, weatherFeel, weatherWind, weatherPressure, weatherHumidity);
            weatherBodyRight.append(weatherIcon, weatherSunrise, weatherSunset);
            weatherBody.append(weatherBodyLeft, weatherBodyRight)
            weatherCard.append(weatherBody);

            // function to display 5days prognosis
            let prognosisURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            $.ajax({
                url: prognosisURL,
                method: "GET"
            }).then(function(response){
                console.log("16days: ",response);
                const ArrayOfHours = response.list;
                const fiveDaysForecast = [];
                for(let i = 0; i < ArrayOfHours.length; i++) {
                    if ((i + 1) % 8 === 0) {
                        fiveDaysForecast.push(ArrayOfHours[i])
                    }
                }
                let forecastCard
                fiveDaysForecast.forEach(day => {
                    console.log(day)
                    forecastCard = $("<div>").attr({class: "card forecast"});
                    let forecastHeader = $("<div>").attr({class: "forecast_header forecast"});
                    let forecastBody = $("<div>").attr({class: "forecast_body"});
                    let forecastDay = $("<div>").attr({class: "forecast_day"});
                    forecastDay.html(moment(day.dt_txt).format("ddd"));
                    let forecastIcon = $("<img>");
                    forecastIcon.attr({class: "forecast_icon", src: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`});
                    let forecastTemp = $("<div>").attr({class: "forecast_temp"});
                    forecastTemp.html(k2c(day.main.temp)+"°");
                    let forecastHumidity = $("<div>").attr({class: "forecast_humidity"});
                    forecastHumidity.html("Humidity<br>"+day.main.humidity);

                    // append all children to the card
                    forecastHeader.append(forecastDay);
                    forecastBody.append(forecastIcon, forecastTemp, forecastHumidity);
                    forecastCard.append(forecastHeader, forecastBody);
                    $("#forecast").append(forecastCard);
                });
                
            })
        })
    })
}

// store and show last searched city as main weather report
// create a history list of previously searched cities
// function to display an array of 5 days worth weather data sets for currently selected city