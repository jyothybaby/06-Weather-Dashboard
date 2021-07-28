var displayLocationEl = document.querySelector(".display-location");
var APIKey = "363823c2e92dad51019d30b82e6c13d8";
var citiesArray = [];
function initializeCities() {
    var citiesLocal = JSON.parse(localStorage.getItem("citiesLocal"));
    if (citiesLocal !== null) {
        citiesArray = citiesLocal;
    }
    viewCities()
}

//Clearing the local storage
function clearCities() {
    localStorage.removeItem("citiesLocal");
    citiesArray = [];
    //viewScores();
}

function viewCities() {
    var citiesLocal = JSON.parse(localStorage.getItem("citiesLocal"));
    if (citiesLocal !== null) {
        citiesArray = citiesLocal;
        console.log("citiesArray", citiesArray)
        displayCities();
    }
   
}


var cityButtonList = document.getElementById("city-buttons");

function displayCities() {
    cityButtonList.innerHTML = "";
       for (var i = 0; i < citiesArray.length; i++) {
        var city = citiesArray[i];
        var cityButton = document.createElement("button");
        cityButton.className = "city-id"
        cityButton.textContent = city;
        cityButtonList.appendChild(cityButton);
    }
}


var formMsg = document.querySelector("#formMsg");

function displayMessage(type, message) {
    formMsg.textContent = message;
    formMsg.setAttribute("class", type);
}

var searchBtn = document.querySelector(".btn");
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    var cityEl = document.getElementById("city").value;
    if (cityEl === "") {
        displayMessage("error", "Please enter a City !!");
        return;
    } else {
        citiesArray.push(cityEl);
        localStorage.setItem("citiesLocal", JSON.stringify(citiesArray));
        viewCities();
        getWeatherInfo(cityEl);
    }

})

function getWeatherInfo(cityEl) {
    var apiurl = "https://api.openweathermap.org/data/2.5/weather?q= "+ cityEl + "&appid=363823c2e92dad51019d30b82e6c13d8";
    fetch(apiurl)
    .then(function(response){
        return response.json();
    })
    .then(function (data){
        console.log(data);
        var day = moment().format("MMM Do YYYY"); 
        displayLocationEl.textContent = data.name + "- "+ day;
        console.log("displayLocationEl");
    })
}

var removeCities = document.getElementById("clear-city");
removeCities.addEventListener("click", clearCities)
initializeCities()

//key: 363823c2e92dad51019d30b82e6c13d8

//api.openweathermap.org/data/2.5/weather?q={city name}&appid=APIKey;
