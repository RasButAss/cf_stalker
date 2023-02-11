import { useState, useEffect } from 'react';
import './App.css';
import Table from './components/Table/Table';
import Error from './components/Error/Error'

const getResultArray = () => {
  const searchResult = localStorage.getItem('data');
  if(searchResult) {
    return JSON.parse(searchResult);
  } else {
    return [];
  }
}

const getHandle = () => {
  const handle = localStorage.getItem('handle');
  if(handle) {
    return handle;
  } else {
    return "";
  }
}

const getUpper = (check) => {
  const ans = JSON.parse(localStorage.getItem('rating'));
  if((ans[0] !== "") && (ans[1] !== "")) {
    if(check) {
      return Number(ans[1]);
    } else {
      return Number(ans[0]);
    }
  } else if ((ans[0] === "") || (ans[1] === "")) {
    if(check) {
      return 3000;
    } else {
      return 0;
    }
  }
} 

function App() {
  const [cfHandle, setCfHandle] = useState(getHandle());
  const [ratingLowerBound, setLowerBound] = useState(getUpper(false));
  const [ratingUpperBound, setUpperBound] = useState(getUpper(true));
  const [resultArray, setResultArray] = useState(getResultArray());
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
        localStorage.setItem('handle', cfHandle)
        localStorage.setItem('rating', JSON.stringify([ratingLowerBound, ratingUpperBound]))
        getsums(cfHandle, ratingLowerBound, ratingUpperBound);
      } else {
        setErr(true);
      }
    }
  },[cfHandle, ratingLowerBound, ratingUpperBound, count])
  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(resultArray));
  },[resultArray])
  function onSubmitHandler(e) {
    e.preventDefault();
    setCfHandle(e.target[0].value);
    if(e.target[1].value === "") {
      setLowerBound(0);
    } else {
      setLowerBound(e.target[1].value);
    }
    if(e.target[2].value === "") {
      setUpperBound(3000);
    } else {
      setUpperBound(e.target[2].value);
    }
    setCount(count + 1);
  }
  return (
    <div className="App">
      <div className="App-header">
        <h1 className='heading'>CF Stalker</h1>
        <form onSubmit={onSubmitHandler} action='/'>
          <input type='text' placeholder='Codeforces Handle' className='input' defaultValue={cfHandle}  />
          <input type='text' placeholder='rating lower bound' className='input' defaultValue={ratingLowerBound} />
          <input type='text' placeholder='rating upper bound' className='input' defaultValue={ratingUpperBound} />
          <button type="submit" value="Submit" className='submit-button'>Search</button>
        </form>
      </div>
      <Table isFound={resultArray.length !== 0 ? true : false} resultArray={resultArray} />
      <Error isErr={isErr} />
    </div>
  );
}

export default App;
