import React from "react";

export default function Field({field, clickHandler}) {
   return(
      <table className='main-table'>
         <tbody>
            {field.map((tr, y) => {return (
               <tr
                  key={y}
               >
                  {tr.map((td, x) => {
                     return (
                        <td
                           key={x + ' '+ y}
                           onClick={() => clickHandler(x, y)}
                           className={'td td-'+ td.value +' td-' + td.win }             
                        >
                        </td>
                     )
                  })}
               </tr>
            )})}
         </tbody>
      </table>
   )
}