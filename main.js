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

let openModeElement = document.getElementById('open-mode');
let tasksElement = document.getElementById('tasks');
let closeModeElement = document.getElementById('close-mode');
let checkBoxElement = document.getElementsByTagName('input');

function createDivWithClasses(task) {
    let add_class = `<div id="task-${task.id}" class = "task-block `;
    console.log(task);
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
        console.log(typeof task.dueDate)
        deadliine = task.dueDate.substr(0, 10);
    }
    return `<h1>${task.title}</h1> \n
            <p>${task.desc}</p>\n
            <input type="checkbox"${status}>\n
            <time>${deadliine}</time>\n
            <button class="delete">Delete</button>`
}

function appendTask(task) {

    div_class = createDivWithClasses(task) + addTags(task)
    tasksElement.innerHTML += div_class;

}

tasksElement.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'BUTTON') {
        let task_id = parseInt(target.closest('.task-block').id.split('-')[1])
        let task_index = tasks.findIndex(t => t.id == task_id)
        tasks.splice(task_index, 1)
        target.closest('.task-block').remove();
        console.log(tasks)
    }
})

closeModeElement.addEventListener('click', (event) => {
    closeModeElement.classList.add('on')
    let elements = document.getElementsByTagName('input')
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
    if (event.target.tagName == 'INPUT') {
        event.target.closest('.task-block').classList.toggle('with-done')
    }
})

tasksElement.addEventListener('click', (event) => {
    if (event.target.tagName == 'INPUT') {
        if (closeModeElement.classList.contains('on')) {
            event.target.closest('DIV').style.display = 'none';
        }
    }
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
    return fetch(tasksEndpoint + `${task.id}`,{
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(task)

    })
}
