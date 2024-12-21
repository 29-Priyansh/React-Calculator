import { useReducer } from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import './App.css'
import { ACTIONS } from './Actions'


function reducer(state, { type, payload } = {}) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes(".")) return state;
      return {
        ...state, currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null) return state;
      if(state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,

        }
      }
      if(state.currentOperand == null){
        return{
          ...state,
          operation: payload.operation,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if(state.currentOperand == null) return state;
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1) || null,
      };
    case ACTIONS.EVALUATE:
      if(state.currentOperand == null || state.previousOperand == null || state.operation == null) return state;
      return {
        ...state,
        currentOperand: evaluate(state),
        overwrite:true,
        previousOperand: null,
        operation: null,
      }
    default:
      return state;
  }
}

function evaluate({currentOperand,previousOperand,operation}){
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch(operation){
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
    default:
      return "";
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", {maximumFractionDigits: 0});

function formatOperation(operand){
  if(operand == null) return "";
  const [integer,decimal] = operand.split(".");
  if(decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  // const [count, setCount] = useState(0);

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  reducer({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } });
  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{formatOperation(previousOperand)} {operation}</div>
          <div className="current-operand">{formatOperation(currentOperand)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
        <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>{"<-"}</button>
        <OperationButton dispatch={dispatch} operation="/" />

        <DigitButton dispatch={dispatch} digit="1" />
        <DigitButton dispatch={dispatch} digit="2" />
        <DigitButton dispatch={dispatch} digit="3" />
        <OperationButton dispatch={dispatch} operation="*" />

        <DigitButton dispatch={dispatch} digit="4" />
        <DigitButton dispatch={dispatch} digit="5" />
        <DigitButton dispatch={dispatch} digit="6" />
        <OperationButton dispatch={dispatch} operation="+" />

        <DigitButton dispatch={dispatch} digit="7" />
        <DigitButton dispatch={dispatch} digit="8" />
        <DigitButton dispatch={dispatch} digit="9" />
        <OperationButton dispatch={dispatch} operation="-" />

        <DigitButton dispatch={dispatch} digit="." />
        <DigitButton dispatch={dispatch} digit="0" />

        <button className="span-two" onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
      </div>
    </>
  )
}

export default App
