document.addEventListener('DOMContentLoaded', () => {
    // Utility Functions:
    const getCurrentFormattedDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const compareDates = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1 - d2;
    };

    // DOM Manipulation Functions:
    const createCompleteButton = function() {
        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = `<span>Complete</span> <i class="fa-solid fa-check hidden"></i>`;
        completeBtn.classList.add('p-3', 'mt-2', 'w-full', 'text-center', 'bg-green-500', 'text-white', 'rounded-full', 'hover:bg-green-700', 'transition', 'duration-100', 'flex', 'justify-center', 'items-center');
        completeBtn.onclick = function() {
            const tr = this.closest('tr');
            tr.classList.add('animate__animated');
            this.querySelector('span').classList.add('hidden');
            this.querySelector('i').classList.remove('hidden');
            this.disabled = true;
        };
        return completeBtn;
    };

    const createDeleteButton = () => {
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = `DELETE  <i class="fas fa-trash"></i>`;
        deleteBtn.classList.add('delete-btn', 'p-3', 'mt-2', 'ml-3', 'w-full', 'text-center', 'bg-red-500', 'text-white', 'rounded-full', 'hover:bg-red-600', 'transition', 'duration-200', 'shadow-md');
        return deleteBtn;
    };

    const sortTableByDate = () => {
        const tableBody = document.querySelector('table tbody');
        const rows = Array.from(tableBody.rows);
        rows.sort((rowA, rowB) => compareDates(rowA.cells[0].textContent, rowB.cells[0].textContent));
        rows.forEach(row => tableBody.appendChild(row));
    };

    // Event Handlers:
    const table = document.querySelector('table');
    table.addEventListener('click', event => {
        const btn = event.target.closest('button');
        if (!btn) {
            console.log('Click was not on a button.');
            return;
        }
    
        const tr = btn.closest('tr');
        if (!tr) {
            console.log('No <tr> found for this button');
            return;
        }
    
        if (btn.classList.contains('delete-btn')) {
            console.log('Delete button clicked, attempting to delete row:', tr);
        
            tr.classList.add('animate__animated', 'animate__bounceOut');
        
            const removeRow = () => {
                console.log('Removing <tr>');
                if (tr.parentNode) {
                    tr.parentNode.removeChild(tr);
                }
            };
        
            // Remove the row after the animation ends
            tr.addEventListener('animationend', removeRow, { once: true });
        
            // Fallback: Remove the row after a set time if the animation doesn't end
            setTimeout(removeRow, 100); // Adjust the time based on the duration of your animation
        }
    });

    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', () => {
        const newDate = document.querySelector('.inputContainer1').value.trim();
        const newTitle = document.querySelector('.inputContainer2').value.trim();
        const newTextData = document.querySelector('.inputContainer3').value.trim();

        let errorMessage = '';
        errorMessage += newDate === '' ? 'Please choose a date.\n' : '';
        errorMessage += newTitle === '' ? 'You must add a title to save.\n' : '';
        errorMessage += newTextData === '' ? 'You must add something in the notes field to save.\n' : '';

        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        const tableBody = document.querySelector('table tbody');
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
            <td class="p-3 text-white text-center">${newDate}</td>
            <td class="p-3 text-white text-center">${newTitle}</td>
            <td class="p-3 text-white text-center">${newTextData}</td>
            <td class="buttonContain text-center"></td>
        `;
        newRow.classList.add('animate__animated', 'animate__zoomIn');

        setTimeout(() => {
            if (newRow.classList.contains('animate__animated')) {
                newRow.classList.remove('animate__animated', 'animate__zoomIn');
            }
        }, 1000);

        const completeCell = newRow.cells[3];
        completeCell.appendChild(createCompleteButton());

        const deleteCell = newRow.cells[3];
        deleteCell.appendChild(createDeleteButton());

        document.querySelector('.inputContainer1').value = getCurrentFormattedDate();
        document.querySelector('.inputContainer2').value = '';
        document.querySelector('.inputContainer3').value = '';

        sortTableByDate();
    });

    document.querySelector('.inputContainer1').value = getCurrentFormattedDate();
});
