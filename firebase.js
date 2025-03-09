// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

// Your Firebase configuration (hardcoded)
const firebaseConfig = {
    apiKey: "AIzaSyAIYhFTjwrznGg0RksDm7vfGK4uouLdkF4",
    authDomain: "personal-budget-tracker-b95c1.firebaseapp.com",
    projectId: "personal-budget-tracker-b95c1",
    storageBucket: "personal-budget-tracker-b95c1.appspot.com",
    messagingSenderId: "1085711794162",
    appId: "1:1085711794162:web:0c7ff99888cb2336e5f56b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Handle user registration
document.getElementById('registerForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const errorMessageDiv = document.getElementById('error-message');

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            localStorage.clear();  // Clear all stored data for a fresh start
            sessionStorage.setItem("userEmail", email); // Track the logged-in user
            console.log('Registration successful:', userCredential);
            window.location.href = 'taskbar.html';  // Redirect after success
        })
        .catch((error) => {
            errorMessageDiv.textContent = error.message;
            console.error("Registration error:", error);
        });
});

// Handle user login
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMessageDiv = document.getElementById('error-message');

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            localStorage.clear();  // Clear old user data when a new user logs in
            sessionStorage.setItem("userEmail", email); // Track the logged-in user
            console.log('Login successful:', userCredential);
            window.location.href = 'taskbar.html';  // Redirect after success
        })
        .catch((error) => {
            errorMessageDiv.textContent = error.message;
            console.error("Login error:", error);
        });
});

// Elements
const balanceAmount = document.getElementById('balance-amount');
const expensesAmount = document.getElementById('expensesAmount');
const incomeAmount = document.getElementById('incomeAmount');
const totalSavingsAmount = document.getElementById('totalSavingsAmount');
const transactionList = document.getElementById('transactionList');
const goalsContainer = document.getElementById('goalsContainer');
const dateDisplay = document.querySelector('.date');

// Initial state
let balance = 0;
let expenses = 0;
let income = 0;
let totalSavings = 0;
let transactions = [];
let goals = [];

// Get the logged-in user
const userEmail = sessionStorage.getItem("userEmail");

// Load user-specific data
const loadUserData = () => {
    if (userEmail) {
        const storedData = localStorage.getItem(`budgetData_${userEmail}`);
        if (storedData) {
            const data = JSON.parse(storedData);
            balance = data.balance;
            expenses = data.expenses;
            income = data.income;
            totalSavings = data.totalSavings;
            transactions = data.transactions;
            goals = data.goals;
            updateUI();
        }
    }
};

// Save user-specific data
const saveUserData = () => {
    if (userEmail) {
        const data = {
            balance,
            expenses,
            income,
            totalSavings,
            transactions,
            goals
        };
        localStorage.setItem(`budgetData_${userEmail}`, JSON.stringify(data));
    }
};

// Update UI with loaded data
const updateUI = () => {
    balanceAmount.innerText = `Kshs ${balance.toFixed(2)}`;
    expensesAmount.innerText = `Kshs ${expenses.toFixed(2)}`;
    incomeAmount.innerText = `Kshs ${income.toFixed(2)}`;
    totalSavingsAmount.innerText = `Kshs ${totalSavings.toFixed(2)}`;
    updateTransactionList();
    renderGoals();
};

// Event Listeners for overlays
document.getElementById('addExpenseButton').onclick = () => toggleOverlay('expense-overlay');
document.getElementById('addIncomeButton').onclick = () => toggleOverlay('income-overlay');
document.getElementById('addSavingsButton').onclick = () => toggleOverlay('savings-overlay');
document.getElementById('addGoalButton').onclick = () => toggleOverlay('goal-overlay');

// Toggle Overlay
function toggleOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

// Handle Form Submissions
document.getElementById('expense-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const expenseName = e.target.expenseName.value;
    const expenseAmount = parseFloat(e.target.expenseAmount.value);
    const expenseDate = e.target.expenseDate.value;
    const expenseCategory = e.target.expenseCategory.value;

    addTransaction('Expense', expenseName, expenseAmount, expenseDate, expenseCategory);
    updateBalance(-expenseAmount);
    saveUserData();
    toggleOverlay('expense-overlay');
    e.target.reset();
});

document.getElementById('income-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const incomeName = e.target.incomeName.value;
    const incomeAmountValue = e.target.incomeAmount.value;
    const incomeAmount = parseFloat(incomeAmountValue);

    if (isNaN(incomeAmount) || incomeAmount <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    const incomeDate = e.target.incomeDate.value;
    addTransaction('Income', incomeName, incomeAmount, incomeDate);
    updateBalance(incomeAmount);
    saveUserData();
    toggleOverlay('income-overlay');
    e.target.reset();
});

document.getElementById('savings-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const savingsAmount = parseFloat(e.target.savingsAmount.value);
    const savingsDate = e.target.savingsDate.value;

    totalSavings += savingsAmount;
    addTransaction('Savings', 'Savings Contribution', savingsAmount, savingsDate);
    updateBalance(-savingsAmount);
    saveUserData();
    toggleOverlay('savings-overlay');
    e.target.reset();
});

// Update Balance
function updateBalance(amount) {
    balance += amount;
    balanceAmount.innerText = `Kshs ${balance.toFixed(2)}`;
}

// Add Transaction
function addTransaction(type, name, amount, date, category) {
    transactions.push({ type, name, amount, date, category });
    updateTransactionList();
}

// Update Transaction List
function updateTransactionList() {
    transactionList.innerHTML = transactions.map(transaction => `
        <li>${transaction.date} - ${transaction.type}: Kshs ${transaction.amount.toFixed(2)}</li>
    `).join('');
}

// Initialize App
window.onload = () => {
    loadUserData();
};
