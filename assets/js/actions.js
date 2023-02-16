// let weatherIcon = $(".card-img-top");
// let cityName = $(".card-title").val();

//get current date
let currentDate = moment().format("DD/MM/YYYY");
console.log(currentDate);
let apiKey = "418a089da6eee963f8933fd7698f0cd9";
let searchButton = $(".search-button");

searchButton.on("click", function(event){
    event.preventDefault();
    cityName = $("#search-input").val();
    currentCityWeather(cityName);
    console.log($("#search-input").val());
})

// function to convert city name to lan&lon
function currentCityWeather(cityName){
    let apiURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        let lat = response[0].lat;
        let lon = response[0].lon;
        let todaySection = $("#today");
        let weatherCard = $("<div>").attr({class: "card"});
        let weatherIcon = $("<img>");
        let weatherBody = $("<div>").attr({class: "card-body"});
        let weatherCity = $("<h5>").attr({class: "card"});
        let weatherTemp = $("<p>");
        let weatherWind = $("<p>");
        let weatherHumidity = $("<p>");

    todaySection.append(weatherCard);

    // function to display todays weather data for selected city
    let apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(response){
            console.log(response);
            weatherIcon.attr({class: "card-img-top", src: `https://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`});
            weatherCard.append(weatherIcon);
        })
    })
}

// function to display an array of 5 days worth weather data sets for currently selected city

