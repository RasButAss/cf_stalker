import { useState, useEffect } from 'react';
import './App.css';
import Table from './components/Table/Table';
import Error from './components/Error/Error'

function App() {
  const [cfHandle, setCfHandle] = useState("");
  const [ratingLowerBound, setLowerBound] = useState(0);
  const [ratingUpperBound, setUpperBound] = useState(3000);
  const [resultArray, setResultArray] = useState([]);
  const [isErr, setErr] = useState(false);
  const [count, setCount] = useState(0);
  async function getsums(handle, a, b) {
    try {
      const data = await fetch('https://codeforces.com/api/user.status?handle=' + handle);
      if(data.ok) {
        const result_data = await data.json();
        if(result_data.status === "OK") {
          const result = result_data.result;
          const want = result.filter((element) => {
            if ((element.problem.rating >= a) && (element.problem.rating <= b)) {
              if (element.verdict === 'OK') {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          })
          setResultArray(want);
        } else if (result_data.status === "FAILED") {
          setErr(true);
        }
      } else {
        setErr(true);
        throw new Error("HTTP status" + data.status);
      }
    } catch(err) {
      setErr(true);
      console.log(err);
    }
  }
  useEffect(() => {
    // console.log(cfHandle)
    // console.log(ratingLowerBound)
    // console.log(ratingUpperBound)
    if(count !== 0) {
      if(cfHandle.length !== 0) {
        setErr(false);
        getsums(cfHandle, ratingLowerBound, ratingUpperBound);
      } else {
        setErr(true);
      }
    }
  },[cfHandle, ratingLowerBound, ratingUpperBound, count])
  function onSubmitHandler(e) {
    e.preventDefault();
    setCfHandle(e.target[0].value);
    setLowerBound(e.target[1].value);
    setUpperBound(e.target[2].value);
    setCount(count + 1);
  }
  return (
    <div className="App">
      <div className="App-header">
        <h1 className='heading'>CF Stalker</h1>
        <form onSubmit={onSubmitHandler} action='/'>
          <input type='text' placeholder='Codeforces Handle' className='input'  />
          <input type='text' placeholder='rating lower bound' className='input' />
          <input type='text' placeholder='rating upper bound' className='input' />
          <button type="submit" value="Submit" className='submit-button'>Search</button>
        </form>
      </div>
      <Table isFound={resultArray.length !== 0 ? true : false} resultArray={resultArray} />
      <Error isErr={isErr} />
    </div>
  );
}

export default App;
