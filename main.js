// Main Process

// DONT FORGET TO RUN NPM WATCH
const { app, BrowserWindow, ipcMain, Notification, getCurrentWindow, shell } = require('electron');
const path = require('path');
const isDevelopmentMode = !app.isPackaged;

const fs = require('fs');
const {dialog, remote} = require('electron');

// Create Window function
function createWindow() {
     // Browser Window <- Renderer Process
     const win = new BrowserWindow({
          minWidth: 545,
          minHeight: 100,
          width: 1600,
          height: 850,
          frame: false,
          webPreferences: {
               nodeIntegration: true,
               worldSafeExecuteJavaScript: true,
               contextIsolation: false
          }
     })

     win.loadFile('index.html')
     isDevelopmentMode && win.webContents.openDevTools();

     // custom close
     ipcMain.on('closeApp', () => {
          app.quit();
     })

     // custom minimize
     ipcMain.on('minimizeApp', () => {
          win.minimize();
     })

     // custom maximize
     ipcMain.on('maximizeRestoreApp', () => {
          if (win.isMaximized()) {
               win.restore();
          } else {
               win.maximize();
          }
     })    
}


// if NOT on mac, quit app when all windows are closed
app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') {
          app.quit();
     }
})


// on activate, create window if there are no others
app.on('activate', () => {
     if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
     }
})


// Additional functionality if the file is in devmode
if (isDevelopmentMode) {
     require('electron-reload')(__dirname, {
          electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
     })
}

// create window when ready
app.whenReady().then(createWindow);



// ensure library files exist in the userData folder and if not, create them
function dataFileVerifier() {
     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var dataFile = path.join(userDataPath, "dataFile.json");

     // if the library file already exists, do nothing
     if (fs.existsSync(dataFile)) {
     // path exists
     } else {
          console.log("file DOES NOT exist:");

          // var data = {data:[]}

          var data = {
               "data":[
                    {"loans":[]},
                    {"deductions":[]},
                    {"incomes":[]},
                    {"settings":[]}
               ]
          }

          // create the file and add the empty data
          fs.writeFileSync(dataFile, JSON.stringify(data),
               {
                    encoding: "utf8",
                    // a means append
                    flag: "a"
               },
               (err) => {
                    if (err)
                    console.log(err);

                    else {
                         console.log("data file written successfully");
                    }
               }
          );
     }
}



// when app is ready, run above function to ensure library files exist in the userData folder and if not, create them
app.whenReady().then(dataFileVerifier());



// get data currently in file
async function dataGrabber() {
     // create object to hold data
     let data = {};

     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var dataFile = path.join(userDataPath, "dataFile.json");

     // function to parse the data
     async function fileReader(){
          // console.log("documentRead");
          data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

          // return album object
          return data;
     }

     // run above fileReader function
     await fileReader();

     return data;
}

// runs above function to get data from file
ipcMain.handle('dataRequest', async (event, arg) => {
     // get the objects from the file
     const dataReturn = await dataGrabber();
     return dataReturn;
 })



// open url for bank
ipcMain.handle("openLinkToPaymentURL", (event, url) => {
     // console.log(url);
     shell.openExternal(url);
})



// read the current data. this function is called in all functions for adding data to datafile
function fileReader(){
     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var dataFile = path.join(userDataPath, "dataFile.json");
     
     // console.log("documentRead");
     data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

     // return album object
     return data;
}

// write updated data to the file
function fileWriter(filedata) {
     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var dataFile = path.join(userDataPath, "dataFile.json");

     // write to file
     fs.writeFileSync(path.resolve(dataFile), JSON.stringify(filedata));
}


// read and generate unique GUIDS
function guidGenerator() {
     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // create empty array to be populated by all guids currently in the file
     let guidArray = [];

     // for each loan item
     for (let i = 0; i < filedata.data[0].loans.length; i++) {
          guidArray.push(filedata.data[0].loans[i].loan.GUID);
     }

     // for each deduction
     for (let i = 0; i < filedata.data[1].deductions.length; i++) {
          guidArray.push(filedata.data[1].deductions[i].GUID);
     }

     // for each income
     for (let i = 0; i < filedata.data[2].incomes.length; i++) {
          guidArray.push(filedata.data[2].incomes[i].GUID);
     }

     // generate 20 digit GUID for album and album art
     let randomGUID = (length = 20) => {
          let str = "";
          // create a GUID within a while loop. this will loop infinitely until a GUID is not already being used
          while (true) {
               // Declare all characters
               let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
               // Pick characers randomly and add them to "str" variable to create random string
               for (let i = 0; i < length; i++) {
                    str += chars.charAt(Math.floor(Math.random() * chars.length));
               }
               // if str is not being used as a GUID already, break the while loop
               if (!(guidArray.includes(str))) {
                    break;
               }
          }
          return str;
     };

     return randomGUID();
    
}



// add the data recieved in the ipc message below to the file
async function addFormDataToFile(formData) {
    
     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     

     var newGuid = guidGenerator();

     // the new loan object to be added
     let loanObject = {
          loan: {
               GUID: newGuid,
               PaymentHistory: [], 
               LateFees:[],
               DesiredMonthlyPayment: 0,
               TotalLoanAmount: formData.MonthlyPayment * formData.TotalTermLength
          }
     }

     // add the recieved formdata to the above loan object
     Object.assign(loanObject.loan, formData);

     filedata.data[0].loans.push(loanObject);
     
     // write to file
     fileWriter(filedata);
}

//  New Loan Item Submission
ipcMain.handle('newLoanSubmission', async (event, formData) => {
     const result = await addFormDataToFile(formData);
     return result
})



// add the data recieved in the ipc message below to the file
async function addPaymentToLoan(recordPaymentState) {

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // find the loan to update based on the guid
     let loanToUpdate = filedata.data[0].loans.find(loan => loan.loan.GUID === recordPaymentState.GUID);

     let paymentHistory = loanToUpdate.loan.PaymentHistory;
     
     // create empty payment object
     let paymentObject = {
          amount: recordPaymentState.Payment,
          dateMade: recordPaymentState.Date,
          dateRecorded: new Date()
     }

     paymentHistory.push(paymentObject);

     // write to file
     fileWriter(filedata);
     
}

//  New Payment Record Submission
ipcMain.handle('newPaymentSubmission', async (event, recordPaymentState) => {
     const result = await addPaymentToLoan(recordPaymentState);
     return result
})



// add the data recieved in the ipc message below to the file
async function addLateFeeToLoan(recordLateFeeState) {

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // find the loan to update based on the guid
     let loanToUpdate = filedata.data[0].loans.find(loan => loan.loan.GUID === recordLateFeeState.GUID);

     let LateFees = loanToUpdate.loan.LateFees;

     let LateFeeObject = {
          amount: recordLateFeeState.LateFee,
          dateMade: recordLateFeeState.Date,
          dateRecorded: new Date()
     }

     LateFees.push(LateFeeObject);
     
     // write to file
     fileWriter(filedata);
}

//  New Late Fee Submission
ipcMain.handle('newLateFeeSubmission', async (event, recordLateFeeState) => {
     const result = await addLateFeeToLoan(recordLateFeeState);
     return result
})





// add the data recieved in the ipc message below to the file
async function deletePaymentLateFee(GUIDAndTimestampType) {

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // find the loan to update based on the guid
     let loanToUpdate = filedata.data[0].loans.find(loan => loan.loan.GUID === GUIDAndTimestampType.GUID);

     let propertyName = GUIDAndTimestampType.type;

     // determine payment history / late fee based on recieved type
     let listToUpdate = loanToUpdate.loan[propertyName];

     // get the index
     let removeThisIndex = listToUpdate.findIndex(item => item.dateRecorded === GUIDAndTimestampType.TimeStamp);

     // remove that item
     listToUpdate.splice(removeThisIndex, 1);

     // write to file
     fileWriter(filedata);
}

//  Delete Payment / late fee from history
ipcMain.handle('deletePaymentLateFee', async (event, GUIDAndTimestampType) => {
     const result = await deletePaymentLateFee(GUIDAndTimestampType);
     return result
})



// add the data recieved in the ipc message below to the file
async function addDesiredMonthlyPayment(desiredMonthlyPayment) {

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // find the loan to update based on the guid
     let loanToUpdate = filedata.data[0].loans.find(loan => loan.loan.GUID === desiredMonthlyPayment.GUID);

     loanToUpdate.loan.DesiredMonthlyPayment = desiredMonthlyPayment.value;

     fileWriter(filedata);
}


//  add desired monthly payment to form
ipcMain.handle('desiredMonthlyPaymentSubmission', async (event, desiredMonthlyPayment) => {
     const result = await addDesiredMonthlyPayment(desiredMonthlyPayment);
     return result
})











// delete loan
async function deleteLoan(GUID) {

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // find the loan to update based on the guid
     let loanToDeleteIndex = filedata.data[0].loans.findIndex(loan => loan.loan.GUID === GUID);

     filedata.data[0].loans.splice(loanToDeleteIndex, 1);

     fileWriter(filedata);
}


//  delete specified loan
ipcMain.handle('deleteLoan', async (event, GUID) => {
     const result = await deleteLoan(GUID);
     return result
})





// Add monthly pay
async function monthlyPay(incomeObject) {
     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     let newGUID = guidGenerator();

     incomeObject.GUID = newGUID;

     filedata.data[2].incomes.push(incomeObject);

     fileWriter(filedata);
}


//  add monthly pay
ipcMain.handle('submitMonthlyIncome', async (event, incomeObject) => {
     const result = await monthlyPay(incomeObject);
     return result
})



// Add monthly deduction
async function monthlyDeduction(deductionObject) {
     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     let newGUID = guidGenerator();

     deductionObject.GUID = newGUID;

     filedata.data[1].deductions.push(deductionObject);

     fileWriter(filedata);
}


//  add monthly pay
ipcMain.handle('submitMonthlydeduction', async (event, deductionObject) => {
     const result = await monthlyDeduction(deductionObject);
     return result
})







// edit budget item
async function editBudgetItem(itemObject) {

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // delete the item, rewrite with new data
     // search for items in deduction by guid

     // search in the 2nd array, deductions
     let itemToDeleteIndex = filedata.data[1].deductions.findIndex(item => item.GUID === itemObject.GUID);

     // if find index does not return an index, it returns -1
     if (itemToDeleteIndex == -1) {
          // search in incomes
          itemToDeleteIndex = filedata.data[2].incomes.findIndex(item => item.GUID === itemObject.GUID);

          // delete the item
          filedata.data[2].incomes.splice(itemToDeleteIndex, 1);

          // add the recieved data
          filedata.data[2].incomes.push(itemObject);
     
     // the item is in deductions
     } else {
          // delete the item
          filedata.data[1].deductions.splice(itemToDeleteIndex, 1);

          // add the recieved data
          filedata.data[1].deductions.push(itemObject);
     }

     fileWriter(filedata);
}

// edit budget item
ipcMain.handle('submitBudgetItemChange', async (event, itemObject) => {
     const result = await editBudgetItem(itemObject);
     return result
})











// delete budget item
async function deleteBudgetItem(GUID) {

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // search in the 2nd array, deductions
     let itemToDeleteIndex = filedata.data[1].deductions.findIndex(item => item.GUID === GUID);

     // if find index does not return an index, it returns -1
     if (itemToDeleteIndex == -1) {
          // search in incomes
          itemToDeleteIndex = filedata.data[2].incomes.findIndex(item => item.GUID === GUID);

          // delete the item
          filedata.data[2].incomes.splice(itemToDeleteIndex, 1);
     
     // the item is in deductions
     } else {
          // delete the item
          filedata.data[1].deductions.splice(itemToDeleteIndex, 1);
     }

     fileWriter(filedata);
}


// Delete budget item
ipcMain.handle('deleteBudgetItem', async (event, GUID) => {
     const result = await deleteBudgetItem(GUID);
     return result
})
