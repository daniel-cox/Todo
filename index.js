//TODO - Finish API setup
const fetchData = async () => {
    try {
        // Fetch data from the API endpoint
        const response = await fetch('API_EndPoint');
        const data = await response.json();
        // Add each item to the table
        data.forEach(item => {
            addToTable(item);
        });
    } catch (error) {
        // Log errors to the console if the fetch fails
        console.error('Error fetching data: ', error);
    }
};

// Function to create a delete button and attach an event listener
const createDeleteButton = () => {
    // Create a button element
    const deleteBtn = document.createElement('button');
    // Set the inner HTML of the button, including styling and text
    deleteBtn.innerHTML = `<button class="p-3 mt-2 w-full text-center bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 shadow-md">DELETE</button>`;
    // Attach an onclick event listener to the button
    deleteBtn.onclick = () => {
        // When the button is clicked, find the closest 'tr' (table row) ancestor and remove it from the DOM
        this.closest('tr').remove();
    };
    // Return the fully constructed button with the event listener
    return deleteBtn;
};

// Function to compare two dates for sorting
const compareDates = (date1, date2) => {
    // Convert date strings to Date objects
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    // Returns a negative value if d1 is before d2, positive if after, or 0 if equal
    return d1 - d2;
};

// Function to sort table rows by date and reinsert them
const sortTableByDate = () => {
    // Select the table body and get all rows
    const tableBody = document.querySelector('table tbody');
    const rows = Array.from(tableBody.rows);
    // Sort rows based on the date in the first cell
    rows.sort((rowA, rowB) => compareDates(rowA.cells[0].textContent, rowB.cells[0].textContent));
    // Reinsert rows in the sorted order
    rows.forEach(row => tableBody.appendChild(row));
};

// Function to get the current date in YYYY-MM-DD format
const getCurrentFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    // Add leading zero if month or day is less than 10
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    // Return the formatted date string
    return `${year}-${month}-${day}`;
};

window.onload = () => {
    // Set up event delegation for delete buttons in the table
    const table = document.querySelector('table');
    table.addEventListener('click', event => {
        if (event.target.tagName === 'BUTTON') {
            // Find the closest 'tr' ancestor to the button and remove it
            event.target.closest('tr').remove();
        }
    });

    // Select the submit button and add a click event listener
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', () => {
        // Get the values of input fields and trim any whitespace
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

        // Insert a new row into the table body
        const tableBody = document.querySelector('table tbody');
        const newRow = tableBody.insertRow();
        // Set the inner HTML of the new row, creating cells for each piece of data
        newRow.innerHTML = `
            <td class="p-3 text-white text-center">${newDate}</td>
            <td class="p-3 text-white text-center">${newTitle}</td>
            <td class="p-3 text-white text-center">${newTextData}</td>
            <td class="text-center"></td>
        `;
        // Select the cell where the delete button will be placed
        const deleteCell = newRow.cells[3];
        // Append the delete button to the cell
        deleteCell.appendChild(createDeleteButton());
        
        // Reset input fields after submitting
        // Set the date input to the current date
        document.querySelector('.inputContainer1').value = getCurrentFormattedDate();
        document.querySelector('.inputContainer2').value = '';
        document.querySelector('.inputContainer3').value = '';

        // Sort the table after adding the new row
        sortTableByDate();
    });

    // Set the current date in the date input field when the page loads
    document.querySelector('.inputContainer1').value = getCurrentFormattedDate();
};
