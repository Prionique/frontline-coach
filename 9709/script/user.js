import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, get, set, ref } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
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
    measurementId: "G-4S6SFCJ90N"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let yUsersCount
let notUsersCount
// Function to count the number of users that will get the "y" class
// Function to count the number of users that will get the "y" class
// Function to count the number of users that will get the "y" class
function countNotPaidUsers() {
    const trainingRef = ref(db, 'users/');
    get(trainingRef).then(snapshot => {
        const users = snapshot.val();
        notUsersCount = 0; // Reset count before counting again
        if (users) {
            Object.keys(users).forEach(userId => {
                const user = users[userId];
                if (
                    user &&
                    user['dir'].includes('kick') && // Only consider users in mma directory
                    user['cost'] && // Check if there's a cost associated
                    user['cost']['kick'] !== 'free' && // Make sure it's not a free user
                    (!user['paymentHistory'] || !user['paymentHistory']['kick'])
                ) {
                    notUsersCount++; // Increment count for users who haven't paid
                }
            });
        }
        // Update the HTML content with the count for not paid users
        const currentDate = new Date();
            const currentDay = currentDate.getDate();

        if (currentDay <= 5) {
            // Display red notification
            document.getElementById("y").textContent = notUsersCount
        } else {
            // Display yellow notification
    
            document.getElementById("not-user").textContent = notUsersCount
        }
    })}
// Call the function to count users who haven't paid
countNotPaidUsers();


