import React from "react";

import { Table } from "react-bootstrap";


export default function BudgetLists(props) {

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     return(
          <Table striped hover size="sm">
               <tbody>
                    {props.array?.sort((first, second) => {
                         return first.value < second.value ? -1 : 1
                    }).map(item => 

                         <tr key={item.name}>
                              <td className="budgetTableFloatLeft">{item.name}</td>
                              <td className="budgetTableFloatRight">{moneyFormatter(item.value)}</td>
                         </tr>

                    )}
               </tbody>
          </Table>
     )
}