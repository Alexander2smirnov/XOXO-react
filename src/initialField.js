export default function initialField(sizeX, sizeY) {
   const fieldTemp = [];

   for (let y = 0; y <  sizeY; y++){
      fieldTemp[y] = [];
      for (let x = 0; x < sizeX; x++) {
         fieldTemp[y][x] = {value:null, win: false};
      }
   }
  return fieldTemp;
}