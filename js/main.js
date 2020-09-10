
const cityInput = document.querySelector('#cityInput');
const temph2 = document.querySelector('.temp');
const cityNameH1 = document.querySelector('.city')
const body = document.querySelector('body');
const wrapper = document.querySelector('.wrapper');
const header = document.querySelector('header');
const feelsLikeSpan = document.querySelector('.feelsLikeSpan');
const humiditySpan = document.querySelector('.humiditySpan');
const pressureSpan = document.querySelector('.pressureSpan');
const windSpan = document.querySelector('.windSpan');
const searchBtn = document.querySelector('.searchBtn');

const daysName = document.querySelectorAll('.dayName');
const tempMain = document.querySelectorAll('.tempMain');
const clouds = document.querySelectorAll('.cloud');

const hourNames = document.querySelectorAll('.hourName');
const hourTemps = document.querySelectorAll('.hourTemp');
const cloudHours = document.querySelectorAll('.cloud-hour')

const cloudsAndRain = {
    'few clouds':'fewClouds.jpg', 'scattered clouds':'scatteredClouds.jpg', 'clear sky':'clearSky.jpeg', 'overcast clouds':'darkClouds.jpeg',
    'light rain':'droprain.png', 'moderate rain':'droprain.png','shower rain':'rains.png','light intensity drizzle rain':'rains.png', 'heavy intensity rain': 'rains.png',
    'broken clouds':'brokenClouds.jpeg', 'light intensity shower rain':'rains.png', 'night':'nightSky.jpeg', 'nightWide':'nightSkyWide.jpeg', 'thunderstorm':'storm.jpg', 'haze':'haze.jpg'
    
}

const daysOfTheWeek = {
    '0':'Niedziela', '1':'Poniedziałek', '2':'Wtorek', '3':'Środa', '4':'Czwartek', '5':'Piątek', '6':'Sobota', '7':'Niedziela'
}

const cloudsInMain = {
    'clear sky':'fa-sun', 'light rain':'fa-cloud-rain', 'few clouds':'fa-cloud-sun', 'moderate rain':'fa-cloud-showers-heavy', 'broken clouds':'fa-cloud', 'scattered clouds':'fa-cloud-sun', 'few clouds':'fa-cloud-sun', 'overcast clouds':'fa-cloud', 'heavy intensity rain':'fa-cloud-showers-heavy'
}
const style = document.head.appendChild(document.createElement("style"));
let customize;


const calculateByName = (city)=>{

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=86ccf0dc68b8c1df51843f8e9bf5244f`)
    .then(res => res.json())
    .then(data =>{
        calculate(data, city);
    })
}

const calculateBylatlon = (szerokosc, dlugosc)=>{
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${szerokosc}&lon=${dlugosc}&appid=86ccf0dc68b8c1df51843f8e9bf5244f`)
    .then(res => res.json())
    .then(data =>{
        const city = data.name;
        calculate(data, city);
    })
}

const calculate = (data, city)=>{

    let widthOutput = window.innerWidth;

    window.removeEventListener('resize', customize);

    console.log(data);
    const sunRise = data.sys.sunrise;
    const sunRiseInMili = sunRise * 1000;

    const sunSet = data.sys.sunset;
    const sunSetInMili = sunSet * 1000;

    const sunSetDate = new Date (sunSetInMili); // data zachodu słońca
    const sunRiseDate = new Date(sunRiseInMili); // data wschodu słońca

    const differenceBetweenSetAndRise = sunSetDate - sunRiseDate; // Różnica pomiędzy zachodem, a wschodem słońca

    const nowTime = new Date(); // Obecna data i godzina
  
    const toRise = nowTime - sunRiseInMili;
    const toSet = nowTime - sunSetInMili;

    const sumTimeToRiseAndSet = Math.abs(toRise + toSet); // Suma czasu obecnego do wschodu i do zachodu słońca - wartość bezwzględna

    const typeOfCloudsAndRain = data.weather[0].description; // Rodzaj chmury i rodzaj deszczu


    assignPropertyTimeOfDayAndWeather(sumTimeToRiseAndSet, differenceBetweenSetAndRise,typeOfCloudsAndRain, widthOutput);


    const tempInCalvin = parseInt(data.main.temp);
    const tempInCelsius = fromCalvinToCelcius(tempInCalvin);

    assignToHtml(cityNameH1, city);
    assignToHtml(temph2, tempInCelsius);

    let tempFeelsLike = parseInt(data.main.feels_like);
    tempFeelsLike = fromCalvinToCelcius(tempFeelsLike);
    assignToHtml(feelsLikeSpan, tempFeelsLike);

    const humidity = parseInt(data.main.humidity);
    assignToHtml(humiditySpan, humidity);

    const pressure = parseInt(data.main.pressure)
    assignToHtml(pressureSpan, pressure);

    const windSpeed = data.wind.speed;
    assignToHtml(windSpan, windSpeed);

    calculateHourlyAndDailyWeather(data,nowTime)
}


const calculateHourlyAndDailyWeather = (data,nowTime)=>{
  

    const latitude = data.coord.lat; //szerokość geograficzna
    const longitude = data.coord.lon;//długość geograficzna
    // console.log(latitude, longitude);

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&
    exclude={part}&appid=86ccf0dc68b8c1df51843f8e9bf5244f`)
    .then(res => res.json())
    .then(data =>{
        console.log(data);
        calculateDailyWeather(data,nowTime); // Obliczanie pogody na kolejne dni
        calculateHourlyWeather(data); // Obliczanie pogody na kolejne godziny

   
    })
}

const calculateHourlyWeather = (data)=>{
    for(const cloud of cloudHours){       
        cloud.className = "cloud fas";
    }
    let k = 0;
    for(let i=1; i<13; i=i+2){
        const hourlyInMili = (data.hourly[i].dt)*1000;
        const hourlyTemp = parseInt(fromCalvinToCelcius(data.hourly[i].temp)); // godzinowa temperatura zamieniona z kalvinów na celciusze
        const hourlyCloud = data.hourly[i].weather[0].description; // Pobranie rodzaju pogody
        // console.log(hourlyCloud)
        const nextTime = new Date(hourlyInMili);
        const getHoursNextTime = nextTime.getHours()+':00';
     

        hourNames[k].textContent = getHoursNextTime;
        cloudHours[k].classList.add(`${cloudsInMain[hourlyCloud]}`);
        hourTemps[k].textContent = hourlyTemp;
        k++;
        
    }
}

const calculateDailyWeather = (data, nowTime)=>{
    let dayOfTheWeek = nowTime.getDay()+1;

    for(const cloud of clouds){        
        cloud.className = "cloud fas";
    }
    for(const dayName of daysName){ //Przypisanie nazwy dni tygodnia
        dayName.textContent = daysOfTheWeek[dayOfTheWeek];
        dayOfTheWeek++;
    }
    for(let i=0; i<3; i++){
        const dailyTemp = parseInt(fromCalvinToCelcius(data.daily[i].temp.day)); // Przypisanie odpowiedniej temperatury i pogody na kolejne 3 dni
        tempMain[i].textContent = dailyTemp;

        const dailyCloud = data.daily[i].weather[0].description;
        clouds[i].classList.add(`${cloudsInMain[dailyCloud]}`);
    }
}

const assignPropertyTimeOfDayAndWeather = (sumTimeToRiseAndSet, differenceBetweenSetAndRise, typeOfCloudsAndRain, widthOutput)=>{
  
    if(sumTimeToRiseAndSet > differenceBetweenSetAndRise){  // jeśli warunek się spełni wtedy jest noc
        
            if (widthOutput <= 1004) { // zmiana obrazu tła w nocy gdy szerokość ekranu jest mniejszą bądź większa
                style.innerHTML = `header::after {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain['night']}) center no-repeat; background-size: cover; opacity: 1;} header::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat; background-size: cover; z-index: 1; opacity: .3}`;
            } else if(widthOutput > 1004){
                style.innerHTML = `header::after {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain['nightWide']}) center no-repeat; background-size: cover; opacity: 1;} header::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat; background-size: cover; z-index: 1; opacity: .3}`;
            }
             
            customize = () => customizeBackground(typeOfCloudsAndRain)
        window.addEventListener("resize", customize)//funkcja która dostosowuje tło nocnego nieba do zmiany szerokości okna||obraz tła musiał zostać obrócony o 90 stopni ponieważ na szerszych ekranach jego rozdzielcczosc była zbyt niska
        if(typeOfCloudsAndRain === 'light rain'|| typeOfCloudsAndRain === 'light intensity shower rain'||typeOfCloudsAndRain==='moderate rain'|| typeOfCloudsAndRain === 'light intensity drizzle rain'|| typeOfCloudsAndRain === 'shower rain'){
            header.style.background = `url(imgs/darkClouds.jpeg) center no-repeat`;
            header.style.backgroundSize = "cover";
            
        }else{
            header.style.background = `url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat`;
            header.style.backgroundSize = "cover";
        }

        
    }else{ // dzień
        header.style.background = `url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat`;
        header.style.backgroundSize = "cover";
        style.innerHTML = "";

        if(typeOfCloudsAndRain === 'light rain' || typeOfCloudsAndRain === 'moderate rain' || typeOfCloudsAndRain === 'shower rain' || typeOfCloudsAndRain === 'light intensity drizzle rain'|| typeOfCloudsAndRain === 'light intensity shower rain' || typeOfCloudsAndRain === 'haze' || typeOfCloudsAndRain === 'heavy intensity rain'){
            rain(typeOfCloudsAndRain);
        }else if(typeOfCloudsAndRain === 'thunderstorm'){
            style.innerHTML = `header::before {content: ''; position:fixed; left:0;; top:0;; width:100%; height:100%; background: url(imgs/droprain.png) center no-repeat; background-size: cover; z-index: -1; opacity: .4;}`;
        }
    }
}

const customizeBackground = (typeOfCloudsAndRain)=>{
        if (window.matchMedia("(max-width: 1003px)").matches) {
            style.innerHTML = `header::after {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain['night']}) center no-repeat; background-size: cover; opacity: 1;} header::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat; background-size: cover; z-index: 1; opacity: .4}`;
        } else {
            style.innerHTML = `header::after {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain['nightWide']}) center no-repeat; background-size: cover; opacity: 1;} header::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfCloudsAndRain]}) center no-repeat; background-size: cover; z-index: 1; opacity: .4}`;
        }
}

const rain =(typeOfRain)=>{
    style.innerHTML = `header::before {content: ''; position:absolute; left:0;; top:0;; width:100%; height:100%; background: url(imgs/${cloudsAndRain[typeOfRain]}) center no-repeat; background-size: cover;}`;
    header.style.background = `url(imgs/darkClouds.jpeg) center no-repeat`;
    header.style.backgroundSize = "cover";
}
const enterCheck = ()=>{
    if(event.keyCode === 13){
        const cityInputValue = cityInput.value;

        calculateByName(cityInputValue);
    }
}

const fromCalvinToCelcius = (calvin)=>{
    return calvin - 273;

}

const assignToHtml = (place, value)=>{
    place.textContent = value;
    cityInput.value = "";
}

const getInputValue = ()=>{
    const cityInputValue = cityInput.value;
    calculateByName(cityInputValue);
}

const getLocalization = ()=>{
    var geo = navigator.geolocation;
    // console.log(geo);

if(geo) {
  geo.getCurrentPosition(function(location) {
    // console.log('Szerokość ' + location.coords.latitude);
    // console.log('Długość ' + location.coords.longitude);
    const szerokośćGeo = location.coords.latitude;
    const dlugoscGeo = location.coords.longitude;

    calculateBylatlon(szerokośćGeo, dlugoscGeo);

  });
}

calculateByName('Warszawa');

  
}
cityInput.addEventListener('keyup', enterCheck)
searchBtn.addEventListener('click',getInputValue) // 
getLocalization(); // funkcja pobiera lokalizacje użytkownika. Jeśli ten zgodzi się na udostępnienie lokalizacji, program ustali pogode dla jego lokalizacji, jeśli się nie zgodzi domyślnie pierwszym wyszukaniem będzie Warszawa.

