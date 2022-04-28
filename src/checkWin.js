const checkVector = (fieldBI, x, y, turn, vX, vY) => { //field before increase
   let count = 1;
   const result = [];
   const sizeX = fieldBI[0].length;
   const sizeY = fieldBI.length;

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
   return [...plus, ...minus];
};

export default function checkWin(fieldBI, x, y, turn, winAmount) {
   const vectors = [
      [1, 1],
      [1, -1],
      [1, 0], 
      [0, -1]
   ];  
   let win = false;
   let result = [[x, y]];

   for (let v of vectors) {
      let vCheck = checkBothSidez (fieldBI, x, y, turn, ...v);
      if (vCheck.length >= winAmount - 1) {
         result = [...result, ...vCheck];
         win = true;
      }
   }
   if (win === true) return result;
   else return false;
}