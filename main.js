class Task {
    constructor(title) {

        if (typeof title === 'object') {
            Object.assign(this, title)
            if (this.dueDate === '') {
                this.dueDate = null;
            }
        }
        else {
            this.title = title;
            this.done = done;
            this.desc = desc;
            this.dueDate = new Date(dueDate)
        }
    }

}

let tags = new Map()
tasks = [

]
let notDeadlineTasksButton = document.getElementById('no_deadline')
let openModeElement = document.getElementById('open-mode');
let tasksElement = document.getElementById('tasks');
let closeModeElement = document.getElementById('close-mode');
let checkBoxElement = document.getElementsByTagName('input');
let total_no_deadline = document.getElementById('total_no_deadline');
let searchInputElement = document.getElementById('searchInput')

function createDivWithClasses(task) {
    let add_class = `<div id="task-${task.id}" class = "task-block `;
    if (task.done == true) {
        add_class += ` with-done`;
    }
    if (task.desc != null) {
        add_class += ` with-desc`;
    }

    if (task.dueDate != null) {
        add_class += ` with-due_date`;
        if (checkOverDue(task)) {
            add_class += ` overdue`;
        }
    }

    return add_class + `">`;
}

function checkOverDue(task) {
    if (new Date(task.dueDate) < new Date()) {
        return true;
    }
    return false;
}

function addTags(task) {
    let status = '';
    let deadliine = '';
    if (task.done == true) {
        status = 'checked';
    }
    if (task.desc == null) {
        task.desc = '';
    }
    if (task.dueDate != null) {
        deadliine = task.dueDate.substr(0, 10);
    }
    return `<h1>${task.title}</h1> \n
            <p>${task.desc}</p>\n
            <input class="task-checkbox" type="checkbox"${status}>\n
            <time>${deadliine}</time>\n
            <button class="delete">Delete</button>`
}

function appendTask(task) {
    tasks.push(task)
    updateDOM(tasks)

}
function notDeadLineTasks(){

  console.log(tasks.filter((task) => task.dueDate == null).length)
  total_no_deadline.innerText = `${tasks.filter((task) => task.dueDate == null).length}`

}

tasksElement.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'BUTTON') {
        let task_id = parseInt(target.closest('.task-block').id.split('-')[1])
        task = tasks.find(task=>task.id===task_id)
        tasks = tasks.filter(task=>task.id != task_id)
        console.log(tasks)
        target.closest('.task-block').remove();
        deleteTask(task)
      }

})




closeModeElement.addEventListener('click', (event) => {
    closeModeElement.classList.add('on')
    let elements = document.getElementsByClassName('task-checkbox')
    for (let element of elements) {
        if (element.checked) {
            element.closest('.task-block').style.display = 'none';
        }
        else {
            element.style.display = 'block';
        }
    }
})

openModeElement.addEventListener('click', (event) => {
    closeModeElement.classList.remove('on')
    let elements = document.getElementsByClassName('task-block');
    for (element of elements) {
        element.style.display = 'block';
    }
})

tasksElement.addEventListener('click', (event) => {
  const target = event.target
    if (target.tagName == 'INPUT') {
        let task_id = parseInt(target.closest('.task-block').id.split('-')[1])
        task = tasks.find(task=>task.id === task_id)
        if (task.done == true){
          task.done = false
        }
        else (task.done = true)
        updateTask(task)
        updateDOM(tasks)
    }
})

tasksElement.addEventListener('click', (event) => {
    if (event.target.tagName == 'INPUT') {
        if (closeModeElement.classList.contains('on')) {
            event.target.closest('DIV').style.display = 'none';
        }
    }
})

searchInputElement.addEventListener('input',(event)=>{
  title = event.target.value.toLowerCase()
  console.log(tasks);
  updateDOM(tasks.filter(task => new RegExp(title).test(task.title.toLowerCase())))
})

const taskForm = document.forms['task'];
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    task = new Task(Object.fromEntries(new FormData(taskForm).entries()))
    if (task.done == 'on') {
        task.done = true;
    }
    createTask(task)
    .then(appendTask)
    .then(_=>taskForm.reset())
});

const tasksEndpoint = 'http://localhost:5000/api/tasktodo'

fetch(tasksEndpoint)
    .then(response => response.json())
    .then(tasks => tasks.forEach(appendTask))

function createTask(task) {
    return fetch(tasksEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(task)
    })
    .then(response=>response.json())
}

function updateTask(task){
    return fetch(tasksEndpoint + `/${task.id}`,{
        method: 'Put',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(task)
    })
}

function deleteTask(task){
  fetch(tasksEndpoint + `/${task.id}`,{
    method: 'Delete',
    headers: {
        'Content-Type': 'application/json'
    },
    body:JSON.stringify(task)
  })
}

function updateDOM (list){
  tasksElement.innerHTML = ``
  list.forEach((task) => {
    div_class = createDivWithClasses(task) + addTags(task)
    tasksElement.innerHTML += div_class;
  })
}
