
// HAMBURGER MENU TOGGLE
// USE .querySelector TO GET THE FIRST ELEMENT THAT MATCH A GIVEN CSS SELECTOR
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navMenu = document.querySelector("nav ul");

hamburgerMenu.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    navMenu.classList.toggle("show");
});
// -------------------------------------

// DARK THEME
function darkTheme() {
    document.body.classList.toggle("dark-theme");
}
// -------------------------------------

// PARALLEL ARRAY TO STORE TASKS
const taskNames = [];
const taskDetails = [];
// EACH DETAIL: { taskNote, taskDueDate: "YYYY-MM-DD", taskPriority, completion status}
// -------------------------------------

/** INSERT ALGORITHM
 * @param {Array} arr - THE ARRAY TO MODIFY
 * @param {number} index - THE INDEX WHERE TO INSERT THE VALUE
 * @param {*} value - THE VALUE TO INSERT
*/
function insertAt(arr, index, value) {
    for (let i = arr.length; i > index; i--) {
        arr[i] = arr[i - 1]; // SHIFTS ELEMENTS TO THE RIGHT
    }
    arr[index] = value; // INSERT A VALUE AT THE SPECIFIED INDEX
}
/** 
 * ANOTHER WAY OF INSERT ALGORITHM
 * function insertAt(arr, index, value) {
 * arr.splice(index, 0, value);
 * }
*/
// -------------------------------------

// DELETE ALGORITHM
function deleteAt(arr, index) {
    for (let i = index; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1]; // SHIFTS ELEMENTS TO THE LEFT
    }
    arr.length--; // REMOVES THE ELEMENT AT INDEX AND SHORTENS THE DATA STRUCTURE
}
/** 
 * ANOTHER WAY OF DELETE ALGORITHM
 *  function deleteAt(arr, index) {
 *     arr.splice(index, 1);
 * }
*/
// -------------------------------------

/** 
 * ADD TASKS
 * @param {string} taskName - NAME OF THE TASK
 * @param {string} taskDueDate - DUE DATE IN YYYY-MM-DD
 * @param {string} taskPriority - PRIORITY OF THE TASK
*/
function addTask(taskName, taskNote, taskDueDate, taskPriority) {
    const index = taskNames.length;
    // 2 INSERTS: STORE DATA OF TASK NAMES AND THE REST SEPARATE
    insertAt(taskNames, index, taskName);
    insertAt(taskDetails, index, { taskNote, taskDueDate, taskPriority, completed: false });
}

// -------------------------------------

/** 
 * DELETE TASKS (IN DATA): REMOVE A TASK AT A GIVEN POSITION
 * @param {number} index - POSITION OF THE TASK
*/
function deleteTask(index) {
    if (index >= 0 && index < taskNames.length) {
        deleteAt(taskNames, index);
        deleteAt(taskDetails, index);
    }
}
// -------------------------------------

/** 
 * FORM VALIDATION
 * @return {boolean} - TRUE IF VALID, FALSE IF NOT
*/
function checkTaskForm(taskName, taskDueDate, taskPriority) {
    let isValid = true;

    // ERROR ELEMENTS
    const taskNameErr = document.getElementById("taskNameErr");
    const taskDueDateErr = document.getElementById("taskDueDateErr");
    const taskPriorityErr = document.getElementById("taskPriorityErr")
    // -------------------------------------

    // TASK NAME MUST BE AT LEAST 6 CHARACTERS
    if (taskName.length < 6) {
        taskNameErr.textContent = "Task Name must be at least 6 characters";
        isValid = false;
    } else {
        taskNameErr.textContent = "";
    }
    // -------------------------------------

    // DUE DATE MUST BE NOT IN THE PAST
    const formDate = new Date(taskDueDate);
    const today = new Date();
    if (!formDate) {
        taskDueDateErr.textContent = "Please add a valid date";
        isValid = false;
    } else {
        if (formDate < today) {
            taskDueDateErr.textContent = "Please select a date not in the past";
            isValid = false;
        } else {
            taskDueDateErr.textContent = "";
        }
    }
    // -------------------------------------

    // PRIORITY MUST BE SELECTED
    if (!taskPriority) {
        taskPriorityErr.textContent = "Please select a priority";
        isValid = false;
    } else {
        taskPriorityErr.textContent = "";
    }
    // -------------------------------------
    return isValid;
}

// FUNCTIONS OF TASK FORM AND ADDED TASKS FORM
document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const addedTasksContainer = document.getElementById("added-tasks");

    // FORM VALIDATION CHECK
    if (taskForm) {
        taskForm.addEventListener("submit", (event) => {
            event.preventDefault(); // PREVENT RELOADING PAGE WHEN SUBMITTING

            // READ EACH VALUE
            const taskName = document.getElementById("task-name").value;
            const taskNote = document.getElementById("task-note").value;
            const taskDueDate = document.getElementById("due-date").value;
            const taskPriority = document.getElementById("priority").value;
            // -------------------------------------

            // STOP IF FAILED FORM VALIDATION
            if (!checkTaskForm(taskName, taskDueDate, taskPriority)) {
                return;
            }
            // -------------------------------------

            // ADD TASK VALUES TO THE AddTask FUNCTION
            addTask(taskName, taskNote, taskDueDate, taskPriority);
            // -------------------------------------

            // CREATE EACH ADDED TASK IN DOM
            const addedTask = document.createElement("div"); // CONTAIN EACH ADDED TASK
            addedTask.classList.add("addedTask"); // TO STYLE ADDED TASKS

            // DISPLAY NONE FOR NOTES WHEN NO ADDED NOTES
            let addedTaskContent = ``;
            if (taskNote !== "") {
                addedTaskContent = `Task: ${taskName}  - Note: ${taskNote} - Due Date: ${taskDueDate} - Priority: ${taskPriority}`
            } else {
                addedTaskContent = `Task: ${taskName} - Due Date: ${taskDueDate} - Priority: ${taskPriority}`
            }

            // CONTENT OF addedTask
            addedTask.innerHTML = `
            <p class="addedTaskDetails">${addedTaskContent}</p>
            <div class="buttons">
            <button class="completeButton" type="button">Complete</button>
            <button class="deleteButton" type="button">Delete</button></div>`;
            // -------------------------------------

            // ADD A NEW DIV OF EACH addedTask AT THE END OF addedTasks
            addedTasksContainer.appendChild(addedTask);
            // -------------------------------------

            // COMPLETE TASK BUTTON:
            const completeButton = addedTask.querySelector(".completeButton");
            const taskText = addedTask.querySelector(".addedTaskDetails");
            completeButton.addEventListener("click", () => {
                taskText.classList.toggle("completedAddedTasks");
                completeButton.classList.toggle("completedButton");
                 completeButton.textContent = completeButton.classList.contains("completedButton")
                    ? "Completed"
                    : "Complete";
            })

            // DELETE TASK BUTTON:
            const deleteButton = addedTask.querySelector(".deleteButton");
            deleteButton.addEventListener("click", () => {
                // Array.from : CONVERT addedTasks TO AN ARRAY
                // USING addedTasksContainer.children BECAUSE IT REQUIRES DOM ELEMENT
                // indexOf : FIND THE INDEX OF addedTask
                const index = Array.from(addedTasksContainer.children).indexOf(addedTask);
                // -------------------------------------
                // REMOVE SELECTED addedTask FROM THE ARRAY
                deleteTask(index);
                // REMOVE SELECTED addedTask FROM THE HTML
                addedTask.remove();
            })
        });
    }
})
// -------------------------------------

// PARALLEL ARRAY TO STORE CONTACT INFORMATION
const contactNames = [];
const contactDetails = [];
// EACH DETAIL: {PHONE NUMBER, EMAIL, CONTACT MESSAGE}
// -------------------------------------

// ADD CONTACT DETAILS AND MESSAGES (IN DATA)
function addContactDetails(contactName, contactPhone, contactEmail, contactMessage) {
    const index = contactNames.length;
    // 2 INSERTS: STORE DATA OF CONTACT NAMES AND CONTACT DETAILS
    insertAt(contactNames, index, contactName);
    insertAt(contactDetails, index, { contactPhone, contactEmail, contactMessage, completed: false });
}

/** 
 * FORM VALIDATION
 * @return {boolean} - TRUE IF VALID, FALSE IF NOT
*/
function checkContactForm(contactName, contactPhone, contactEmail, contactMessage) {
    let isValid = true;

    // ERROR ELEMENTS
    const contactNameErr = document.getElementById("contactNameErr");
    const contactPhoneErr = document.getElementById("contactPhoneErr");
    const contactEmailErr = document.getElementById("contactEmailErr");
    const contactMessageErr = document.getElementById("contactMessageErr");
    // -------------------------------------

    // CONTACT NAME MUST HAVE FIRST NAME AND LAST NAME
    if (contactName.trim().split(" ").length < 2) {
        contactNameErr.textContent = "Please enter your full name";
        isValid = false;
    } else {
        contactNameErr.textContent = "";
    }
    // -------------------------------------

    // CONTACT PHONE NUMBER MUST BE 10 NUMBERS
    if (!/^\d{10}$/.test(contactPhone)) {
        contactPhoneErr.textContent = "Please enter a valid phone number";
        isValid = false;
    } else {
        contactPhoneErr.textContent = "";
    }
    // -------------------------------------

    // CONTACT EMAILS MUST BE VALID EMAILS
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        contactEmailErr.textContent = "Please enter a valid email";
        isValid = false;
    } else {
        contactEmailErr.textContent = "";
    }
    // -------------------------------------

    // CONTACT MESSAGE MUST BE FILLED
    if (contactMessage.trim() === "") {
        contactMessageErr.textContent = "Please enter your message";
        isValid = false;
    } else {
        contactMessageErr.textContent = "";
    }
    return isValid;
}
// -------------------------------------

// FUNCTION OF CONTACT FORM AND ADDED CONTACT MESSAGES
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");

    // FORM VALIDATION CHECK
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // READ EACH VALUE
            const contactName = document.getElementById("contact-name").value;
            const contactPhone = document.getElementById("contact-phone-number").value;
            const contactEmail = document.getElementById("contact-email").value;
            const contactMessage = document.getElementById("contact-message").value;
            // -------------------------------------

            // STOP IF FAILED FORM VALIDATION
            if (!checkContactForm(contactName, contactPhone, contactEmail, contactMessage)) {
                return;
            }
            // -------------------------------------

            // ADD CONTACT VALUES TO THE addContactMessage FUNCTION
            addContactDetails(contactName, contactPhone, contactEmail, contactMessage);
            // -------------------------------------

            // CREATE A CONTENT OF MESSAGE
            const message = document.getElementById("contact-received-message");
            message.textContent = `Thank you, ${contactName} - your message has been sent`;
        })
    }
})
// -------------------------------------





