document.addEventListener("DOMContentLoaded", async () => {
  const apiBaseUrl = "https://65b91e80b71048505a8a3b52.mockapi.io/Data"

  // Utility Functions:
  const getCurrentFormattedDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const compareDates = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1 - d2
  }

  // DOM Manipulation Functions:
  const createCompleteButton = function () {
    const completeBtn = document.createElement("button")
    completeBtn.innerHTML = `<span>Complete</span> <i class="fa-solid fa-check hidden"></i>`
    completeBtn.classList.add(
      "p-3",
      "mt-2",
      "w-full",
      "text-center",
      "bg-slate-500",
      "text-white",
      "rounded-full",
      "hover:bg-slate-700",
      "transition",
      "duration-100",
      "flex",
      "justify-center",
      "items-center"
    )

    completeBtn.onclick = function () {
      const tr = this.closest("tr")
      const span = this.querySelector("span")
      const icon = this.querySelector("i.fa-check")

      // Toggle class based on current state
      if (icon.classList.contains("hidden")) {
        // Mark as complete
        tr.classList.add("animate__animated")
        span.classList.add("hidden")
        icon.classList.remove("hidden")
        this.classList.replace("bg-slate-500", "bg-green-500") // Change button color to gray
        this.classList.add("hover:bg-green-700") // Change hover color to darker gray
      } else {
        // Unmark as complete
        tr.classList.remove("animate__animated")
        span.classList.remove("hidden")
        icon.classList.add("hidden")
        this.classList.replace("bg-green-500", "bg-slate-500") // Change button color back to green
        this.classList.remove("hover:bg-green-700") // Revert hover color to original
      }
    }
    return completeBtn
  }

  const createDeleteButton = (id) => {
    const deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `DELETE <i class="fas fa-trash"></i>`
    deleteBtn.classList.add(
      "delete-btn",
      "p-3",
      "mt-2",
      "ml-3",
      "w-full",
      "text-center",
      "bg-red-500",
      "text-white",
      "rounded-full",
      "hover:bg-red-600",
      "transition",
      "duration-200",
      "shadow-md"
    )
    deleteBtn.addEventListener("click", () => deleteData(id))
    return deleteBtn
  }

  const makeCellEditable = (cell) => {
    cell.addEventListener("dblclick", function () {
      const inputType = cell.cellIndex === 0 ? "date" : "text" // Assuming Date is the first column
      const oldValue = cell.innerText
      const input = document.createElement(
        inputType === "date" ? "input" : "textarea"
      )
      input.type = inputType
      input.value = oldValue
      input.className = cell.className // Copy class for styling
      input.style = "width: 50%; background-color: #1a232b; color: #fff;" // Set background color and text color

      // Replace cell content with the input
      cell.innerHTML = ""
      cell.appendChild(input)
      input.focus()

      const finishEdit = () => {
        const newValue = input.value.trim()
        if (newValue && newValue !== oldValue) {
          updateData(cell, newValue) // Update the cell and backend data
        } else {
          cell.innerHTML = oldValue // Revert to old value if no change
        }
      }

      input.addEventListener("blur", finishEdit)
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && inputType !== "date") {
          // Prevent Enter in date inputs
          finishEdit()
        }
      })
    })
  }

  const sortTableByDate = () => {
    const tableBody = document.querySelector("table tbody")
    const rows = Array.from(tableBody.rows)
    rows.sort((rowA, rowB) =>
      compareDates(rowA.cells[0].textContent, rowB.cells[0].textContent)
    )
    rows.forEach((row) => tableBody.appendChild(row))
  }

  // Event Handlers:
  const table = document.querySelector("table")
  table.addEventListener("click", (event) => {
    const btn = event.target.closest("button")
    if (!btn) {
      return
    }

    const tr = btn.closest("tr")
    if (!tr) {
      return
    }

    if (btn.classList.contains("delete-btn")) {
      // Delete functionality is handled in createDeleteButton now
    }
  })

  const submitBtn = document.getElementById("submit")
  submitBtn.addEventListener("click", async () => {
    const newDate = document.querySelector(".inputContainer1").value.trim()
    const newTitle = document.querySelector(".inputContainer2").value.trim()
    const newTextData = document.querySelector(".inputContainer3").value.trim()

    let errorMessage = ""
    errorMessage += newDate === "" ? "Please choose a date.\n" : ""
    errorMessage += newTitle === "" ? "You must add a title to save.\n" : ""
    errorMessage +=
      newTextData === ""
        ? "You must add something in the notes field to save.\n"
        : ""

    if (errorMessage) {
      alert(errorMessage)
      return
    }

    const dataToSend = {
      Date: newDate,
      Title: newTitle,
      Notes: newTextData,
    }

    const createdData = await createData(dataToSend)
    if (createdData && createdData.id) {
      appendDataToTable(createdData)
    }
  })

  // Function to append data to the table
  const appendDataToTable = (data) => {
    const tableBody = document.querySelector("table tbody")
    const newRow = tableBody.insertRow()
    newRow.setAttribute("data-id", data.id)
    newRow.innerHTML = `
            <td class="p-3 text-white text-center">${data.Date}</td>
            <td class="p-3 text-white text-center">${data.Title}</td>
            <td class="p-3 text-white text-center">${data.Notes}</td>
            <td class="buttonContain text-center"></td>
        `
    newRow.classList.add("animate__animated", "animate__zoomIn")

    setTimeout(() => {
      if (newRow.classList.contains("animate__animated")) {
        newRow.classList.remove("animate__animated", "animate__zoomIn")
      }
    }, 100)

    const cells = newRow.querySelectorAll("td")
    cells.forEach((cell, index) => {
      if (index < 3) {
        // Assuming first 3 columns should be editable
        makeCellEditable(cell)
      }
    })

    const completeCell = newRow.cells[3]
    completeCell.appendChild(createCompleteButton())

    const deleteCell = newRow.cells[3]
    deleteCell.appendChild(createDeleteButton(data.id)) // Pass the id to delete button

    document.querySelector(".inputContainer1").value = getCurrentFormattedDate()
    document.querySelector(".inputContainer2").value = ""
    document.querySelector(".inputContainer3").value = ""

    sortTableByDate()
  }

  // Function to Create Data
  async function createData(data) {
    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else {
        const responseData = await response.json()
        return responseData // Return the created data, including the ID
      }
    } catch (error) {
      console.error("Error creating data:", error)
    }
  }

  // Function to Read Data
  async function readData() {
    try {
      const response = await fetch(apiBaseUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else {
        const responseData = await response.json()
        return responseData // Return the retrieved data
      }
    } catch (error) {
      console.error("Error reading data:", error)
    }
  }

  // Function to Update Data
  const updateData = async (cell, newValue) => {
    const row = cell.parentNode
    const id = row.getAttribute("data-id")
    const columnNames = ["Date", "Title", "Notes"] // Column names
    const fieldToUpdate = columnNames[cell.cellIndex]

    const dataToUpdate = { [fieldToUpdate]: newValue }

    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else {
        cell.innerHTML = newValue // Update cell in the DOM
        console.log(`Data updated successfully for ID: ${id}`)
      }
    } catch (error) {
      console.error("Error updating data:", error)
      cell.innerHTML = cell.getAttribute("data-old-value") // Revert to old value on error
    }
  }

  // Function to Delete Data
  async function deleteData(id) {
    const deleteUrl = `${apiBaseUrl}/${id}`
    console.log("Attempting to delete data at URL:", deleteUrl) // Log the URL for debugging

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      } else {
        console.log("Data deleted successfully:", id)
        // Remove the corresponding row from the table
        const tableRowToDelete = document.querySelector(`tr[data-id='${id}']`)
        if (tableRowToDelete) {
          tableRowToDelete.remove()
        }
      }
    } catch (error) {
      console.error("Error deleting data:", error)
    }
  }

  // Display existing data on page load
  await displayExistingData()

  document.querySelector(".inputContainer1").value = getCurrentFormattedDate()

  async function displayExistingData() {
    const existingData = await readData()
    if (existingData && Array.isArray(existingData)) {
      existingData.forEach((data) => {
        appendDataToTable(data)
      })
    }
  }
})
