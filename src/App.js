import React, {useState, useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';
import Datepicker from './Datepicker/Datepicker'
import Map from './Map/Map'
import DisplayTable from './DisplayTable/DisplayTable';
import Barchart from './Barchart/Barchart'
import Modal from './Modal/Modal'

function App() {
  const [date, setDate] = useState();
  const [data, setData] = useState({});
  const [totals, setTotals] = useState({});
  const [display, setDisplay] = useState();
  const [pos, setPos] = useState('');
  const [modal, setModal] = useState(false);

  const getData = (date) => {
    fetch(`https://data.cdc.gov/resource/9mfq-cb36.json?submission_date=${date}`)
    .then(response => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`)
        return
      }
      response.json().then(data => {
          // form state data object into array
          let stateData = {}, sumDeaths = 0, sumCases = 0, highDeaths = 0, highCases = 0;
          const skipStates = ['AS','FSM','GU','PR','MP','PW','RMI']
          let valueRange = [];
          data.filter(x => !skipStates.includes(x.state)).forEach((x,i)=>{
            stateData[x.state] = {
              state: x.state,
              date: date,
              new: x.new_case,
              death: x.new_death,
              totalCases : x.tot_cases,
              totalDeath : x.tot_death
            }
            
            valueRange.push(parseInt(x.new_death));

            highDeaths = (parseInt(x.new_death) > highDeaths) ? parseInt(x.new_death) : highDeaths
            highCases = (parseInt(x.new_case) > highCases) ? parseInt(x.new_case) : highCases
            sumDeaths += parseInt(x.new_death)
            sumCases += parseInt(x.new_case)
          })
          
          // Combine NY and NYC data
          stateData['NY'] = {
            new: parseInt(stateData['NY'].new) + parseInt(stateData['NYC'].new),
            death: parseInt(stateData['NY'].death) + parseInt(stateData['NYC'].death),
            totalCases : parseInt(stateData['NY'].totalCases) + parseInt(stateData['NYC'].totalCases),
            totalDeath : parseInt(stateData['NY'].totalDeath) + parseInt(stateData['NYC'].totalDeath)
          }
          delete stateData['NYC']
          highDeaths = (stateData['NY'].death > highDeaths) ? stateData['NY'].death : highDeaths
          highCases = (stateData['NY'].new > highCases) ? stateData['NY'].new : highCases

          // Set state
          valueRange.sort(function(a, b) {
            return a - b;
          });
          
          setTotals({
            pos: valueRange,
            dailyDeathTotal: sumDeaths,
            dailyCaseTotal: sumCases,
            highCases: highCases,
            highDeaths: highDeaths,
            date:date
          })
          setData(stateData);
          
      })
    })
  }

  const formatNum = (num) => {
    return parseInt(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const getTodaysDate = () => {
      let today = new Date()
      today.setDate(today.getDate() - 2);
      today = today.toLocaleDateString().split('/')
      let todayFormatted = today[2] + '-' + (today[0].length === 1 ? "0" + today[0] : today[0]) + '-' + (today[1].length === 1 ? "0" + today[1] : today[1]);
      return todayFormatted;
  }

  useEffect(() => {
    if(!date){
      setDate(getTodaysDate())
    }
    getData(date);
  }, [date])

  const handlesubmit = (e) => {
    e.preventDefault();
    setDisplay()
    setDate(e.target[0].value)
  }

  const convertStateName = (state) => {
    const stateList = {
      'Arizona': 'AZ',
      'Alabama': 'AL',
      'Alaska':'AK',
      'Arkansas': 'AR',
      'California': 'CA',
      'Colorado': 'CO',
      'Connecticut': 'CT',
      'Delaware': 'DE',
      'Florida': 'FL',
      'Georgia': 'GA',
      'Hawaii': 'HI',
      'Idaho': 'ID',
      'Illinois': 'IL',
      'Indiana': 'IN',
      'Iowa': 'IA',
      'Kansas': 'KS',
      'Kentucky': 'KY',
      'Louisiana': 'LA',
      'Maine': 'ME',
      'Maryland': 'MD',
      'Massachusetts': 'MA',
      'Michigan': 'MI',
      'Minnesota': 'MN',
      'Mississippi': 'MS',
      'Missouri': 'MO',
      'Montana': 'MT',
      'Nebraska': 'NE',
      'Nevada': 'NV',
      'New Hampshire': 'NH',
      'New Jersey': 'NJ',
      'New Mexico': 'NM',
      'New York': 'NY',
      'North Carolina': 'NC',
      'North Dakota': 'ND',
      'Ohio': 'OH',
      'Oklahoma': 'OK',
      'Oregon': 'OR',
      'Pennsylvania': 'PA',
      'Rhode Island': 'RI',
      'South Carolina': 'SC',
      'South Dakota': 'SD',
      'Tennessee': 'TN',
      'Texas': 'TX',
      'Utah': 'UT',
      'Vermont': 'VT',
      'Virginia': 'VA',
      'Washington': 'WA',
      'West Virginia': 'WV',
      'Wisconsin': 'WI',
      'Wyoming': 'WY'
    }
    return stateList[state];
  }

  const mapClick = (e) => {
    setDisplay({
      state: e.target.id,
      data: data[convertStateName(e.target.id)]
    });
    setPos(convertStateName(e.target.id));
  }

  const modalClick = () => {
    if(modal){
      setModal(false)
    }else{
      setModal(true)
    }
    
  }

  return (
    <div className="App">
      <Datepicker handlesubmit={handlesubmit} date={date} getTodaysDate={getTodaysDate} totals={totals} formatNum={formatNum} modalClick={modalClick}/>
      
      {(() => {
        if (Object.keys(data).length !== 0) {
          return (
            <>
            <Map mapClick={mapClick} formatNum={formatNum} display={display} data={data} convertStateName={convertStateName} totals={totals}/>
            <DisplayTable formatNum={formatNum} data={data} pos={pos} totals={totals}/>
            <Barchart data={data} date={date}/>
            </>
         )
        } else {
          return <div style={{padding:"50px", fontSize:"28px"}}><strong>LOADING...</strong></div>
        }
      })()}

      {(() => {
        if (modal) {
          return (
            <Modal modalClick={modalClick}/>
          )
        }
      })()}
    </div>
  );
}

export default App;
