import React from 'react'
import ReactDOM from 'react-dom';

function Sidedrawer({ children }) {

  const content = <aside className='side-drawer'>{children}</aside>

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'))
}

export default Sidedrawer
