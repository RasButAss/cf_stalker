import React from 'react'

const Error = ({isErr}) => {
  if(isErr) {
    return (
      <div>
        <h1 className='error-texts'>
          Tu thoda sa Betichod h kya? Sahi handle daal chup chaap.
        </h1>
      </div>
    )
  } else {
    return null;
  }
}

export default Error