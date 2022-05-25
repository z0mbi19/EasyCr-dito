import logo from './logo.svg';
import './App.css';
import Chart from 'react-google-charts';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Checkbox, FormControlLabel, InputLabel, MenuItem, Select, Slider } from '@mui/material';

function App() {
  const [covid, setCovid] = useState()
  const [variant, setVariant] = useState()
  const [select, setSelect] = useState("Alpha")
  const [date, setDate] = useState("2021-12-27")
  const [allDate, setAllDate] = useState()
  const [accumulated, setAccumulated] = useState(false)

  useEffect(() => {
    getCovid()
    getDate()
  }, [select, date, accumulated])

  const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };

  const getCovid = async () => {
    if (accumulated) {

      let { data } = await supabase
        .from('covid')
        .select()
        .lt("date", date)

      const groupByVariant = groupBy(data, "variant")

      setVariant(Object.keys(groupByVariant))

      const geo = [["Country", "Total"]]

      groupByVariant[select].forEach(element => {
        geo.push([element.location, element.num_sequences])
      });

      setCovid(geo)
    } else {
      let { data } = await supabase
        .from('covid')
        .select()
        .eq("date", date)

      const groupByVariant = groupBy(data, "variant")

      setVariant(Object.keys(groupByVariant))

      const geo = [["Country", "Total"]]

      groupByVariant[select].forEach(element => {
        geo.push([element.location, element.num_sequences])
      });

      setCovid(geo)
    }
  }

  const getDate = async () => {
    let { data } = await supabase
      .from('covid')
      .select("date")


    const groupByDate = groupBy(data, "date")

    setAllDate(Object.keys(groupByDate))

  }

  console.log(accumulated)

  return (
    <div className="App">
      <h1>Covid Daily Cases</h1>
      <InputLabel id="abel">Variant</InputLabel>
      <Select
        labelId="abel"
        id="able"
        value={select}
        label="Variant"
        onChange={(e) => setSelect(e.target.value)}
      >
        {variant && variant.map((v) => <MenuItem value={v}>{v}</MenuItem>)}
      </Select>

      <h3>Date: {date}</h3>
      <div style={{ width: "80%", margin: 10 }} >
        <Slider
          aria-label="Custom marks"
          defaultValue={20}
          max={allDate && allDate.length - 1}
          step={1}
          onChange={(e) => setDate(allDate[e.target.value])}
          valueLabelDisplay="auto"
          aria-labelledby="non-linear-slider"
        />
        <FormControlLabel control={<Checkbox value={accumulated} onChange={(e) => setAccumulated(!accumulated)} />} label="Accumulate to this date" />
      </div>
      <Chart
        chartType="GeoChart"
        width="100%"
        height="400px"
        data={covid}
      />
    </div>
  );
}

export default App;
