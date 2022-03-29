import { useState } from 'react';
import './App.css';

const sM = 5;  //sizeMargin
const wC = 5; //winCount
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
  

  //const [winCells, setWinCells] = useState ([]);
  const [sizeX, setSizeX] = useState(20);
  const [sizeY, setSizeY] = useState(20);
  const [field, setField] = useState(initialField(sizeX, sizeY));  
  const [turn, setTurn] = useState(1);

  const [winAmount, setWinAmount] = useState(5);

  const clicked = (x, y) => {
    if (endGame) {
      setSizeX(20);
      setSizeY(20);
      setField(initialField(20,20));
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
      if (vCheck.length >= wC-1) {
        result = [...result, ...vCheck];
        win = true;
      }
    }
    if (win === true) return result;
    else return false;
  }



	return (
		<div className="App">
			<h2>XOXO-react by Shu</h2>
      {/* <input className='input input-sizeX' placeholder='enter sizeX'></input>
      <input className='input input-sizeY' placeholder='enter sizeY'></input>
      <input className='input input-win-amount' placeholder='enter win amount'></input>
       */}

      <h3 className={'endgame-header-'+endGame}>{turn===0?'Крестики выиграли! Нажмите куда-нибудь для старта новой игры.':'Нолики выиграли! Нажмите куда-нибудь для старта новой игры.'} </h3>
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

