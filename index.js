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
    return d1 - d2;  // A negative value means date1 is before date2, positive means after, 0 means equal
};

// DOM Manipulation Functions:
// These functions interact directly with the DOM, creating, modifying, or deleting elements

// Creates and returns a delete button with an attached event listener for removal animation
const createDeleteButton = () => {
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `<button class="p-3 mt-2 w-full text-center bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 shadow-md">DELETE</button>`;
    deleteBtn.onclick = function() {
        const tr = this.closest('tr'); // Finds the nearest ancestor <tr> element
        tr.classList.add('animate__animated', 'animate__bounceOut'); // Adds animation classes
        tr.addEventListener('animationend', () => { // Listens for the end of the animation
            tr.remove(); // Removes the <tr> from the DOM after the animation
        });
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
            tr.classList.add('animate__animated', 'animate__bounceOut');
            tr.addEventListener('animationend', () => {
                tr.remove(); // Removes the <tr> from the DOM after the animation
            });
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
            <td class="text-center"></td>
        `;
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
