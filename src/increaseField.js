import initialField from "./initialField";

const gap = 5;        // gap to the border

function arrayNulls(size) {
   return new Array(size).fill({value:null, win:false});
}

export const increaseFieldX = (fieldAfterTurn, x) => {
   const sizeX = fieldAfterTurn[0].length;

   if (x < gap) {
      const newField = fieldAfterTurn.map(row => [...arrayNulls(gap - x), ...row])
      return {field: newField, sizeX: newField[0].length}; 
   } 
   else if (x > sizeX-1 - gap) {
      const newField = fieldAfterTurn.map(row => [...row, ...arrayNulls(x - (sizeX-1) + gap)])
      return {field: newField, sizeX: newField[0].length}; 
   }
   else return {field: fieldAfterTurn, sizeX: fieldAfterTurn[0].length};
};

export const increaseFieldY = (fieldAfterIncreaseX, y) => {
   const sizeY = fieldAfterIncreaseX.length;
   const newSizeX = fieldAfterIncreaseX[0].length;
   
   if (y < gap) {
      const newField = [...initialField (newSizeX, gap - y), ...fieldAfterIncreaseX];
      return {field: newField, sizeY: newField.length};
   } 
   else if (y > sizeY-1 - gap) {
      const newField = [...fieldAfterIncreaseX, ...initialField(newSizeX, y - (sizeY-1 - gap))];
      return {field: newField, sizeY: newField.length}; 
   }
   else return {field: fieldAfterIncreaseX, sizeY: fieldAfterIncreaseX.length};
};
