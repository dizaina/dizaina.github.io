import { WiCloudyWindy, WiHumidity, WiStars } from "weather-icons-react";

 const TodayWeatherBody = ({weather}) => (
  <div className="flex justify-between mt-12">
  <div className="flex flex-col items-center">
    <span className="font-semibold text-lg">{Math.round(weather.main.humidity)}%</span>
    <WiHumidity size={32} color="#ccc" />
    <span className="text-xs font-semibold text-gray-400">Humidity</span>
  </div>
  <div className="flex flex-col items-center">
    <span className="font-semibold text-lg">{Math.round(weather.visibility)} mi </span>
    <WiStars size={32} ccolor="#ccc" />
    <span className="text-xs font-semibold text-gray-400">Visibility</span>
  </div>
  <div className="flex flex-col items-center">
    <span className="font-semibold text-lg">{Math.round(weather.wind.speed)} Km/h</span>
    <WiCloudyWindy size={32} color="#ccc" />
    <span className="text-xs font-semibold text-gray-400">Wind Speed</span>
  </div>
</div>
 )
export default TodayWeatherBody;

