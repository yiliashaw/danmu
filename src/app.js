import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

const Counter = ({ value }) => {
  return (
    <div>
      <h1>{store.getState()}</h1>
      <button onClick={()=>store.dispatch({type:'INCREMENT'})}>+</button>
      <button onClick={()=>store.dispatch({type:'DECREMENT'})}>-</button>
    </div>
  )
};

// const App = () => {
//   return (
//     <div>
//       <p>hello world. </p>
//       <p>you sucks, but i still love you.</p>

//     </div>
//   )
// }

// export default App;



const render = () => {
  ReactDOM.render(<Counter />, document.getElementById('app'));
};

const reducer = (defaultState=0, action) => { 
  switch(action.type) {
    case 'INCREMENT': return defaultState + 1;
    case 'DECREMENT': return defaultState - 1;
    default: return defaultState;
  }
};

const store = createStore(reducer);

store.subscribe(render);

render();

