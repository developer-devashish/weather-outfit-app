from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("API_KEY")

def outfit_recommendation(temp, condition):

    condition = condition.lower()

    if "rain" in condition:
        return "🌧 Carry an umbrella and wear waterproof shoes."

    elif temp > 32:
        return "😎 Wear light cotton clothes and stay hydrated."

    elif temp < 15:
        return "🧥 Wear a hoodie or jacket."

    elif "cloud" in condition:
        return "☁ Full sleeves or casual outfit recommended."

    else:
        return "✅ Comfortable casual outfit is perfect."

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/weather", methods=["POST"])
def weather():

    city = request.json.get("city")

    url = f"https://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={city}&days=7&aqi=no&alerts=no"

    response = requests.get(url)

    data = response.json()

    if "error" in data:

        return jsonify({
            "error": data["error"]["message"]
        })

    temp = data["current"]["temp_c"]

    humidity = data["current"]["humidity"]

    wind = data["current"]["wind_kph"]

    condition = data["current"]["condition"]["text"]

    recommendation = outfit_recommendation(temp, condition)

    forecast_data = []

    for day in data["forecast"]["forecastday"]:
        forecast_data.append({

            "date": day.get("date"),

            "temp": day["day"].get("avgtemp_c"),

            "condition": day["day"]["condition"].get("text"),

            "icon": day["day"]["condition"].get("icon")
        })
        

    return jsonify({

        "city": data["location"]["name"],

        "temperature": temp,

        "condition": condition,

        "humidity": humidity,

        "wind": wind,

        "recommendation": recommendation,

        "forecast": forecast_data
    })

if __name__ == "__main__":
    app.run(debug=True)
    
