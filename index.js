// Function to create a delete button and attach an event listener
const createDeleteButton = () => {
    // Create a button element
    const deleteBtn = document.createElement('button');
    // Set the inner HTML of the button, including styling and text
    deleteBtn.innerHTML = `<button class="p-3 mt-5 w-full text-center bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 shadow-md">DELETE</button>`;
    // Attach an onclick event listener to the button
    deleteBtn.onclick = function() {
        // When the button is clicked, find the closest 'tr' (table row) ancestor and remove it from the DOM
        this.closest('tr').remove();
    };
    // Return the fully constructed button with the event listener
    return deleteBtn;
};

// Initialize code to run when the window is fully loaded
window.onload = () => {
    // Select the table element
    const table = document.querySelector('table');
    
    // Add a click event listener to the table for event delegation
    table.addEventListener('click', event => {
        // If the clicked element is a button
        if (event.target.tagName === 'BUTTON') {
            // Find the closest 'tr' ancestor to the button and remove it
            event.target.closest('tr').remove();
        }
    });

    // Select the submit button
    const submitBtn = document.getElementById('submit');
    // Add a click event listener to the submit button
    submitBtn.addEventListener('click', () => {
        // Get the value of input fields and trim any whitespace
        const newDate = document.querySelector('.inputContainer1').value.trim();
        const newTitle = document.querySelector('.inputContainer2').value.trim();
        const newTextData = document.querySelector('.inputContainer3').value.trim();
        
        // Initialize an error message string
        let errorMessage = '';
        // Add error messages if any of the fields are empty
        errorMessage += newDate === '' ? 'Please choose a date.\n' : '';
        errorMessage += newTitle === '' ? 'Please enter a title.\n' : '';
        errorMessage += newTextData === '' ? 'Please enter text data.\n' : '';

        // If there are any error messages, alert them and exit the function
        if (errorMessage) {
            alert(errorMessage);
            return;

        }

        // Select the table body
        const tableBody = document.querySelector('table tbody');
        // Insert a new row into the table body
        const newRow = tableBody.insertRow();
        // Set the inner HTML of the new row, creating cells for each piece of data
        newRow.innerHTML = `
            <td class="p-3 text-white">${newDate}</td>
            <td class="p-3 text-white">${newTitle}</td>
            <td class="p-3 text-white">${newTextData}</td>
            <td></td>
        `;
        // Select the cell where the delete button will be placed
        const deleteCell = newRow.cells[3];
        // Append the delete button to the cell
        deleteCell.appendChild(createDeleteButton());
        // clears the form once the submit button has been selected
        document.querySelector('.inputContainer1').value = '';
        document.querySelector('.inputContainer2').value = '';
        document.querySelector('.inputContainer3').value = '';
    });
};
