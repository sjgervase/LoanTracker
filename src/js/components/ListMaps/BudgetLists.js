import React from "react";

import { Table } from "react-bootstrap";

// import from react redux
import { useSelector } from "react-redux";


export default function BudgetLists(props) {

     // get all settings from redux store for dynamic dark mode of the table
     const settingsState = useSelector((state) => state.settings);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);

     return(
          <Table striped hover size="sm" variant={settingsState.settings[0]?.UserSelectedTheme == "dark" ? "dark" : "light"}>
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