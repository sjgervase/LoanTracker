import React from "react";

// import from react redux
import { useSelector } from "react-redux";

import { Overlay, OverlayTrigger, Tooltip, Table, Popover } from "react-bootstrap";


export default function BudgetLists(props) {


     // get all settings from redux store for dynamic dark mode of the table
     const settingsState = useSelector((state) => state.settings);

     // money formatter function
     let moneyFormatter = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(amount);





     return(
          <div className="budgetTable">
               {props.array?.sort((first, second) => {
                    return first.value < second.value ? -1 : 1
               }).map(item => 



                    <OverlayTrigger
                    key={item.name}
                    placement="left"
                    overlay={
                         <Popover id="popover-basic" className="customPopover">
                              <Popover.Header as="h3" className="customPopoverHeader">{item.name}</Popover.Header>
                              <Popover.Body className="customPopoverBody">
                                   {/* conditional to automatically show monthly if loan */}
                                   {item.frequency === undefined ? <span>Frequency: Monthly</span> : <span>Frequency: {item.frequency}</span>}
                                   <br></br>
                                   <span>Amount: {moneyFormatter(item.value)}</span>
                              </Popover.Body>
                         </Popover>
                    }>

                         <div key={item.name} className="budgetTableRow">

                              <div className="budgetTableCell budgetTableFloatLeft">
                                   <span>{item.name}</span>
                              </div>

                              <div className="budgetTableCell budgetTableFloatRight">
                                   <span>{moneyFormatter(item.value)}</span>
                              </div>
                         </div>
                    
                    </OverlayTrigger>

                    

               )}
          </div>
     )
}
