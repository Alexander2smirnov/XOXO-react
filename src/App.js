import { useState } from 'react';
import './App.css';

const sM = 5;  //sizeMargin
const baseSizeX = 20;
const baseSizeY = 20;

let endGame = false;


function arrayNulls (size) {
  return new Array(size).fill({value:null, win:false});
}


function initialField (sizeX, sizeY) {
  const fieldTemp = [];
  for (let i=0; i<sizeY; i++){
    fieldTemp [i] = [];
    for (let j=0; j<sizeX; j++) {
      fieldTemp [i] [j] = {value:null, win: false};

    }
  }
return fieldTemp;
}

function App() {
  

  const [sizeX, setSizeX] = useState(baseSizeX);
  const [sizeY, setSizeY] = useState(baseSizeY);
  const [field, setField] = useState(initialField(baseSizeX, baseSizeY));  
  const [turn, setTurn] = useState(1);

  const [winAmount, setWinAmount] = useState(5);
  const [temporalInput, setTemporalInput] = useState();

  const clicked = (x, y) => {
    if (endGame) {
      setSizeX(baseSizeX);
      setSizeY(baseSizeY);
      setField(initialField(baseSizeX,baseSizeY));
      setTurn(1);
      endGame = false;
    }

    else {
      let result = null;
      const fieldAfterTurn = field.map((tr, ind) => {
        if (ind !== y) return tr;
        else return tr.map((td, ind) => {
          if (ind !== x) return td;
          else if (td.value === null) { 
            result = turn;
            // console.log(x +' '+ y);
            setTurn ((turn + 1)%2);
            return {value:turn, win:false};
            }  
          else return td;
        })
      })


      if (result !== null) {
        const ifWin = checkWin (fieldAfterTurn, x, y, turn);
        if (ifWin) {
          endGame = true;
          const afterWin = applyWin(ifWin, fieldAfterTurn);
          const afterXIncrease = increaseFieldX(afterWin, x)
          const afterYIncrease = increaseFieldY (afterXIncrease, y);
          setField(afterYIncrease);

        }
        else {const afterXIncrease = increaseFieldX(fieldAfterTurn, x)
          const afterYIncrease = increaseFieldY (afterXIncrease, y);
          setField(afterYIncrease);
        }
        
        
      }

      return turn;
  }
}
  

  const applyWin = (array, field) => {
    console.log(array);
    const result = field.map((tr, y) => {
      return tr.map((td, x) => {
        for (let a of array) {
          if (x === a[0] && y === a[1]) {
            const hooray = {value: td.value, win:true};
            //console.log(hooray);
            return hooray;
          }
        }
        return td;
      })
    })

    return result;
  };

  const increaseFieldX = (fieldAfterTurn, x) => {
    
    if (x < sM) {
      const newField = fieldAfterTurn.map(row => [...arrayNulls(sM-x), ...row])
      // console.log (newField);
      setSizeX(newField[0].length);
      return newField;
             
    }
    else if (x > sizeX-1-sM) {
      const newField = fieldAfterTurn.map(row => [...row, ...arrayNulls(x - sizeX + 1 + sM)])
      // console.log (newField);
      setSizeX(newField[0].length);
      return newField;
    }
    else return fieldAfterTurn;
  }

  const increaseFieldY = (fieldAfterIncreaseX, y) => {
    const newSizeX = fieldAfterIncreaseX[0].length;
    if (y < sM) {
      const newField = [...initialField (newSizeX, sM-y), ...fieldAfterIncreaseX];
      setSizeY(newField.length);
      return newField;
    } 
    else if (y > sizeY-1-sM) {
      const newField = [...fieldAfterIncreaseX, ...initialField(newSizeX, y-(sizeY-1-sM))];
      setSizeY(newField.length);
      return newField; 
    }
    else return fieldAfterIncreaseX;
  }

  const checkVector = (fieldBI, x, y, turn, vX, vY) => { //field before increase
    let count = 1;
    const result = [];
    while (
      y + count*vY < sizeY &&
      x + count*vX < sizeX &&
      x + count*vX >= 0 &&
      y + count*vY >= 0 &&
      fieldBI[y + count*vY][x + count*vX].value === turn
      ) {
        
      result.push([x + count*vX, y + count*vY]);
      count++;
    }
    return result; 
    
  };  

  const checkBothSidez = (fieldBI, x, y, turn, vX, vY) => {
    const plus = checkVector(fieldBI, x, y, turn, vX, vY);
    const minus = checkVector(fieldBI, x, y, turn, -vX, -vY);
    // console.log([...plus, ...minus]);
    return [...plus, ...minus];

  }


  const checkWin = (fieldBI, x, y, turn) => {
    const vectors = [
      [1, 1],
      [1, -1],
      [1, 0], 
      [0, -1]
    ]  
    let win = false;
    let result = [[x, y]];
    for (let v of vectors) {
      let vCheck = checkBothSidez (fieldBI, x, y, turn, ...v);
      if (vCheck.length >= winAmount-1) {
        result = [...result, ...vCheck];
        win = true;
      }
    }
    if (win === true) return result;
    else return false;
  }

  const ifEnter = (event) => {
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
            setSizeX(baseSizeX);
            setSizeY(baseSizeY);
            setField(initialField(baseSizeX,baseSizeY));
            setTurn(1);
            endGame = false;
          }
        }
        else {
          setTemporalInput('');
          alert('Введите число не меньше трех');

        }
    }


	return (
		<div className="App">
			<h1 className='title'>XOXO-react by Shu</h1>
      {/* <input className='input input-sizeX' placeholder='enter sizeX'></input>
      <input className='input input-sizeY' placeholder='enter sizeY'></input>*/}
      <div className='wrap-input-win-amount'>
        <input 
          className='input input-win-amount' 
          placeholder='Сколько ячеек для победы?'
          onKeyUp={ifEnter}
          onChange={(event) => {
            setTemporalInput(event.target.value);
            console.log(event.target.value);
          }}
          value={temporalInput}
        />
        <button 
          className='button button-input-win-amount'
          onClick={() => applyWinAmount()}
        >Ok</button>
      </div>
       
      <h2 className={'endgame-header-'+endGame}>{turn===0?'Крестики выиграли!':'Нолики выиграли!'} Нажмите на поле для старта новой игры.</h2>
      <h3 className={'win-amount-header'}>Для победы нужно собрать: {winAmount} ячеек в ряд</h3>
      <h3 className={'turn-header-'+endGame}>Ходят: {turn===0 ? 'Нолики':'Крестики'}</h3>
       <Field
            field={field}
            clicked={(x, y) => clicked(x, y)}
      />
		</div>
	);
}

function Field ({field, clicked}) {
  return(
    <table className='main-table'>
      <tbody>
        {field.map((tr, y) => {
          return <tr
          key={y}
          >
            {tr.map((td, x) => {
              return <td
                key={x + ' '+ y}
                onClick={() => clicked(x, y)}
                className={'td td-'+td.value+'-'+td.win}             
              >
                {td.value}
              </td>
            })}
            </tr>
        })}
      </tbody>
    </table>
  )
}


  // <div className="">


	// 	<input
	// 		className="list-checkbox"
	// 		type="checkbox" 
	// 		onChange={(event) => onItemToggle(event.target.checked)}
	// 		checked={isDone}
	// 	/>
	// 	{title}
	// 	<button 
	// 		className="button-delete"
	// 		onClick={(event) => onDelete()}
	// 	>
	// 		<img src={bin}/>
	// 	</button>
	// </div>






export default App;

