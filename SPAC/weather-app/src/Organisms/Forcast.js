import React, { useState, useEffect } from "react";
import { onCurrentWeather,onConsolidatedWeather } from "../API/WeatherAPI";
import ConsolidatedWeather  from "../Molecules/ConsolidatedWeather";
import TodayWeatherHeader from "../Molecules/TodayWeatherHeader";
import TodayWeatherBody from "../Molecules/TodayWeatherBody";

function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [consolidatedWeather, setconsolidatedWeather] = useState({});

  const search = (city) => {
    onCurrentWeather(city,query)
      .then((response) => {
        setWeather(response);
        setQuery("");
      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
    
      onConsolidatedWeather(city,query)
      .then((response) => {
        setconsolidatedWeather(response);
      })
      .catch(function (error) {
        console.log(error);
        setconsolidatedWeather("");
        setError({ message: "Not Found", query: query });
      });
  };

  
  useEffect(() => {
    search("Hyderabad");
  }, []);

  return (
    <>
      <div className="w-full max-w-screen-sm bg-white p-10 rounded-xl pb-5 ring-8 ring-white ring-opacity-40 mb-8">
        <h1 className="text-base font-semibold leading-7 text-gray-900">Search Any City</h1>
        <div className="mb-3">
          <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <input
              type="search"
              className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon1"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              />
            <button
              className="relative z-[2] flex items-center rounded-r  px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
              type="button"
              id="button-addon1"
              data-te-ripple-init
              data-te-ripple-color="light"
              onClick={search}
              style={{background:'purple'}}
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
      </div>
      {typeof weather?.main != "undefined" ?
        <div className="w-full max-w-screen-sm bg-white p-10 rounded-xl ring-8 ring-white ring-opacity-40">
          <TodayWeatherHeader weather={weather} icon={props.icon}/>
          <TodayWeatherBody weather={weather}/>
        </div> : <div>{error.query} {error.message}</div>}
      {consolidatedWeather?.list?.map(itm=>
          <ConsolidatedWeather itm={itm}/>
      )}
    </>
  );
}
export default Forcast;
