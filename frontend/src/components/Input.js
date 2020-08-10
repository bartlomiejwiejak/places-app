import React from 'react'

function Input({ label, id, element, type, placeholder, rows }) {

  const content = element === 'input' ? <input id={id} type={type} placeholder={placeholder} /> : <textarea id={id} rows={rows || 3} />

  return (
    <div className={`form-control`}>
      <label htmlFor={id}>{label}</label>
      {content}
    </div>
  )
}

export default Input
