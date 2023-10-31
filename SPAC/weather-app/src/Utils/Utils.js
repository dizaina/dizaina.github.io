import { months,days,shortMonths,shortDays } from "../Constants/Constants";
export const dateBuilder = (d) => {
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day}, ${date} ${month} ${year}`;
  };

  export const dateForcastBuilder = (d) => {
    let day = shortDays[d.getDay()];
    let date = d.getDate();
    let month = shortMonths[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day}, ${date} ${month}`;
  };

  export const  getIcons=(iconName)=>{
    switch (iconName) {
        case "Haze":
         return{ icon: "CLEAR_DAY" };
        case "Clouds":
          return { icon: "CLOUDY" };
        case "Rain":
          return{ icon: "RAIN" };
        case "Snow":
          return { icon: "SNOW" };
        case "Dust":
          return { icon: "WIND" };
        case "Drizzle":
          return{ icon: "SLEET" };
        case "Fog":
          return{ icon: "FOG" };
        case "Smoke":
         return { icon: "FOG" };
        case "Tornado":
         return { icon: "WIND" };
        default:
          return { icon: "CLEAR_DAY" };
      }
  }

