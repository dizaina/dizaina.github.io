import axios from 'axios';
import ApiKeys from './ApiKeys';


const axiosExtend = (URL) =>
    axios(URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        }
    })
        .then(response => {
            return response.data
        })
        .catch(error => {
            throw error;
        });

export const onCurrentWeather = (city, query) => {
    const URL = `${ApiKeys.base}weather?q=${city != "[object Object]" ? city : query
        }&units=metric&APPID=${ApiKeys.key}`
    return axiosExtend(URL)
};

export const onConsolidatedWeather = (city, query) => {
    const URL = `${ApiKeys.base}forecast?q=${city != "[object Object]" ? city : query
        }&units=metric&APPID=${ApiKeys.key}`;
    return axiosExtend(URL)
};