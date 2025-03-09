document.addEventListener('DOMContentLoaded', function () {
    const addGoalButton = document.querySelector('.add-goal-button');
    const savingsGoalsContainer = document.querySelector('.savings-goals');

    // Load goals from local storage
    const goals = JSON.parse(localStorage.getItem('goals')) || [];
    goals.forEach(goal => addGoalToPage(goal.name, goal.amount, goal.progress));

    // Function to add a new goal to the page and local storage
    function addGoalToPage(goalName, goalTarget, progress = 0) {
        const newGoal = document.createElement('div');
        newGoal.classList.add('goal');

        newGoal.innerHTML = `
            <div class="goal-details">
                <span class="goal-name">${goalName}</span>
                <span class="goal-amount">Kshs${progress} / Kshs${goalTarget}</span>
            </div>
            <div class="goal-progress-bar">
                <div class="goal-progress" style="width: ${progress / goalTarget * 100}%"></div>
            </div>
        `;

        savingsGoalsContainer.appendChild(newGoal);
    }

    // Event listener to add a new goal
    addGoalButton.addEventListener('click', function () {
        const goalName = prompt('Enter the name of your new savings goal:');
        const goalTarget = parseFloat(prompt('Enter the target amount for this goal (Kshs):'));

        if (goalName && !isNaN(goalTarget) && goalTarget > 0) {
            addGoalToPage(goalName, goalTarget);
            goals.push({ name: goalName, amount: goalTarget, progress: 0 });
            localStorage.setItem('goals', JSON.stringify(goals));
        } else {
            alert('Please enter valid goal details.');
        }
    });
});
