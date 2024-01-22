// Globals
let todos = [];
let users = [];
// Attach Events
document.addEventListener("DOMContentLoaded", initApp);

// Event Logic
function initApp(){
    Promise.all([getAllTodos(), getAllUsers()]).then(values =>{
       [todos, users] = values;
        console.log(todos);
        console.log(users);
       // Отправить в разметку
    })
}

// Async logic
async function getAllTodos(){
    const response = await fetch("https://jsonplaceholder.typicode.com/todos")
    const data = await response.json();

    return data;
}

async function getAllUsers(){
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    const data = await response.json();
    
    return data;
}