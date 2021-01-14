import React, {useState, useEffect} from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
  legend: {
    display : false,
  },
  elements: {
    point: {
      radius: 3,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0")
      },
    },
  },
  scales: {
    xAxes: [
      {gridLines : {
        display: false,
      },
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines : {
          display: false,
        },
        
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a")
          },
        },
      },
    ],
  },
}

function LineGraph( {casesType = 'cases'} ) {


    const [data, setData] = useState({}) 

    useEffect(() => {

      const fetchData = async () => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=30')
        .then(res => res.json())
        .then(data => {
          const chartData = builldChartData(data,casesType)
          setData(chartData)
        })
      }
      fetchData()
    }, [])

    const builldChartData = (data, casesType) => {
      const chartData = []
      let lastDataPoint
     for(let date in data.cases) {
        if(lastDataPoint){
          const newDataPoint = {
            x: date,
            y: data[casesType][date] - lastDataPoint
          }
          chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date]
      }
      return chartData
    }


    return (
        <div>
          {data?.length > 0 && (
            <Line 
            options = {options}
            data= {{
              
              datasets: [
                {
                  backgroundColor:"#ef473a",
                  data: data,
                },
              ],
            }} />
          )}
          
            
        </div>
    )
}

export default LineGraph
