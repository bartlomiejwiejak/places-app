import React, { useReducer } from 'react'

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: true
      };
    default: return state;
  }
}

function Input({ label, id, element, type, placeholder, rows, errorText }) {
  const [inputState, dispatch] = useReducer(inputReducer, { value: '', isValid: false });

  const changeHandler = event => {
    dispatch({ type: 'CHANGE', val: event.target.value })
  }

  const content = element === 'input' ? <input onChange={changeHandler} value={inputState.value} id={id} type={type} placeholder={placeholder} /> : <textarea value={inputState.value} onChange={changeHandler} id={id} rows={rows || 3} />

  return (
    <div className={`form-control ${!inputState.isValid && 'form-control--invalid'}`}>
      <label htmlFor={id}>{label}</label>
      {content}
      {!inputState.isValid && <p>{errorText}</p>}
    </div>
  )
}

export default Input
