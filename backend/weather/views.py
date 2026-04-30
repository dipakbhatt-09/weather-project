from django.shortcuts import render
import requests
from django.http import JsonResponse

def weather_view(request):
    city = request.GET.get('city', 'Kathmandu')

    api_key = "df42d33cd8cb26bee9c2f3ed178722ef" 
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"

    response = requests.get(url)
    data = response.json()
    # safety check (important)
    if response.status_code != 200:
        return JsonResponse({
            "error": data.get("message", "Something went wrong")
        })

    result = {
        "city": city,
        "temperature": data["main"]["temp"],
        "description": data["weather"][0]["description"]
    }

    return JsonResponse(result)