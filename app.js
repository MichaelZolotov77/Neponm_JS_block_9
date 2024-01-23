(function () {
  // Globals
  const todoList = document.getElementById("todo-list");
  const userSelect = document.getElementById("user-todo");
  const form = document.querySelector("form");
  let todos = [];
  let users = [];

  // Attach Events
  document.addEventListener("DOMContentLoaded", initApp);
  form.addEventListener("submit", handleSubmit);

  // Basic Logic
  function getUserName(userId) {
    const user = users.find((u) => u.id === userId);
    return user.name;
  }

  function printTodo({ id, userId, title, completed }) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span>`;

    const status = document.createElement("input");
    status.type = "checkbox";
    status.checked = completed;
    status.addEventListener("change", handleTodoChange);

    const close = document.createElement("span");
    close.innerHTML = "&times;";
    close.className = "close";
    close.addEventListener("click", handleClose);

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
  }

  function createUserOption(user) {
    const option = document.createElement("option");
    option.value = user.id;
    option.innerText = user.name;

    userSelect.append(option);
  }

  function removeTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId);

    const todo = todoList.querySelector(`[data-id="${todoId}"]`);
    console.log(todo);
    todo.querySelector("input").removeEventListener("change", handleTodoChange);
    todo.querySelector(".close").removeEventListener("click", handleClose);

    todo.remove();
  }

  function alertError(error) {
    alert(error.message);
  }

  // Event Logic
  function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
      [todos, users] = values;
      console.log(todos);
      console.log(users);

      // Отправить в разметку
      todos.forEach((todo) => printTodo(todo));
      users.forEach((user) => createUserOption(user));
    });
  }

  function handleSubmit(event) {
    event.preventDefault(); // иначе форма отправится синхронно
    console.log(form.todo.value); // Получение значения введенного поля
    console.log(form.user.value); // Получение значения выбранного элемента

    createTodo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
    });
  }

  function handleTodoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;
    console.log(todoId, completed);
    toggleTodoComplete(todoId, completed);
  }

  function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
  }

  // Async logic
  async function getAllTodos() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=15"
      );
      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function getAllUsers() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users?_limit=5"
      );
      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function createTodo(todo) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          body: JSON.stringify(todo), // отправляем как строку
          headers: {
            "Content-Type": "application/json", // в качестве ответа ожидаем json
          },
        }
      );

      const newTodo = await response.json();
      console.log(newTodo);

      printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
  }

  async function toggleTodoComplete(todoId, completed) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ completed }), // completed: completed
          headers: {
            "Content-Type": "application/json", // в качестве ответа ожидаем json
          },
        }
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error("Failed to connect with the server! Please try later.");
      }
    } catch (error) {
      alertError(error);
    }
  }

  async function deleteTodo(todoId) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", // в качестве ответа ожидаем json
          },
        }
      );

      if (response.ok) {
        // remove Todo from DOM
        removeTodo(todoId);
      } else {
        throw new Error("Failed to connect with the server! Please try later.");
      }
    } catch (error) {
      alertError(error);
    }
  }
})();
