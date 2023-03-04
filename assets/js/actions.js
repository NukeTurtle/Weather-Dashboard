// let weatherIcon = $(".card-img-top");
// let cityName = $(".card-title").val();

//get current date
let currentDate = moment();
let apiKey = "418a089da6eee963f8933fd7698f0cd9";
let searchButton = $(".search-button");

searchButton.on("click", function(event){
    event.preventDefault();
    if($("#search-input").val() !== ""){
        $("#notification").text("");
        cityName = $("#search-input").val();
        currentCityWeather(cityName);
        console.log($("#search-input").val());
        $("#city-name").html(cityName);
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

// function to convert city name to lan&lon
function currentCityWeather(cityName){
    let apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        let lat = response[0].lat;
        let lon = response[0].lon;
        let todaySection = $("#today");
        let weatherCard = $("<div>").attr({class: "card"});
        let weatherHeader = $("<div>").attr({class: "weather_header"});

        todaySection.append(weatherCard);
        weatherHeader.html(`<div>Today</div><div>${currentDate.format("LT")}</div>`);
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
            let weatherBody = $("<div>").attr({class: "card_body"});
            let weatherBodyLeft = $("<div>").attr({class: "card_left"});
            let weatherBodyRight = $("<div>").attr({class: "card_right"});
            let weatherDetails = $("<div>").attr({class: "card_details"});
            let weatherCity = $("<h5>").attr({class: "card-city"});
            let weatherSunrise = $("<div>").attr({class: "card_sunrise"});
            weatherSunrise.text("Sunrise: "+moment(response.sys.sunrise).format("LT"));
            let weatherSunset = $("<div>").attr({class: "card_sunset"});
            weatherSunset.text("Sunset: "+moment(response.sys.sunset).format("LT"));
            let weatherTemp = $("<h1>");
            weatherTemp.text(k2c(response.main.temp)+"°");
            let weatherIcon = $("<img>");
            weatherIcon.attr({class: "card_icon", src: `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`});
            let weatherFeel = $("<div>").attr({class: "card_feel"});
            weatherFeel.text("Real Feel: "+k2c(response.main.feels_like)+"°");
            let weatherWind = $("<div>").attr({class: "card_wind"});
            weatherWind.text("Wind: "+mph2kmph(response.wind.speed)+" km/h");
            let weatherPressure = $("<div>").attr({class: "card_pressure"});
            weatherPressure.text("Pressure: "+response.main.pressure+"MB");
            let weatherHumidity = $("<div>").attr({class: "card_humidity"});
            weatherHumidity.text("Humidity: "+response.main.humidity+"%");


            weatherBodyLeft.append(weatherTemp, weatherFeel, weatherWind, weatherPressure, weatherHumidity);
            weatherBodyRight.append(weatherIcon, weatherSunrise, weatherSunset);
            weatherBody.append(weatherBodyLeft, weatherBodyRight)
            // weatherCard.append(cityName)
            weatherCard.append(weatherBody);
            
        })
    })
}

// store and show last searched city as main weather report
// create a history list of previously searched cities
// function to display an array of 5 days worth weather data sets for currently selected city