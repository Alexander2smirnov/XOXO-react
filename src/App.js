import { useState } from 'react';
import applyWin from './applyWin';
import { increaseFieldX, increaseFieldY } from './increaseField';
import initialField from './initialField';
import checkWin from './checkWin';
import Field from './Field';
import './App.css';

const baseSizeX = 20;
const baseSizeY = 20;

function App() {
   const [endGame, setEndGame] = useState(false);
   const [field, setField] = useState(initialField(baseSizeX, baseSizeY));  
   const [turn, setTurn] = useState(1);

   const [winAmount, setWinAmount] = useState(5);
   const [temporalInput, setTemporalInput] = useState();

   const clickHandler = (x, y) => {
      if (endGame) {
         setField(initialField(baseSizeX,baseSizeY));
         setTurn(1);
         setEndGame(false);
      } 
      else {
         let result = null;
         const fieldAfterTurn = field.map((tr, ind) => {
            if (ind !== y) return tr;
            else return tr.map((td, ind) => {
               if (ind !== x) return td;
               else if (td.value === null) { 
                  result = turn;
                  setTurn ((turn + 1)%2);
                  return {value:turn, win:false};
               }  
               else return td;
            })
         })

         if (result !== null) {
            const isWin = checkWin(fieldAfterTurn, x, y, turn, winAmount);
            let afterWinCheck = fieldAfterTurn;

            if (isWin) {
               setEndGame(true);
               afterWinCheck = applyWin(isWin, fieldAfterTurn); 
            } 

            const afterXIncrease = increaseFieldX(afterWinCheck, x);
            const afterYIncrease = increaseFieldY (afterXIncrease.field, y);
            setField(afterYIncrease.field);
         }
         return turn;
      }
   }

   const keyUpHandler = (event) => {
      if (event.key === 'Enter') {
         applyWinAmount();      
      }
   }

   const applyWinAmount = () => {
      const newWin = parseInt(temporalInput);
         if (newWin > 2) {
            setWinAmount(newWin);
            setTemporalInput('');
            if (newWin !== winAmount) {
               setField(initialField(baseSizeX,baseSizeY));
               setTurn(1);
               setEndGame(false);
            }
         }
         else {
            setTemporalInput('');
            alert('Пожалуйста, введите число не меньше трех');
         }
   }

   return (
      <div className="App">
         <h1 className='title'>Крестики-нолики на бесконечном поле</h1>
         <div className='wrap-input__win-amount'>
            <input 
               className='input input__win-amount' 
               placeholder='Сколько ячеек для победы?'
               onKeyUp={keyUpHandler}
               onChange={(event) => setTemporalInput(event.target.value)}
               value={temporalInput}
            />
            <button 
               className='button button-input__win-amount'
               onClick={() => applyWinAmount()}
            >
               Ok
            </button>
         </div>
         
         <h2 
            className={'endgame-header-' + endGame}
         >
            {turn === 0?'Крестики выиграли! ':'Нолики выиграли! '} 
            Нажмите на поле для старта новой игры.
         </h2>

         <h3 
            className={'win-amount-header'}
         >
            Для победы нужно собрать: {winAmount} ячеек в ряд
         </h3>
         
         <h3 
            className={'turn-header-' + endGame}
         >
            Ходят: {turn === 0 ? 'Нолики':'Крестики'}
         </h3>
         
         <Field
               field={field}
               clickHandler={(x, y) => clickHandler(x, y)}
         />
      </div>
   );
}

export default App;

