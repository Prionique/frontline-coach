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

      // Function to display trainings as a list of cards
      function displayTrainings() {
        let keys;
        const trainingList = document.getElementById("trainingList");
        const nearestTraining = document.getElementById("nearestTraining");

        get(ref(db, "/")).then((sn) => {
          keys = Object.keys(sn.val()["mma"]["trainings"]).reverse();

          // Clear previous content
          trainingList.innerHTML = "";
          nearestTraining.innerHTML = "";

          let nearestDateTime = null;
          const info = document.createElement("div");

          keys.forEach((key) => {
            const training = sn.val()["mma"]["trainings"][key];
            if (!localStorage.getItem(key)) {
              localStorage.setItem(key, []);
            }
            const dateTime = new Date(training.date + "T" + training.time);
            const today = new Date();
            const isToday = dateTime.toDateString() === today.toDateString(); // Check if training is scheduled for today

            if (
              nearestDateTime === null ||
              (dateTime > today && dateTime < nearestDateTime)
            ) {
              nearestDateTime = dateTime;
            }

            // Format date with day of the week in Ukrainian
            const options = {
              weekday: "short",
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            };
            const formattedDateTime = dateTime
              .toLocaleDateString("ru-RU", options)
              .toUpperCase()
              .slice(0, 13);

            // Create card for each training
            const card = document.createElement("div");
            card.classList.add("training-card");

            let a;
            a = `training.html?id=${key}`;
            if (isToday) {
              card.innerHTML = `
                    <div style="display: flex;">
                        <div style="width: 50%;">
                            <strong>${formattedDateTime}</strong>
                            
                            ${training.time}<br>
                        </div>  
                        <div style="width: 50%; display: flex; align-items: center; justify-content: flex-end;">

                            ${
                              isToday
                                ? `<button class="btn btn-primary" onclick="window.location.href='${a}'""><i class="bi bi-arrow-right"></i></button>`
                                : ""
                            }
                        </div>    
                        
                    </div>
                `;
            } else {
              info.innerHTML += `${formattedDateTime}`;
              card.classList.add("hidden");
            }

            // Append card to list container
            trainingList.appendChild(card);
          });
        });
      }

      displayTrainings();