import React, { useState } from "react";

import { Button, Modal, Table, Form } from "react-bootstrap";

import CurrencyInput from "react-currency-input-field";

import BigNumber from "bignumber.js";

import { ipcRenderer } from "electron";


export default function EditOrDeleteBudgetItemList(props) {

     // Edit Modal ---------------------------------------------------------------------------------------------------

     // state to show / hide the edit modal
     const [showEditModal, setShowEditModal] = useState(false);

     // state to capture data
     const [editState, setEditState] = useState({});

     // functions to show or hide the edit modal
     const showEditModalFunc = (item) => {
          // show the modal
          setShowEditModal(true);
          // set the edit state equal to the item that has been clicked on
          setEditState({
               ...item
          })
     };
     
     const hideEditModalFunc = () => {
          // clear the value state
          setEditState({});
          // hide the modal
          setShowEditModal(false);
     }

     // function to handle changes made to the edit modal controls
     const handleChange = (value, name) => {
          setEditState({ ...editState, [name]: value })
     }

     // function to determine the correct dropdown options
     const selectOptionsDropdown = () => {
          switch (props.name) {
               case "Income":
                    return(
                         <>
                         <option>⎯⎯⎯⎯⎯</option>
                         <option>Weekly</option>
                         <option>Every 2 Weeks</option>
                         <option>Twice per Month</option>
                         <option>Monthly</option>
                         <option>Quarterly</option>
                         </>
                    );
                    break;
          
               case "Bill":
                    return(
                         <>
                         <option>⎯⎯⎯⎯⎯</option>
                         <option>Weekly</option>
                         <option>Monthly</option>
                         <option>Quarterly</option>
                         <option>Twice per Year</option>
                         <option>Yearly</option>
                         </>
                    );
               break

               case "Expense":
                    return(
                         <>
                         <option>⎯⎯⎯⎯⎯</option>
                         <option>Daily</option>
                         <option>Daily (excluding weekends)</option>
                         <option>Weekends</option>
                         <option>Weekly</option>
                         <option>Monthly</option>
                         </>
                    );
               break

               case "Saving":
                    return(
                         <>
                         <option>⎯⎯⎯⎯⎯</option>
                         <option>Weekly</option>
                         <option>Every 2 Weeks</option>
                         <option>Twice per Month</option>
                         <option>Monthly</option>
                         <option>Quarterly</option>
                         </>
                    );
               break
          }
     }

     // function to calculate monthly totals
     function monthlyTotalCalculation() {
           // create empty var to be populated
           let monthlyTotal;

           // ensure both fields are selected
           if (editState.hasOwnProperty("Frequency") && editState.hasOwnProperty("Amount")) {
                
               let amount = new BigNumber(editState.Amount);
 
               switch (editState.Frequency) {
                    case "Daily":
                         monthlyTotal = amount.multipliedBy(365).dividedBy(12).toFixed(2);
                    break;

                    case "Daily (excluding weekends)":
                         monthlyTotal = amount.multipliedBy(5).multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Weekends":
                         monthlyTotal = amount.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Weekly":
                         monthlyTotal = amount.multipliedBy(52).dividedBy(12).toFixed(2);
                    break;

                    case "Monthly":
                         monthlyTotal = amount.toFixed(2);
                    break;
               
                    case "Quarterly":
                         monthlyTotal = amount.multipliedBy(4).dividedBy(12).toFixed(2);
                    break;
                    
                    case "Twice per Year":
                         monthlyTotal = amount.multipliedBy(2).dividedBy(12).toFixed(2);
                    break;

                    case "Yearly":
                         monthlyTotal = amount.dividedBy(12).toFixed(2);
                    break;

                    case "Every 2 Weeks":
                         monthlyTotal = amount.multipliedBy(26).dividedBy(12).toFixed(2);
                    break;    
               
                    case "Twice per Month":
                         monthlyTotal = amount.multipliedBy(2).toFixed(2);
                    break;
               }
 
               return monthlyTotal;
           } else {
               return 0;
           }

     }

     // function to submit changes
     function submitChanges() {
          // // get the calculated monthly amount
          let calculatedMonthlyAmount = monthlyTotalCalculation();

          // // create an item object with the state and calculated monthly amount
          let itemObject = {
               ...editState,
               Type: props.name.toLowerCase() + 's',
               MonthlyAmount: calculatedMonthlyAmount,
          }

          // send to main process to write to file
          ipcRenderer.invoke('submitBudgetItemChange', (itemObject));

          // clear the value state
          setEditState({});

          // hide the modal
          setShowEditModal(false);
     }



     // Delete Modal ---------------------------------------------------------------------------------------------------

     // state to show / hide the delete modal
     const [showDeleteModal, setShowDeleteModal] = useState(false);
     // functions to show or hide the delete modal
     const showDeleteModalFunc = () => {setShowDeleteModal(true)};
     const hideDeleteModalFunc = () => {
          // clear the value state
          
          // hide the modal
          setShowDeleteModal(false);
     }

     // function to delete the budget item
     function deleteThisBudgetItem(GUID) {
          // send to main process to write to file
          ipcRenderer.invoke('deleteBudgetItem', (GUID));

          // hide the modal
          hideDeleteModalFunc();
     }

     return(
          <>
               <h4>{props.name}s</h4>
               
               <Table striped bordered hover size="sm" className="editDeleteItemTable">
                    <thead>
                         <tr>
                              <td>Edit Item</td>
                              <td>Name</td>
                              <td>Frequency</td>
                              <td>Amount</td>
                              <td>Delete Item</td>
                         </tr>
                    </thead>

                    <tbody>
                         {props.array?.sort((first, second) => {
                              return first.value < second.value ? -1 : 1
                         }).map(item => 

                         
                              <tr key={item.GUID}>

                                   <td>
                                        <Button size="sm" variant="warning" onClick={() => showEditModalFunc(item)}>
                                             Edit {item.Name}
                                        </Button>
                                   </td>

                                   <td>{item.Name}</td>
                                   <td>{item.Frequency}</td>
                                   <td>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(item.Amount)}</td>

                                   <td>
                                        <Button size="sm" variant="danger" onClick={() => showDeleteModalFunc()}>
                                             Delete {item.Name}
                                        </Button>
                                   </td>



                                   {/* Edit Modal */}
                                   <Modal
                                   show={showEditModal}
                                   onHide={hideEditModalFunc}
                                   backdrop="static"
                                   keyboard={false}
                                   centered
                                   >
                                        <Modal.Header closeButton>
                                             <Modal.Title>Edit {item.Name}</Modal.Title>
                                        </Modal.Header>

                                        <Modal.Body>
                                             <Form.Group controlId="Name">
                                                  <Form.Label>{props.name} Name</Form.Label>
                                                  <Form.Control type="Text" name="Name" placeholder="name" onChange={e => handleChange(e.target.value, e.target.name)} defaultValue={item.Name}/>
                                                  <Form.Text className="text-muted">You can name it whatever you'd like. This is just for you to keep track of it</Form.Text>
                                             </Form.Group>

                                             <Form.Group className="mb-3">
                                                  <Form.Label>Select a Frequency. This is how often a bill is recieved</Form.Label>
                                                  <Form.Select  name="Frequency" onChange={e => handleChange(e.target.value, e.target.name)} defaultValue={item.Frequency}>
                                                       {selectOptionsDropdown()}
                                                  </Form.Select>
                                             </Form.Group>

                                             <Form.Group>
                                                  <Form.Label>Enter an amount. For inconsistent amounts, try and enter an average.</Form.Label>
                                                  <CurrencyInput
                                                       prefix="$"
                                                       name="Amount"
                                                       placeholder="ex $200"
                                                       decimalScale={2}
                                                       decimalsLimit={2}
                                                       defaultValue={item.Amount}
                                                       allowNegativeValue={false}
                                                       onValueChange={(value, name) => handleChange(value, name)}
                                                  />
                                             </Form.Group>

                                             <div className="monthlyTotalDiv">
                                                  <span>Your {props.name} is approximately</span>
                                                  <h2>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(monthlyTotalCalculation())}</h2>
                                                  <span>per month</span>
                                             </div>

                                        </Modal.Body>

                                        <Modal.Footer>
                                             <Button variant="secondary" onClick={()=> hideEditModalFunc()}>
                                                  Cancel
                                             </Button>

                                             <Button variant="success" onClick={()=> submitChanges()}>
                                                  Save Changes
                                             </Button>
                                        </Modal.Footer>
                                   </Modal>






                                   {/* Delete Modal */}
                                   <Modal
                                   show={showDeleteModal}
                                   onHide={hideDeleteModalFunc}
                                   keyboard={false}
                                   centered
                                   >
                                        <Modal.Header closeButton>
                                             <Modal.Title>Delete {item.Name}</Modal.Title>
                                        </Modal.Header>

                                        <Modal.Body>
                                             <span>Are you sure you want to <b>delete</b> "{item.Name}"? This cannot be undone.</span>

                                             <Table bordered striped>
                                                  <tbody>
                                                       <tr>
                                                            <td>{item.Name}</td>
                                                            <td>{item.Frequency}</td>
                                                            <td>{new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(item.Amount)}</td>
                                                       </tr>
                                                  </tbody>
                                             </Table>
                                        </Modal.Body>

                                        <Modal.Footer>
                                             <Button variant="secondary" onClick={()=> hideDeleteModalFunc()}>
                                                  Cancel
                                             </Button>

                                             <Button variant="danger" onClick={()=> deleteThisBudgetItem(item.GUID)}>
                                                  Delete
                                             </Button>
                                        </Modal.Footer>
                                   </Modal>
                              </tr>
                         )}
                    </tbody>
               </Table>
          </>
     );
}