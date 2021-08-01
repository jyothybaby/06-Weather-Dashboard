var displayLocationEl = document.querySelector(".display-location");
var temperatureEl = document.querySelector("#temperature");
var windEl = document.querySelector("#wind");
var humidityEl = document.querySelector("#humidity");
var UVIndexEl = document.querySelector("#UVIndex");
var locationButtonEl = document.querySelector(".city-id");
var redirectUrl = '404.html';
var fiveDayDateEl = document.querySelector("#fiveDayDate");
var fiveDayWindEl = document.querySelector("#fiveDayWind");
var fiveDayTempEl = document.querySelector("#fiveDayTemp");
var fiveDayHumidityEl = document.querySelector("#fiveDayHumidity");
var forcastContainerEl= document.querySelector("#dayForcast");
let icon = document.querySelector(".icon");




var APIKey = "363823c2e92dad51019d30b82e6c13d8"; // this is my key for openweathermap.
var citiesArray = [];
//This is for getting the items from the localstorage when the program loads.
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

//Adding city buttons to the page.
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
        cityButton.onclick = cityButtonClickHandler; // calling a function here after a button click
    }
}

// function cityButtonDivClicked(event){
//     alert(event.target.innerHTML);
// }


var formMsg = document.querySelector("#formMsg");
// creating a function for Form messages
function displayMessage(type, message) {
    formMsg.textContent = message;
    formMsg.setAttribute("class", type);
}

function cityButtonClickHandler(event) {
    var cityEl= event.target.innerHTML;
    console.log(cityEl);
    getWeatherInfo(cityEl);
    displayFiveDayForcast(cityEl);
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
        displayFiveDayForcast(cityEl);
    }

})

//function for getting the weather info . Here, we are passing the city.
function getWeatherInfo(cityEl) {
   
    // used my key = 363823c2e92dad51019d30b82e6c13d8
    var apiurl = "https://api.openweathermap.org/data/2.5/weather?q= "+ cityEl + "&appid=363823c2e92dad51019d30b82e6c13d8"; // adding city 
    fetch(apiurl)
    .then(function(response){
        if (response.status === 404) {
            document.location.replace(redirectUrl);  // tried to implement 404 server error message page.
        } else {
        return response.json();
        }
    })
    .then(function (data){
        console.log(data);
//displaying the content from json file
        document.getElementById("mainLocationInfo").className = " mainLocation";  
        var day = moment().format("M/D/YYYY");  //Used Moment.js for dispalying the date
        displayLocationEl.textContent = data.name + "- "+ day ;
            
     var temp= data.main.temp;
        console.log(temp);
        //temperature conversion from K to F
        var temp1= ((temp-273.15)*1.8)+32;
        console.log(temp1)
       var temp2 = Math.round(temp1);
       console.log(temp2)
       temperatureEl.textContent = "Temperature : " + temp2 + " " + "F";
       //This is the section for Wind
        windEl.textContent = "Wind: "+ data.wind.speed + " " + "MPH";
        //This is the section for Humidity.
        humidityEl.textContent = "Humidity: "+ data.main.humidity + " " + "%";
        //This is the section for icon  
        var iconCode = data.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        $("#weatherImg").attr("src", iconUrl);

//Getting lattitude and longitude from json to obtain the UV Index.
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
 //This is the function for dispalying 5 day forcast.
function  displayFiveDayForcast(cityEl)  {
    forcastContainerEl.innerHTML = "";
    // in Api added "forcast" instead of weather
      var apiurl = "https://api.openweathermap.org/data/2.5//forecast?q= "+ cityEl + "&appid=363823c2e92dad51019d30b82e6c13d8";
    fetch(apiurl)
    .then(function(response){
        if (response.status ===404){
            document.location.replace(redirectUrl);
        } else {
            return response.json();
        }
    })
        .then(function (data){
           console.log(data);
            for(var i=0; i < 5; i++) {
                // Created the elements dynamically
                var daydiv = document.createElement("div");

                var date = document.createElement("p");
                date.textContent = moment().add(1+i,"days").format("M/D/YYYY"); //used Moment.js for dispalying the date
                daydiv.appendChild(date);
                
                var tempEl = document.createElement("p");
                tempEl.textContent = "Temperature :" + Math.round((((data.list[i].main.temp)-273.15)*1.8)+32)+ " "+ "F";
                daydiv.appendChild(tempEl);
                
                var windEl = document.createElement("p");
                windEl.textContent = "Wind: " + data.list[i].wind.speed + " " + "MPH";
                daydiv.appendChild(windEl);
                
                var humidityEl = document.createElement("p");
                humidityEl.textContent = "Humidity: "+ data.list[i].main.humidity + " " + "%";
                daydiv.appendChild(humidityEl);
                
                var img = document.createElement("img");
                var iconCode = data. list[i].weather[0].icon;
                 img.src = "http://openweathermap.org/img/w/" + iconCode + ".png";
                 daydiv.appendChild(img);

                forcastContainerEl.appendChild(daydiv);
               }
        });
}

var removeCities = document.getElementById("clear-city");
removeCities.addEventListener("click", clearCities)

initializeCities()



//key: 363823c2e92dad51019d30b82e6c13d8

//api.openweathermap.org/data/2.5/weather?q={city name}&appid=APIKey;

