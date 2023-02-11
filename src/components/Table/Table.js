import React from 'react'

const Table = ({isFound, resultArray}) => {
  if(isFound) {
    return (
      <div className="table-body">
        <table className="result-table" >
          <thead>
            <tr>
              <th>Index</th>
              <th>Name</th>
              <th>Rating</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {
              resultArray.length !== 0 ?
                (
                  resultArray.map((e, i) => {
                    return (
                      <tr key={i} onClick={(event) => {window.open("https://codeforces.com/contest/"+e.contestId+"/problem/"+e.problem.index,"_blank")}} className="problem-links">
                        <th>{i + 1}</th>
                        <th>{e.problem.name}</th>
                        <th>{e.problem.rating}</th>
                        <th>{e.problem.index}</th>
                      </tr>
                    )
                  })
                ) : null
            }
          </tbody>
        </table>
      </div>
    )
  }
  return null;
}

export default Table