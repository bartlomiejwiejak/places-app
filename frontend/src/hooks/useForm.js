import { useCallback, useReducer } from 'react'

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        }
        else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid
          }
        },
        isValid: formIsValid
      }
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      }
    default: return state;
  }
}

function useForm(initialInputs, initialFormValidity) {

  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  })

  const inputChange = useCallback((inputId, value, isValid) => {
    dispatch({ type: 'INPUT_CHANGE', isValid: isValid, value: value, inputId: inputId })
  }, [])

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    })
  }, [])

  return [formState, inputChange, setFormData]
}

export default useForm
