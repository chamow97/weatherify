
const getOpenWeatherUrl = (latitude, longitude, appId) => {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appId}`
}

const getSpotifyUrl = (searchTerm) => {
  return `https://open.spotify.com/search/${searchTerm}/tracks`
}

const weatherConditionLanguageMap = {
  Thunderstorm: {
    tamil: "ada mazhai"
  },
  Drizzle: {
    tamil: "thooral"
  },
  Rain: {
    tamil: "mazhai"
  },
  Snow: {
    tamil: "pani"
  },
  Clear: {
    tamil: "vaanam"
  },
  Clouds: {
    tamil: "megam"
  }
}

chrome.browserAction.onClicked.addListener(() => {
  let weatherCondition = "Clear"
  let searchTerm = "vaanam"

  if (navigator.geolocation) {
    let timeout = setTimeout("geoFailed()", 10000)
    let coord = navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Fetched the latitude longitude")
      clearTimeout(timeout)

      const weatherURL = getOpenWeatherUrl(position.coords.latitude, position.coords.longitude, "")

      fetch(weatherURL).then(data => data.text()).then(result => {
        console.log("Fetched the Weather Data for the current location")
        const resultAsJson = JSON.parse(result)
        if (resultAsJson.hasOwnProperty("weather") && resultAsJson["weather"].length > 0 && resultAsJson["weather"][0].hasOwnProperty("main")) {
          console.log(resultAsJson["weather"][0]["main"])
          weatherCondition = resultAsJson["weather"][0]["main"]
        }
      })

      console.log(weatherCondition)
      if (weatherConditionLanguageMap.hasOwnProperty(weatherCondition)) {
        searchTerm = weatherConditionLanguageMap[weatherCondition]["tamil"]
      }
      console.log("Opening Spotify URL")
      window.open(getSpotifyUrl(searchTerm), '_blank').focus()
    }, function (error) {
      clearTimeout(timeout)
      console.log("Error while fetching the location")
      // call geoFail
    })
  } else {
    console.log("Error while fetching the location")
    // call geoFail
  }
});
