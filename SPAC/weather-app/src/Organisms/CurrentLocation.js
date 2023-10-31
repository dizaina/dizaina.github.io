import React from "react";
import ApiKeys from "../API/ApiKeys";
import Clock from "react-live-clock";
import Forcast from "./Forcast";
import { dateBuilder, getIcons } from "../Utils/Utils";

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          this.getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }


  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };
  getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${ApiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${ApiKeys.key}`
    );
    const data = await api_call.json();
    this.setState({
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
    });
    this.setState(getIcons(this.state.main));
  };

  render() {
    if (this.state.temperatureC) {
      return (
        <React.Fragment>
          <div className="w-full max-w-screen-sm bg-black p-10 rounded-xl ring-8 ring-white text-white ring-opacity-40 mb-8">
            <div className="flex">
              <div className="w-9/12">
                <h2 className="text-base font-semibold leading-7 text-2xl">{this.state.city}, {this.state.country}</h2>
                <div className="text-4xl">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
            </div>

          </div>

          <Forcast icon={this.state.icon} weather={this.state.main} />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div className="w-full max-w-screen-sm bg-black p-10 rounded-xl ring-8 ring-white text-white ring-opacity-40 mb-8">
            <div className="flex">
              <div className="w-9/12">
                <h3 className="text-black text-xl font-bold">
                  Detecting your location
                </h3>
                <h3 className="mt-2">
                  Your current location wil be displayed on the App <br></br> & used
                  for calculating Real time weather.
                </h3>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default Weather;
