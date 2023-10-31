import { defaults } from "../Constants/Constants";
import ReactAnimatedWeather from "react-animated-weather";

 const TodayWeatherHeader = ({weather,icon}) => (
    <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-6xl font-bold">{Math.round(weather.main.temp)}°c </span>
              <div className="font-semibold mt-1 text-gray-500 text-xl mb-2">{weather.name}, {weather.sys.country}</div>
              <div className="font-semibold mt-1 text-gray-500 text-sm flex items-center">
              {weather.weather[0].main}
              <img
                className="inline-flex"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt="openApp"
              /></div>
            </div>
            <div >
              <ReactAnimatedWeather
                icon={icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
            </div>
          </div>
 )
export default TodayWeatherHeader;

