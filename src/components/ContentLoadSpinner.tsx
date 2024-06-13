import React from 'react'

export default function ContentLoadSpinner(props:{loading:boolean,classProperties?:string,style?:Object}){
  return (
    <div className={`${props.loading? "d-flex":"d-none"} content-load-spinner justify-content-center col-md-8 ${props.classProperties}`} style={props.style}>
        <div className="spinner-grow text-primary" role="status">
  <span className="visually-hidden">Loading...</span>
</div>
<div className="spinner-grow text-secondary" role="status">
  <span className="visually-hidden">Loading...</span>
</div>
<div className="spinner-grow text-success" role="status">
  <span className="visually-hidden">Loading...</span>
</div>
<div className="spinner-grow text-danger" role="status">
  <span className="visually-hidden">Loading...</span>
</div>
<div className="spinner-grow text-warning" role="status">
  <span className="visually-hidden">Loading...</span>
</div>
<div className="spinner-grow text-info" role="status">
  <span className="visually-hidden">Loading...</span>
</div>
    </div>
  )
}