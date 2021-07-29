var displayLocationEl = document.querySelector(".display-location");
var temperatureEl = document.querySelector("#temperature");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var UVIndexEl = document.querySelector("#UVIndex");
var locationButtonEl = document.querySelector(".city-id");
var redirectUrl = '404.html';



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
        cityButton.className = "city-id";
        //cityButton.id
        cityButton.textContent = city;
        cityButtonList.appendChild(cityButton);
        cityButton.onclick = cityButtonClickHandler;
    }
}

// function cityButtonDivClicked(event){
//     alert(event.target.innerHTML);
// }


var formMsg = document.querySelector("#formMsg");

function displayMessage(type, message) {
    formMsg.textContent = message;
    formMsg.setAttribute("class", type);
}

function cityButtonClickHandler(event) {
    var cityEl= event.target.innerHTML;
    console.log(cityEl);
    getWeatherInfo(cityEl);
}

var searchBtn = document.querySelector(".btn");
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    var cityEl = document.getElementById("city").value;
    if (cityEl === "") {
        displayMessage("error", "Please enter a City !!");
        return;
    } else {
        for(var i=0;i< citiesArray.length;i++){
            if(citiesArray[i]===cityEl) {
                displayMessage("error", "The City is already in the List!!!");
                return;
            } else {
                displayMessage("sucess", "");
            }
        }
        citiesArray.push(cityEl);
        localStorage.setItem("citiesLocal", JSON.stringify(citiesArray));
        viewCities();
        getWeatherInfo(cityEl);
    }

})

function getWeatherInfo(cityEl) {
    // used my key = 363823c2e92dad51019d30b82e6c13d8
    var apiurl = "https://api.openweathermap.org/data/2.5/weather?q= "+ cityEl + "&appid=363823c2e92dad51019d30b82e6c13d8";
    fetch(apiurl)
    .then(function(response){
        if (response.status === 404) {
            document.location.replace(redirectUrl);
        } else {
        return response.json();
        }
    })
    .then(function (data){
        console.log(data);

        document.getElementById("mainLocationInfo").className = " mainLocation";  

        var day = moment().format("MMM Do YYYY"); 
        displayLocationEl.textContent = data.name + "- "+ day  ;
        //var iconCode = data.weather[0].icon;
       // var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
      //  $('#wicon').attr('src', iconurl);
        // icon is pending
        var temp= data.main.temp;
        console.log(temp);
        var temp1= ((temp-273.15)*1.8)+32;
        console.log(temp1)
       var temp2 = Math.round(temp1);
       console.log(temp2)
       temperatureEl.textContent = "Temperature : " + temp2;
        windEl.textContent = "Wind: "+ data.wind.speed;
        humidityEl.textContent = "Humidity: "+ data.main.humidity;
        var latt = data.coord.lat;
        console.log(latt)
        var lonn = data.coord.lon;
        console.log(lonn)

var uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=363823c2e92dad51019d30b82e6c13d8&lat=" +latt + "&lon="+lonn;

fetch(uvIndexUrl)
.then(function(response){
    if (response.status === 404) {
        document.location.replace(redirectUrl);
    } else {
    return response.json();
}
})
.then(function(info){
    console.log(info);
    UVIndexEl .textContent = "UVIndex: "+ info.value;
    if((info.value) <=2 ) {
        //low
        document.getElementById("UVIndex").className = " lowUVIndex";  
    } else if ((info.value >2) && (info.value <=7) ){
        // moderate
        document.getElementById("UVIndex").className = " moderateUVIndex"; 
    }else {
        //danger
        document.getElementById("UVIndex").className = " dangerUVIndex"; 
    }

})
        
    })
    
}

var removeCities = document.getElementById("clear-city");
removeCities.addEventListener("click", clearCities)

initializeCities()



//key: 363823c2e92dad51019d30b82e6c13d8

//api.openweathermap.org/data/2.5/weather?q={city name}&appid=APIKey;
