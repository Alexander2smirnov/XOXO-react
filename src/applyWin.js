export default function applyWin(array, field) {
   const result = field.map((tr, y) => {
      return tr.map((td, x) => {
         for (let a of array) {
            if (x === a[0] && y === a[1]) {
               const hooray = {value: td.value, win:true};
               return hooray;
            }
         }
         return td;
      })
   })
   return result;
};