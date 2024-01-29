// Utility Functions:
// These functions perform specific tasks and can be used throughout the code

// Returns the current date in YYYY-MM-DD format
const getCurrentFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Compares two dates and returns a numeric value representing their order
const compareDates = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1 - d2; 
};

// DOM Manipulation Functions:
// These functions interact directly with the DOM, creating, modifying, or deleting elements

const createCompleteButton = function() {
    const completeBtn = document.createElement('button');
    completeBtn.innerHTML = `<span>Complete</span> <i class="fa-solid fa-check hidden"></i>`; // Wrap the text in a span for better control
    completeBtn.classList.add('p-3', 'mt-2', 'w-90', 'text-center', 'bg-green-500', 'text-white', 'rounded-full', 'hover:bg-green-700', 'transition', 'duration-100', 'flex', 'justify-center', 'items-center');

    completeBtn.onclick = function() {
        // Finds the nearest <tr> element
        const tr = this.closest('tr');
        tr.classList.add('animate__animated');

        // Hide the text and show only the check icon, and add animation
        this.querySelector('span').classList.add('hidden');
        this.querySelector('i').classList.remove('hidden');
        // this.classList.add('fa-spinner', 'fa-spin'); // Specify your desired button animation

        // Optional: Disable the button after it's clicked to prevent multiple clicks
        this.disabled = true;
    };

    return completeBtn;
};


// Creates and returns a delete button with an attached event listener for removal animation
const createDeleteButton = () => {
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `DELETE <i class="fas fa-trash"></i>`;
    deleteBtn.classList.add('delete-btn', 'p-3', 'mt-2', 'ml-3', 'w-3/12', 'text-center', 'bg-red-500', 'text-white', 'rounded-full', 'hover:bg-red-600', 'transition', 'duration-200', 'shadow-md');

  // Using an arrow function here for modern syntax. Note that 'this' doesn't work the same way in arrow functions.
    deleteBtn.onclick = () => {
        const tr = deleteBtn.closest('tr');
        // Using setTimeout as a fallback for the animationend event.
        setTimeout(() => {
            console.log('Animation duration completed');
            tr.classList.add('fa-animate__animated', 'fa-animate__bounceOut');
            tr.remove(); // Remove the element after the expected duration of the animation
        }, 100);
    };

return deleteBtn;
};

// Sorts the rows of the table based on the date and reinserts them into the DOM in sorted order
const sortTableByDate = () => {
    const tableBody = document.querySelector('table tbody');
    const rows = Array.from(tableBody.rows); // Converts HTMLCollection of rows to an array for sorting
    rows.sort((rowA, rowB) => compareDates(rowA.cells[0].textContent, rowB.cells[0].textContent)); // Uses compareDates to sort rows
    rows.forEach(row => tableBody.appendChild(row)); // Appends the sorted rows back to the table body
};

// Event Handlers:
// These functions are bound to specific events and are triggered when those events occur

// Sets up the initial state of the application and attaches event handlers when the window loads
window.onload = () => {
    const table = document.querySelector('table');
    // Event delegation for DELETE buttons. Listens for clicks on the table and checks if a button was clicked
    table.addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON') {
            const tr = event.target.closest('tr');
            if (event.target.classList.contains('delete-btn')) {
                // Handle delete functionality
                tr.classList.add('animate__animated', 'animate__bounceOut');
                tr.addEventListener('animationend', () => {
                    tr.remove(); // Removes the <tr> from the DOM after the animation
                });
            } else if (event.target.classList.contains('complete-btn')) {
                // Handle complete functionality
                tr.classList.add('complete'); // For example, mark the row as complete
            }
        }
    });

    const submitBtn = document.getElementById('submit');
    // Adds a click event listener to the 'submit' button
    submitBtn.addEventListener('click', () => {
        // Retrieves and trims user input from form fields
        const newDate = document.querySelector('.inputContainer1').value.trim();
        const newTitle = document.querySelector('.inputContainer2').value.trim();
        const newTextData = document.querySelector('.inputContainer3').value.trim();

        // Error handling for empty input fields
        let errorMessage = '';
        errorMessage += newDate === '' ? 'Please choose a date.\n' : '';
        errorMessage += newTitle === '' ? 'You must add a title to save.\n' : '';
        errorMessage += newTextData === '' ? 'You must add something in the notes field to save.\n' : '';

        if (errorMessage) {
            alert(errorMessage); // Alerts the user to the error(s)
            return;
        }

        const tableBody = document.querySelector('table tbody');
        const newRow = tableBody.insertRow(); // Inserts a new row in the table
        // Sets the inner HTML of the new row, creating cells for date, title, notes, and the delete button
        newRow.innerHTML = `
            <td class="p-3 text-white text-center">${newDate}</td>
            <td class="p-3 text-white text-center">${newTitle}</td>
            <td class="p-3 text-white text-center">${newTextData}</td>
            <td class=" buttonContain text-center"></td>
        `;
        newRow.classList.add('animate__animated', 'animate__zoomIn') //Adds an animation to the new row
        
        // Adds the classes immediately, then waits 1 second before checking if the class exists and removing it
setTimeout(() => {
            if (newRow.classList.contains('animate__animated')) {
                newRow.classList.remove('animate__animated', 'animate__zoomIn');
            }
        }, 1000);

    const completeCell = newRow.cells[3]; // Assuming you want the complete button in the 5th column
    completeCell.appendChild(createCompleteButton()); // Adds the complete button to the new row



        const deleteCell = newRow.cells[3];
        deleteCell.appendChild(createDeleteButton()); // Adds the delete button to the new row
        
        // Resets the input fields after a successful submission
        document.querySelector('.inputContainer1').value = getCurrentFormattedDate();
        document.querySelector('.inputContainer2').value = '';
        document.querySelector('.inputContainer3').value = '';

        sortTableByDate(); // Sorts the table after adding the new row
    });

    // Sets the current date in the date input field when the page loads
    document.querySelector('.inputContainer1').value = getCurrentFormattedDate();
};
