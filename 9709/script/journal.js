import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  get,
  set,
  ref,
  child,
  push,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Function to go back

// Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkknZyH3N6-ZMm31c8o3zFQSv8s45YMDY",
  authDomain: "frontline-sport.firebaseapp.com",
  databaseURL: "https://frontline-sport-default-rtdb.firebaseio.com",
  projectId: "frontline-sport",
  storageBucket: "frontline-sport.appspot.com",
  messagingSenderId: "446981204542",
  appId: "1:446981204542:web:23010639c79d8a6cef7f6f",
  measurementId: "G-4S6SFCJ90N",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tableBody = document.getElementById("tableBody");

get(ref(db, "kick/trainings")).then((snapshot) => {
  const trainings = snapshot.val();
  let s = document.getElementById("tableBody");
  let r = document.getElementById("tb");
  let f = Object.keys(trainings);

  // Get the current month and year
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // Months are 0-indexed
  const currentYear = today.getFullYear();

  // Iterate over trainings to collect users and map them to trainings
  f.forEach((el) => {
    let trainingDate = new Date(el.slice(0, 10));
    let trainingMonth = trainingDate.getMonth() + 1;
    let trainingYear = trainingDate.getFullYear();

    // Only add the column if the training is for the current month
    if (trainingMonth === currentMonth && trainingYear === currentYear) {
      r.innerHTML += `<th>${el.slice(8, 10)}.${el.slice(5, 7)}</th>`;
    }
  });
  let tot;
  // Assuming you have already fetched the `trainings` data from Firebase
  get(ref(db, "users")).then((sn) => {
    let data = sn.val();
    let users = Object.keys(data);

    let totalPresent = {}; // Object to store the total present users for each training session
    tot = 0;
    users.forEach((userId) => {
      let userData = data[userId];

      // Create a cell for the user ID
      if (userData.dir.includes("kick")) {
        tot += 1;
        let row = document.createElement("tr");
        let userIdCell = document.createElement("td");
        userIdCell.textContent = userId;
        row.appendChild(userIdCell);

        Object.keys(trainings).forEach((trainingKey) => {
          let apsent = trainings[trainingKey]["present"];

          // Get the training date
          let trainingDate = new Date(trainingKey.slice(0, 10));
          let trainingMonth = trainingDate.getMonth() + 1;
          let trainingYear = trainingDate.getFullYear();
          let cell = document.createElement("td");

          if (trainingMonth === currentMonth && trainingYear === currentYear) {
            // Check if the user has a date value
            if (userData.date) {
              let userDate = new Date(userData.date);
              // Check if the training date is earlier than the user's date
              if (trainingDate < userDate) {
                cell.textContent = " "; // Show an empty space
              } else {
                if (apsent && Array.isArray(apsent)) {
                  if (apsent.includes(userData["id"])) {
                    cell.textContent = "✓"; // User is present
                    // Increment total present count for this training session
                    totalPresent[trainingKey] =
                      (totalPresent[trainingKey] || 0) + 1;
                  } else {
                    cell.textContent = "-"; // User is absent
                  }
                } else {
                  cell.textContent = " "; // Handle data error case
                }
              }
            } else {
              // If the user does not have a date value, show '+' or '-'
              if (apsent && Array.isArray(apsent)) {
                if (apsent.includes(userData["id"])) {
                  cell.textContent = "✓"; // User is present
                  // Increment total present count for this training session
                  totalPresent[trainingKey] =
                    (totalPresent[trainingKey] || 0) + 1;
                } else {
                  cell.textContent = "-"; // User is absent
                }
              } else {
                cell.textContent = " "; // Handle data error case
              }
            }

            row.appendChild(cell);
          }
        });

        // Append the row to the table body
        tableBody.appendChild(row);
      }
    });

    // Add a last row with the count of total present users for each training session
    let totalRow = document.createElement("tr");
    let totalCell = document.createElement("td");

    totalRow.appendChild(totalCell);

    Object.keys(trainings).forEach((trainingKey) => {
      if (trainingKey.slice(5, 7) === new Date().toLocaleString().slice(3, 5)) {
        let cell = document.createElement("td");
        if (totalPresent.hasOwnProperty(trainingKey)) {
          cell.textContent = `${totalPresent[trainingKey]}/${tot}`;
        } else {
          cell.textContent = `0/${tot}`;
        }
        totalRow.appendChild(cell);
      } else {
        //
      }
    });

    // Append the total row to the table body
    tableBody.appendChild(totalRow);
  });
});
