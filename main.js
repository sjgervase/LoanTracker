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
          var data = '{"data":[]}';

          // create the file and add the empty data
          fs.writeFileSync(dataFile, data,
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





// add the data recieved in the ipc message below to the file
async function addFormDataToFile(formData) {

     // console.log(formData);

     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var dataFile = path.join(userDataPath, "dataFile.json");


     // read the current data
     function fileReader(){
          // console.log("documentRead");
          data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

          // return album object
          return data;
     }

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // create empty array to be populated by all guids currently in the file
     let guidArray = [];

     for (let i = 0; i < filedata.data.length; i++) {
          guidArray.push(filedata.data[i].loan.GUID)
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

     var newGuid = randomGUID();

     // the new loan object to be added
     let loanObject = {
          loan: {
               GUID: newGuid,
               PaymentHistory: [], 
               LateFees:[],
               DesiredMonthlyPayment: 0
          }
     }

     // add the recieved formdata to the above loan object
     Object.assign(loanObject.loan, formData);

     filedata.data.push(loanObject);

     fs.writeFileSync(path.resolve(dataFile), JSON.stringify(filedata));
}


//  New Loan Item Submission
ipcMain.handle('newLoanSubmission', async (event, formData) => {
     const result = await addFormDataToFile(formData);
     return result
})



// open url for bank
ipcMain.handle("openLinkToPaymentURL", (event, url) => {
     // console.log(url);
     shell.openExternal(url);
})















// add the data recieved in the ipc message below to the file
async function addPaymentToLoan(recordPaymentState) {

     // console.log(recordPaymentState);

     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var dataFile = path.join(userDataPath, "dataFile.json");

     // read the current data
     function fileReader(){
          // console.log("documentRead");
          data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

          // return album object
          return data;
     }

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // find the loan to update based on the guid
     let loanToUpdate = filedata.data.find(loan => loan.loan.GUID === recordPaymentState.GUID);

     let paymentHistory = loanToUpdate.loan.PaymentHistory;

     // adding an index for easier sorting for graph data.
     // the number itself isnt too important as recorded payments can be deleted by the user.
     // but the graph really needs data in order to draw effectively

     // create an empty object
     let maxIndex = {};

     if (paymentHistory.length > 0) {
          // if there is a payment history, find the hightest index
          maxIndex = paymentHistory.reduce((prev, current) => (prev.index > current.index) ? prev : current)     
     } else {
          // else, add an index of one
          maxIndex.index = 0;
     }

     // console.log(maxIndex.index);

     // create empty payment object
     let paymentObject = {
          index: maxIndex.index + 1,
          amount: recordPaymentState.Payment,
          dateMade: recordPaymentState.Date,
          dateRecorded: new Date()
     }

     paymentHistory.push(paymentObject);


     // write to file
     fs.writeFileSync(path.resolve(dataFile), JSON.stringify(filedata));
     
}

//  New Payment Record Submission
ipcMain.handle('newPaymentSubmission', async (event, recordPaymentState) => {
     const result = await addPaymentToLoan(recordPaymentState);
     return result
})









// add the data recieved in the ipc message below to the file
async function addLateFeeToLoan(recordLateFeeState) {

     // console.log(recordLateFeeState);

     // path to OS appdata folder
     var userDataPath = app.getPath('userData');

     // build the string to the path of the current user library json file
     var dataFile = path.join(userDataPath, "dataFile.json");

     // read the current data
     function fileReader(){
          // console.log("documentRead");
          data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

          // return album object
          return data;
     }

     // run above fileReader function to get a variable with all data
     let filedata = fileReader();

     // find the loan to update based on the guid
     let loanToUpdate = filedata.data.find(loan => loan.loan.GUID === recordLateFeeState.GUID);

     let LateFees = loanToUpdate.loan.LateFees;

     // adding an index for easier sorting for graph data.
     // the number itself isnt too important as recorded payments can be deleted by the user.
     // but the graph really needs data in order to draw effectively

     // create an empty object
     let maxIndex = {};

     if (LateFees.length > 0) {
          // if there is a payment history, find the hightest index
          maxIndex = LateFees.reduce((prev, current) => (prev.index > current.index) ? prev : current)     
     } else {
          // else, add an index of one
          maxIndex.index = 0;
     }

     // console.log(maxIndex.index);

     let LateFeeObject = {
          index: maxIndex.index + 1,
          amount: recordLateFeeState.LateFee,
          dateMade: recordLateFeeState.Date,
          dateRecorded: new Date()
     }

     LateFees.push(LateFeeObject);

     // write to file
     fs.writeFileSync(path.resolve(dataFile), JSON.stringify(filedata));
}


//  New Late Fee Submission
ipcMain.handle('newLateFeeSubmission', async (event, recordLateFeeState) => {
     const result = await addLateFeeToLoan(recordLateFeeState);
     return result
})





