//get current date
let currentDate = moment();
let apiKey = "418a089da6eee963f8933fd7698f0cd9";
let searchButton = $(".search-button");
let lat;
let lon;
const citiesHistory = [];
let history = $("#history");
let span = $("<span>");

$(document).ready(function() {
    getCityFromStorage();
})

// display history of cities
function getCityFromStorage(){
    let historyCityArray = JSON.parse(localStorage.getItem("citiesHistory"));
    if(historyCityArray){
        const historyCities = historyCityArray;
    
        for (var a = 0; a < historyCities.length; a++) {
        // historyCities.forEach(city => {
        console.log("city: ",historyCities[a])
            const button = $("<div>");
            button.text(historyCities[a]);
            button.attr({"id": historyCities[a], "class": "history_item"});
            
            $('#history').append(button);
            if(!historyCities.includes(button)){
                button.on("click", function(event) {
                    event.preventDefault();
                    console.log($(this).attr("id"))
                    let currentCity = $(this).attr("id");
                    $("#city-name").html(currentCity);
                    currentCityWeather(currentCity);
                });
            }
        }
    }
}
$('#history').empty();
getCityFromStorage();

searchButton.on("click", function(event){
    event.preventDefault();
    if($("#search-input").val() !== ""){
        $("#forecast").html("");
        $("#notification").text("");
        cityName = $("#search-input").val();

        // save city to history
        function setCityToStorage(){
            if(!citiesHistory.includes(cityName[0].toUpperCase() + cityName.slice(1))){
                citiesHistory.push(cityName[0].toUpperCase() + cityName.slice(1));
                if (citiesHistory.length > 5) {
                    citiesHistory.shift();
                }
                localStorage.setItem("citiesHistory", JSON.stringify(citiesHistory));
            }
        }
        setCityToStorage();
        $('#history').empty();
        getCityFromStorage();

        // $("#city-name").html(cityName);
        currentCityWeather(cityName);
        $("#city-icon").html('<i class="fa-solid fa-location-dot"></i>');
        $("#city-name").html(JSON.parse(localStorage.getItem("citiesHistory"))[0]);
        $("#form-heading").text("Today");
    } else {
        $("#notification").text("Type in a city name");
    }
    $("#search-input").val("");
})

//convert kelvin to celsius
function k2c(kelvin){
    return Math.round(kelvin - 273.15);
}

// convert mph to kmph
function mph2kmph(mph){
    return (mph * 1.609).toFixed(2);
}

// store and show last searched city as main weather report
if(localStorage.getItem("citiesHistory") !== null){
    cityName = localStorage.getItem(citiesHistory.length-1);
    $("#city-icon").html('<i class="fa-solid fa-location-dot"></i>');
    $("#city-name").html(JSON.parse(localStorage.getItem("citiesHistory"))[0]);
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
        lat = response[0].lat;
        lon = response[0].lon;
        let todaySection = $("#today");
        let weatherCard = $("<div>").attr({class: "card today"});
        let weatherHeader = $("<div>").attr({class: "weather_header today darker"});

        todaySection.html(weatherCard);
        weatherHeader.html(`<div>${currentDate.format("dddd")}</div><div>${currentDate.format("LT")}</div>`);
        weatherCard.append(weatherHeader);

    // function to display todays weather data for selected city
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(response){
            // card for todays weather
            let weatherBody = $("<div>").attr({class: "card_body"});
            let weatherBodyLeft = $("<div>").attr({class: "card_left"});
            let weatherBodyRight = $("<div>").attr({class: "card_right right"});
            let weatherSunrise = $("<div>").attr({class: "card_sunrise"});
            weatherSunrise.html("Sunrise: <b>"+moment.unix(response.sys.sunrise).format('h:mm A')+"</b>");
            let weatherSunset = $("<div>").attr({class: "card_sunset"});
            weatherSunset.html("Sunset: <b>"+moment.unix(response.sys.sunset).format('h:mm A')+"</b>");
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
                const ArrayOfHours = response.list;
                const fiveDaysForecast = [];
                for(let i = 0; i < ArrayOfHours.length; i++) {
                    if ((i + 1) % 8 === 0) {
                        fiveDaysForecast.push(ArrayOfHours[i])
                    }
                }
                let forecastCard;
                $("#forecast").empty();
                fiveDaysForecast.forEach(day => {
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
// TODO:
// create a history list of previously searched cities