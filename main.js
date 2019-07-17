const {app, BrowserWindow, ipcMain, Menu, dialog} = require("electron");
const Store = require("./lib/store.js");

const store = new Store({
    configName: "Todos",
    defaults: {
        todos: [],
        width: 640,
        height: 480
    }
});
let mainWindow, todoWindow;
let todoList = [];
app.on("ready", () => {
    //const icon = new Tray("./imgs/icon.png");
    mainWindow = new BrowserWindow({
        width: store.get("width"),
        height: store.get("height"),
        icon: "./imgs/icon.png",
        webPreferences: {
            nodeIntegration: true
        }
    });
    
    mainWindow.loadFile("index.html");
    mainWindow.on("resize", (e) => {
        let {width, height} = mainWindow.getBounds();
        store.set("width", width);
        store.set("height", height);
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    //İPCMAİN
    ipcMain.on("todo:text", (e, data) => {
        todoList.push({
            id: todoList.length,
            text: data
        });
        store.set("todos", todoList);
        console.log(store.path);
        mainWindow.webContents.send("todo:list",todoList);
    });
    ipcMain.on("todo:list", (e, todos) => {
        todoList = todos;
        store.set("todos", todoList);
    });
    mainWindow.webContents.once("dom-ready", () => {
        todoList = store.get("todos");
        mainWindow.webContents.send("todo:list",todoList);
    });
    
});
function saveTodo(){
    
}
function addTodo(){
    if(todoWindow == null){
        todoWindow = new BrowserWindow({
            width: 600,
            height: 200,
            webPreferences: {
                nodeIntegration: true
            }
        });
        todoWindow.loadFile("newTODO.html");
        todoWindow.on("closed", () => {
            todoWindow = null;
        });
    }
    
}
const menuTemplate = [
    {
        label: "About",
        click(){
            dialog.showMessageBox(mainWindow,{
                type: "none",
                title: "About",
                message : "This program is created by Berkay CEYLAN \n berkayceylan.com",
                //detail : "about",
                icon: "./imgs/icon.png"
            });
        }
    }
]
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
app.on("window-all-closed", () => {
    if(process.platform !== "darwin")
        app.quit();
});
app.on("activate", ()=>{
    //if(mainWindow == null) 
});