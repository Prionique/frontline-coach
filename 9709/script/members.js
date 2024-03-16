import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getDatabase,
  get,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

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

// Array of months
const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Function to dynamically generate payment dropdown options for each month
function generatePaymentDropdown(userId) {
  const paymentDropdownMenu = document.getElementById("paymentDropdownMenu");
  paymentDropdownMenu.innerHTML = ""; // Clear previous options
  months.forEach((month) => {
    get(ref(db, `users/${userId}/paymentHistory/kick/${month}`)).then((sn) => {
      if (!sn.exists()) {
        const listItem = document.createElement("li");

        const monthId = `pay${month}_${userId}`;
        listItem.innerHTML = `<a class="dropdown-item" href="#" id="${monthId}">${month}</a>`;
        paymentDropdownMenu.appendChild(listItem);
      } else {
        //
      }
    });
  });
}

// Function to update payment status
function updatePaymentStatus(userId, month) {
  // Capture the transaction time and date
  const transactionDateTime = new Date().toLocaleString(); // Get the current time in local format
  // Update payment status in Firebase for the specified user and month
  const userRef = ref(db, `users/${userId}/paymentHistory/kick/${month}`);
  if (confirm(`Подтвердите оплату за ${month.toLowerCase()}`)) {
    set(userRef, { paid: true, time: transactionDateTime })
      .then(() => {
        generatePaymentDropdown(userId);
        generatePaymentHistoryTable(userId);
      })
      .catch((error) => {
        console.error("Error updating payment status:", error);
      });
  }
}

// Function to generate payment history table rows
function generatePaymentHistoryTable(userId) {
  const paymentTableBody = document.getElementById("paymentTableBody");
  paymentTableBody.innerHTML = ""; // Clear previous rows
  months.forEach((month) => {
    const paymentRef = ref(db, `users/${userId}/paymentHistory/kick/${month}`);
    get(paymentRef).then((snapshot) => {
      if (snapshot.exists()) {
        const paymentData = snapshot.val();
        const transactionTime = paymentData.time;
        const paidStatus = paymentData.paid ? "Paid" : "Not Paid";
        // Create a new table row and insert data
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
                            <td>${month}</td>
                            <td>${transactionTime}</td>

                        `;
        paymentTableBody.appendChild(newRow);
      }
    });
  });
}

// Add event listener for pay buttons
document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("dropdown-item") &&
    !event.target.classList.contains("disabled")
  ) {
    const userId = document
      .getElementById("userDataModalLabel")
      .getAttribute("data-user-id");
    const month = event.target.textContent; // Extract the month from the button text
    // Update payment status in Firebase
    updatePaymentStatus(userId, month);
    // Disable the dropdown option once paid
    event.target.classList.add("disabled");
    event.target.setAttribute("aria-disabled", "true");
  }
});

// Function to display user data and payment history in the modal
function displayUserData(userId) {
  // Retrieve user data from Firebase using the userId
  const userRef = ref(db, `users/${userId}`);
  get(userRef)
    .then((userSnapshot) => {
      const userData = userSnapshot.val();
      const userCost = userData.cost.kick; // Assuming 'kick' subscription cost status

      // Check if the cost is 'free'

      // For users with a cost, proceed to display the modal
      // Populate modal content with user data
      const userDataContent = document.getElementById("userDataContent");
      userDataContent.innerHTML = `<p class='d-flex'><strong style='text-align: center; margin: 0 auto;'>${userId}</strong></p>`;
      // Generate payment dropdown for the user
      generatePaymentDropdown(userId);
      // Generate payment history table for the user
      generatePaymentHistoryTable(userId);

      // Show the modal dialog if the user has a cost
      if (userCost !== "free") {
        const userDataModal = new bootstrap.Modal(
          document.getElementById("userDataModal")
        );
        userDataModal.show();
      }
    })
    .catch((error) => {
      console.error("Error retrieving user data:", error);
    });
}

let not = 0;
// Function to display user cards
// Function to display user cards
function displayUsers() {
  const trainingList = document.getElementById("trainingList");
  // Reference to the specific training node in Firebase
  const trainingRef = ref(db, `users/`);
  // Fetch the user IDs under the 'users' node
  get(trainingRef).then((snapshot) => {
    const users = snapshot.val();
    let cardsHTML = "";
    if (users) {
      Object.keys(users).forEach((userId) => {
        if (snapshot.val()[userId]["dir"].includes("kick")) {
          // Check if the user's cost is free
          const userCost = users[userId].cost.kick;
          // Customize the card based on the user's cost status
          let cardClass = "training-card";
          let nameStyle = "";
          let arrowIcon = `<span class="arrow"><i class="bi bi-arrow-right"></i></span>`;
          if (userCost === "free") {
            // Set the class to highlight free users
            cardClass += " free-user";
            // Style the name to be green for free users
            // Remove the arrow for free users
            arrowIcon = "";
          }

  
          function add() {
            cardsHTML += `
                                    <div class="${cardClass}" data-user-id="${userId}">
                                        <span style="${nameStyle}">${userId}</span>
                                        ${arrowIcon}
                                    </div>
                                `;
          }

          let h = [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
          ];

          if (users[userId]["paymentHistory"]) {
            if (
              users[userId]["cost"] &&
              users[userId]["cost"]["kick"] &&
              userCost !== "free"
            ) {
              if (
                users[userId]["paymentHistory"] &&
                users[userId]["paymentHistory"]["kick"]
              ) {
                //
              } else {
                cardClass += " not-user";
              }

              if (
                new Date().toLocaleString().slice(0, 2) <=
                new Date(
                  `${new Date().getMonth() + 1}-05-${new Date()
                    .toLocaleString()
                    .slice(6, 10)}`
                )
                  .toLocaleString()
                  .slice(0, 2)
              ) {
                if (
                  !Array.from(
                    Object.keys(users[userId]["paymentHistory"]["kick"])
                  ).includes(h[new Date().getMonth()])
                ) {
                  cardClass += " y";
                }
              } else {
                if (
                  !Array.from(
                    Object.keys(users[userId]["paymentHistory"]["kick"])
                  ).includes(h[new Date().getMonth()])
                ) {
                  cardClass += " not-user";
                }
              }
            }
          } else {
            if (userCost === "paid") {
              if (
                new Date().toLocaleString().slice(0, 2) <=
                new Date(
                  
                  `${new Date().getMonth() + 1}-05-${new Date()
                    .toLocaleString()
                    .slice(6, 10)}`
                )
                  .toLocaleString()
                  .slice(0, 2)
              ) {
        
                if (users[userId]["paymentHistory"]) {
                  if (users[userId]["paymentHistory"]["kick"]) {
                    cardClass += " y";
                  }
                } else {
                  cardClass += " y";
                }
              } else {
                cardClass += " not-user";
              }
            }
          }

          add();
        }
      });

      trainingList.innerHTML = cardsHTML;
      // Add event listener to each user card
      document.querySelectorAll(".training-card").forEach((card) => {
        card.addEventListener("click", () => {
          const userId = card.getAttribute("data-user-id");
          // Display user data and payment history in the modal
          displayUserData(userId);
          // Set the data-user-id attribute of the modal label
          document
            .getElementById("userDataModalLabel")
            .setAttribute("data-user-id", userId);
        });
      });
    }
  });
}

// Call the function to display users
displayUsers();
export let a = $(".y").length;