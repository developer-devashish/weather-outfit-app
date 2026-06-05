async function getWeather(){

    const city = document.getElementById("city").value;

    const error =
    document.getElementById("error");

    const weatherCard =
    document.getElementById("weatherCard");

    const forecastContainer =
    document.getElementById("forecastContainer");

    error.innerHTML = "";

    /* EMPTY INPUT */

    if(city.trim() === ""){

        error.innerHTML =
        "Please enter a city name";

        weatherCard.style.display = "none";

        return;
    }

    try{

        const response = await fetch("/weather", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                city:city
            })
        });

        const data = await response.json();

        console.log(data);

        /* ERROR HANDLING */

        if(data.error){

            error.innerHTML = data.error;

            weatherCard.style.display = "none";

            return;
        }

        /* WEATHER DETAILS */

        document.getElementById("cityName").innerHTML =
        data.city;

        document.getElementById("temp").innerHTML =
        data.temperature;

        document.getElementById("condition").innerHTML =
        data.condition;

        document.getElementById("humidity").innerHTML =
        data.humidity;

        document.getElementById("wind").innerHTML =
        data.wind;

        document.getElementById("recommendation").innerHTML =
        data.recommendation;

        /* WEATHER CONDITION */

        const condition =
        data.condition.toLowerCase();

        /* SAVE SEARCH */

        saveSearch(data.city);

        /* RESET BODY */

        document.body.className = "";

        /* WEATHER ICON */

        const icon =
        document.getElementById("weatherIcon");

        icon.className = "wi";

        if(condition.includes("sun") ||
           condition.includes("clear")){

            icon.classList.add("wi-day-sunny");

            document.body.classList.add("sunny");
        }

        else if(condition.includes("cloud")){

            icon.classList.add("wi-cloudy");

            document.body.classList.add("cloudy");
        }

        else if(condition.includes("rain")){

            icon.classList.add("wi-rain");

            document.body.classList.add("rainy");
        }

        else if(condition.includes("snow")){

            icon.classList.add("wi-snow");

            document.body.classList.add("snowy");
        }

        else if(condition.includes("storm")){

            icon.classList.add("wi-thunderstorm");

            document.body.classList.add("rainy");
        }

        else{

            icon.classList.add("wi-day-cloudy");

            document.body.classList.add("clear");
        }

       /* OUTFIT CARD */

const outfitContainer =
document.getElementById("outfitContainer");

let outfitHTML = "";

const temp = data.temperature;

if(condition.includes("rain")){

    outfitHTML = `

        <div class="outfit-card">

            <img src="static/images/rainy-outfit.png">

            <h3>Rainy Outfit</h3>

            <p>
                Wear waterproof shoes,
                jacket and carry an umbrella.
            </p>

        </div>
    `;
}

else if(temp <= 15){

    outfitHTML = `

        <div class="outfit-card">

            <img src="https://cdn-icons-png.flaticon.com/512/2553/2553691.png">

            <h3>Winter Outfit</h3>

            <p>
                Wear a hoodie, jacket,
                boots and warm clothes.
            </p>

        </div>
    `;
}

else if(condition.includes("sun") ||
        condition.includes("clear")){

    outfitHTML = `

        <div class="outfit-card">

            <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png">

            <h3>Summer Outfit</h3>

            <p>
                Light cotton clothes,
                sunglasses and breathable wear.
            </p>

        </div>
    `;
}

else{

    outfitHTML = `

        <div class="outfit-card">

            <img src="https://cdn-icons-png.flaticon.com/512/892/892425.png">

            <h3>Casual Outfit</h3>

            <p>
                Comfortable casual clothing
                is perfect for today.
            </p>

        </div>
    `;
}

outfitContainer.innerHTML = outfitHTML;


        /* FORECAST SECTION */

        forecastContainer.innerHTML = "";

        if(data.forecast){

            data.forecast.forEach(day => {

                const iconUrl = day.icon
                ? (day.icon.startsWith("//")
                    ? "https:" + day.icon
                    : day.icon)
                : "";

                forecastContainer.innerHTML += `

                    <div class="forecast-card">

                        <h3>
                            ${new Date(day.date)
                            .toLocaleDateString('en-US', {
                                weekday:'short'
                            })}
                        </h3>

                        <img
                            src="${iconUrl}"
                            class="forecast-icon"
                            alt="weather"
                        >

                        <p>${day.temp}°C</p>

                        <p>${day.condition}</p>

                    </div>
                `;
            });
        }

        weatherCard.style.display = "block";

    }
    catch(err){

        console.error(err);

        error.innerHTML =
        "Something went wrong";

        weatherCard.style.display = "none";
    }
}

/* SAVE SEARCH */

function saveSearch(city){

    let searches =
    JSON.parse(
        localStorage.getItem("weatherSearches")
    ) || [];

    /* REMOVE DUPLICATES */

    searches = searches.filter(item =>
        item.toLowerCase() !== city.toLowerCase()
    );

    /* ADD NEW SEARCH */

    searches.unshift(city);

    /* LIMIT TO 5 */

    searches = searches.slice(0,5);

    localStorage.setItem(
        "weatherSearches",
        JSON.stringify(searches)
    );

    displaySearchHistory();
}

/* DISPLAY SEARCH HISTORY */

function displaySearchHistory(){

    const searchHistory =
    document.getElementById("searchHistory");

    if(!searchHistory) return;

    searchHistory.innerHTML = "";

    const searches =
    JSON.parse(
        localStorage.getItem("weatherSearches")
    ) || [];

    searches.forEach(city => {

        searchHistory.innerHTML += `

            <div class="history-item"
                 onclick="searchFromHistory('${city}')">

                ${city}

            </div>
        `;
    });
}

/* SEARCH AGAIN */

function searchFromHistory(city){

    document.getElementById("city").value = city;

    getWeather();
}



/* VOICE SEARCH */

function startVoiceSearch() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Voice search not supported");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onstart = () => {

        document.getElementById("voiceStatus").innerHTML =
            "🎤 Voice search started... Speak now";

        console.log("Voice recognition started");
    };

    recognition.onresult = (event) => {

        const transcript = event.results[0][0].transcript;

        document.getElementById("city").value = transcript;

        document.getElementById("voiceStatus").innerHTML =
            "✅ Voice captured: " + transcript;

        getWeather();
    };

    recognition.onerror = (event) => {

        document.getElementById("voiceStatus").innerHTML =
            "❌ Error: " + event.error;

        console.error(event.error);
    };

    recognition.onend = () => {

        setTimeout(() => {
            document.getElementById("voiceStatus").innerHTML = "";
        }, 3000);
    };
}

/* TOGGLE THEME */

function toggleTheme(){

    document.body.classList.toggle("light-mode");

    const themeBtn =
    document.getElementById("themeBtn");

    if(document.body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

        themeBtn.innerHTML = "☀️ Light Mode";
    }
    else{

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML = "🌙 Dark Mode";
    }
}

/* LOAD SAVED THEME */

function loadTheme(){

    const savedTheme =
    localStorage.getItem("theme");

    const themeBtn =
    document.getElementById("themeBtn");

    if(savedTheme === "light"){

        document.body.classList.add("light-mode");

        themeBtn.innerHTML = "☀️ Light Mode";
    }
}

/* PAGE LOAD */

window.onload = () => {

    displaySearchHistory();

    loadTheme();
};