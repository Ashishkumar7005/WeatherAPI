const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grandAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container")


let currentTab = userTab;
const API_KEY = "8c8422b241da3e0fa65c6ff4164a81d6";
currentTab.classList.add("current-tab");

function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grandAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
  }
}


userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});


function getfromSessionStorage(){
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if(!localCoordinates){
            grandAccessContainer.classList.add("active");
        }
        else{
            const coordinates  = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
}

async function fetchUserWeatherInfo(coordinates){
         const {lat,lon} = coordinates;
         grandAccessContainer.classList.remove("active");
         loadingScreen.classList.add("active");
          
        try {
            const response  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)    
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
            }
        catch (err) {
               loadingScreen.classList.remove("active")    
         }      
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText = weatherInfo?.main?.temp;
    windspeed.innerText= weatherInfo?.wind?.speed;
    humidity.innerText= weatherInfo?.main?.humidity;
    cloudiness.innerText= weatherInfo?.clouds?.all;

}

function getLocation(){
    if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("Access Denied")
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",userCoordinates);
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation)

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
e.preventDefault();
let cityName = searchInput.value;
if(cityName==""){
    alert("Enter City Name")
    return;
}
else{
    fetchSearchWeatherInfo(cityName);
}
})

async function fetchSearchWeatherInfo(cityName){
    loadingScreen.classList.add("active");
    grandAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("remove");

    try {
        const response  = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)    
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        }
catch(err){
          alert("wrong input");
    }
}

































// async function getApi(){
//     try{
//         let city = "goa";
//         let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         let data = await response.json();
//         console.log("weather data ->",data);
//     }
//     catch(err){
//                 console.log("Error Found Hogya",err);
//     }

// }


// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("not found");
//     }
// }

// function showPosition(position){
//     let lat= position.coords.latitude;
//     let lon= position.coords.longitude;
//     console.log(lat);
//     console.log(lon);
// }