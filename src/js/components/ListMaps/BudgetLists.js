import React from "react";

import { Table } from "react-bootstrap";


export default function BudgetLists(props) {

     return(
          <Table striped hover size="sm">
               <tbody>
                    {props.array?.sort((first, second) => {
                         return first.value < second.value ? -1 : 1
                    }).map(item => 

                         <tr key={item.name}>
                              <td className="budgetTableFloatLeft">{item.name}</td>
                              <td className="budgetTableFloatRight">{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(item.value)}</td>
                         </tr>

                    )}
               </tbody>
          </Table>
     )
}