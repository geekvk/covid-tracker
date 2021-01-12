import './App.css';
import { useEffect, useState } from 'react';
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import logo from "./Logo_CT.png";
import About from './About';

function App() {
  const[countries, setCountries] = useState([]); 
  const[country, setCountry] = useState('worldwide');
  const[countryInfo, setCountryInfo] = useState({});
  const[tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);
  // State -> How to write a variable in React setContries -> change countrirs value
  // UseEffect => Runs pieace of code based on given condition  as well [country] country variable changes 

  useEffect(() => {
      // async -> send a req to server then wait for it, do something with it
      const getCountriesData = async () => {
        await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name:country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries); 
        });
      };
      getCountriesData();
  }, []);

  const onCountryChanged = async(event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data); // all of the country data from the country response
      
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });

  };
  
  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
        <img src={logo} alt="" ></img>
        
        <FormControl className="app__dropdown">
            <Select  variant="outlined" 
            onChange={onCountryChanged}
            value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
        </FormControl>
        </div>
        {/**Info box */}
        <dev className="app__stats">
            <InfoBox  
                onClick={(e) => setCasesType("cases")}
                title="Cases" 
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={countryInfo.cases} 
                />
            <InfoBox
                onClick={(e) => setCasesType("recovered")}
                 title="Recoveries"
                cases={prettyPrintStat(countryInfo.todayRecovered)} 
                total={countryInfo.recovered} />
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={countryInfo.deaths} />
        </dev>
        <Map 
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}/>

      </div>
      <Card className="app__right">
        {/**Table */}
        {/**Graph */}
        <CardContent>
          <h3> Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3> Worldwide new {casesType}  </h3>
          <LineGraph casesType={casesType} />
        </CardContent>

      </Card>
      
      
      
      
    </div>
  );
}

export default App;
