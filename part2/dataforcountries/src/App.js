import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({weather}) => {
  if (weather.length === 0) {
    return <div></div>
  }

  return (
  <div>
    <h2>Weather in {weather.name}</h2>
    <p>temperature {weather.main.temp} Celcius</p>
    <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.name} />
    <p>wind {weather.wind.speed} m/s</p>
  </div>
  )
}

const CountryView = ({ show, setFilter }) => {
  const country = show[0]
  const keys = Object.keys(country.languages)
  const [weather, setWeather] = useState([]) 

  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY
    const name = show[0].capital[0]
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${api_key}`)
    .then(res => {
      setWeather(res.data)
      setFilter('')
    })
  }, [])
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital: {country.capital}</p>
      <p>area: {country.area}</p>
      <h3>languages</h3>
      <ul>
        {keys.map(key => <li key={country.name}>{country.languages[key]}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.name} />
      <Weather weather={weather} country={country}/>
    </div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Country = ({ country, setShow }) => {
  const handleCountryView = () => {
    setShow([country])
  }
  return (
    <p>
      {country.name.common} <Button onClick={handleCountryView} text='show' />
    </p>
  )
}

const Display = ({ show, setShow, setFilter }) => {
  const length = show.length
  if (length === 1) {
    return <CountryView show={show} setFilter={setFilter} />
  }
  if (length < 10) {
    return (
      <div>
        {show.map(country => <Country key={country.name.common} country={country} setShow={setShow} />) }
      </div>
    )
  }
  return (
    <div>
      Too many matches, specify another filter
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [show, setShow] = useState([])

  useEffect(() => {
    axios
    .get('https://restcountries.com/v3.1/all')
    .then(res => {
      setCountries(res.data)
      setShow(res.data)
    })
  }, [])

  const handleFiltering = (event) => {
    const countryName = event.target.value
    setShow(countries.filter(country => country.name.common.toLowerCase().includes(countryName.toLowerCase())))
    setFilter(countryName)
  }
  
  return (
    <div>
      <p>find countries <input value={filter} onChange={handleFiltering} /> </p>
      <Display show={show} setShow={setShow} setFilter={setFilter} />
    </div>
  )
}

export default App