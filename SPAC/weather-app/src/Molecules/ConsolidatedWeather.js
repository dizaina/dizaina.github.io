import { WiCloudyWindy, WiHumidity, WiStars } from "weather-icons-react";
import {dateForcastBuilder} from '../Utils/Utils';

 const consolidatedWeather = ({itm}) => (<div className="flex flex-col space-y-6 w-full max-w-screen-sm bg-white p-10 mt-10 rounded-xl ring-8 ring-white ring-opacity-40">
    <div className="flex justify-between mt-12">
        <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">{dateForcastBuilder(new Date(itm?.dt_txt))}</span>
            <div className="font-semibold mt-1 text-gray-500 text-sm flex items-center">
                {itm.weather[0].description}
                <img
                    className="inline-flex"
                    src={`https://openweathermap.org/img/wn/${itm.weather[0].icon}.png`}
                    alt="image"
                /></div>
            <span className="text-xs font-semibold ">{Math.round(itm.main.temp)}°c</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">{Math.round(itm.main.humidity)}%</span>
            <WiHumidity size={32} color="#ccc" />
            <span className="text-xs font-semibold text-gray-400">Humidity</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">{Math.round(itm.visibility)} mi </span>
            <WiStars size={32} ccolor="#ccc" />
            <span className="text-xs font-semibold text-gray-400">Visibility</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">{Math.round(itm.wind.speed)} Km/h</span>
            <WiCloudyWindy size={32} color="#ccc" />
            <span className="text-xs font-semibold text-gray-400">Wind Speed</span>
        </div>
    </div>
</div>)
export default consolidatedWeather;