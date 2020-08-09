import React from 'react'
import ReactDOM from 'react-dom';

function Backdrop({ onClick }) {
  return ReactDOM.createPortal(
    <div onClick={onClick} className="backdrop"></div>,
    document.getElementById('backdrop-hook')
  )
}

export default Backdrop
