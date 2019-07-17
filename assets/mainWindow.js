const {ipcRenderer} = require("electron");
var addTodo = document.querySelector("#addTodo");
var btn1 = document.querySelector("#button1");
var text1 = document.querySelector("#text1");
var todoList = [];
btn1.addEventListener("click", () => {
    console.log(JSON.stringify(todoList));
});
addTodo.addEventListener("click",   () => {
    //if(text1.text.trim() == "") return;
    ipcRenderer.send("todo:text", text1.value);
    text1.value = ""
});
document.addEventListener("keydown", (e) => {
    //if(text1.text.trim() == "") return;
    
    if(e.which == 13){
        ipcRenderer.send("todo:text", text1.value);
        text1.value = "";
    }
});
ipcRenderer.on("todo:list", (e, todos) => {
    todoList = todos;
    //Itemları Göster
    viewItems();
});

//Dinamic List
//const cont = document.createElement("div");
const lgroup = document.querySelector(".todo-container");
function sendTodoList(){
    ipcRenderer.send("todo:list", todoList);
}

function removeItem(inx){
    
    todoList.splice(inx, 1);
    for(var i = todoList.length - 1; i >= 0; i--){
        todoList[i].id = i;
    }
    sendTodoList();
    viewItems();

    
}
function viewItems(){
    //HTML'i temizle
    lgroup.innerText = "";
    todoList.forEach(todo => {
        addItem(todo.text, todo.id);
    });
}
function addItem(text, id = "0"){
    //List Group
    

    //List Group İtem
    const lgitem = document.createElement("div");
    lgitem.innerHTML = "<span id = 'todoId' style = 'display:none'>" + id + "</span>";
    lgitem.append(addZero(id + 1) + " - " + text);
    lgitem.className = "list-group-item d-flex justify-content-between align-items-center";
    
    //Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger";
    deleteBtn.innerText = "X";
    
    deleteBtn.addEventListener("click", (e) => {
        if(confirm("Do you want delete this TODO?")){
            var index = e.target.parentNode.querySelector("#todoId").innerText;
            removeItem(index);
            e.target.parentNode.remove();
            
        }
    });
   
    lgitem.appendChild(deleteBtn);
    lgroup.appendChild(lgitem);
    
}
function addZero(int){
    if(int < 10) return "0" + int;
    return int;
}
