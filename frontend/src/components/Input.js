import React, { useReducer } from 'react'
import { validate } from '../functions/validators';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true
      }
    default: return state;
  }
}

function Input({ label, id, element, type, placeholder, rows, errorText, validators }) {
  const [inputState, dispatch] = useReducer(inputReducer, { value: '', isValid: false, isTouched: false });

  const changeHandler = event => {
    dispatch({ type: 'CHANGE', val: event.target.value, validators: validators })
  }

  const touchHandler = () => {
    dispatch({ type: 'TOUCH' })
  }

  const content = element === 'input' ? <input onBlur={touchHandler} onChange={changeHandler} value={inputState.value} id={id} type={type} placeholder={placeholder} /> : <textarea onBlur={touchHandler} value={inputState.value} onChange={changeHandler} id={id} rows={rows || 3} />

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
      <label htmlFor={id}>{label}</label>
      {content}
      {!inputState.isValid && inputState.isTouched && <p>{errorText}</p>}
    </div>
  )
}

export default Input
