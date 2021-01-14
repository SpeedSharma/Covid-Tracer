import React,{useState,useEffect} from 'react' 
import './App.css';
import {MenuItem,FormControl, Select,Card, CardContent} from '@material-ui/core'
import InfoBox from './InfoBox';
import Map  from './Map'; 
import Table from './Table';
import { sortData } from './util';
import LineGraph from './LineGraph'
import 'leaflet/dist/leaflet.css'

function App() {

  const [states, setStates] = useState([])
  const [worldwide, setWorldWide] = useState('worldwide')
  const [stateInfo, setStateInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = 
  useState({ lat: 21.0000, lng: 78.0000 })
  const [mapZoom, setMapZoom] = useState(5)
  const [mapStates, setMapStates] = useState([])

  const API = 'https://disease.sh/v3/covid-19/gov/India'


  useEffect(() => {
       const getStateData = async () => {
        await fetch(API)
        .then(res => res.json())
        .then(data => {
          const stateData = data.states.map((state) => ({
            state: state.state,
            cases: state.cases,
          }))

          const sortedData = sortData(stateData)
          setTableData(sortedData)
          setStates(stateData)
          setMapStates(data)
        })
       }
       getStateData()

       // default displayed data
       fetch('https://disease.sh/v3/covid-19/all')
       .then(res => res.json())
       .then(data => {
         setStateInfo(data)
       })
  },[])

    const onStateChange = async (event) => {
      const stateName = event.target.value;
      
    let url = '';

    if(stateName === 'worldwide'){
      url = 'https://disease.sh/v3/covid-19/all'

      await fetch(url)
      .then(res => res.json())
      .then(data => {
        setWorldWide(stateName)
        setStateInfo(data)
      })
    } else {
      url = API 

      await fetch(url)
      .then(res => res.json())
      .then(data => {
        setWorldWide(stateName)
        let newState = data.states.filter( 
          eachObj => eachObj.state === stateName); 
        setStateInfo(newState[0])
        setMapCenter( 56.9814,  254.568)
        setMapZoom(4.5)
      })
    }
 }

  return (
    <div className="app">
     <div className="app-left">
     <div className="app-header">
      <h1>Covid Tracer</h1>
    <FormControl>
      <Select variant='outlined' value={worldwide} onChange={onStateChange}>
      <MenuItem value='worldwide'>WorldWide</MenuItem> 
    {states.map( state => <MenuItem value={state.state}>{state.state}</MenuItem> )}
      </Select>
    </FormControl>
      </div>

    <div className="app-stats">
    <InfoBox 
    title='Coronavirus Cases' 
    cases={stateInfo.todayCases}
    total={stateInfo.cases}
    />
      <InfoBox 
      title='Recovered' 
      cases={stateInfo.todayRecovered} 
      total={stateInfo.recovered}
      />
      <InfoBox 
      title='Deaths' 
      cases={stateInfo.todayDeaths} 
      total={stateInfo.deaths}
      />
    </div>

    <Map  states={mapStates} center= {mapCenter} zoom={mapZoom} />

     </div>
     <Card className="app-right">
    <CardContent>
      <h3>Live Cases by States</h3>
    <Table states = {tableData} />
      <h3>WorldWide New Cases</h3>
      <LineGraph />
      <LineGraph casesType='recovered'/>
      <LineGraph casesType='deaths'/>

    </CardContent>
     </Card>
    </div>
  );
}

export default App;
