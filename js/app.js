class UI {
  // The constructor will run every time there is a new instantiation of the UI class
  constructor() {
    this.budgetFeedback = document.querySelector('.budget-feedback');
    this.expenseFeedback = document.querySelector('.expense-feedback');
    this.budgetForm = document.getElementById('budget-form');
    this.budgetInput = document.getElementById('budget-input');
    this.budgetAmount = document.getElementById('budget-amount');
    this.expenseAmount = document.getElementById('expense-amount');
    this.balance = document.getElementById('balance');
    this.balanceAmount = document.getElementById('balance-amount');
    this.expenseForm = document.getElementById('expense-form');
    this.expenseInput = document.getElementById('expense-input');
    this.amountInput = document.getElementById('amount-input');
    this.expenseList = document.getElementById('expense-list');
    this.itemList = [];
    this.itemID = 0;
  }

  // Submit Budget Method
  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (value === '' || value < 0) {
      this.budgetFeedback.classList.add('show-item');
      this.budgetFeedback.innerHTML = `<p>value cannot be empty or negative</p>`;

      // Hide the feedback message
      setTimeout(() => {
        this.budgetFeedback.classList.remove('show-item');
      }, 4000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();
    }
  }

  // Show the balance
  showBalance() {
    const expense = this.totalExpense();
    console.log(expense);
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');
    } else if (total > 0) {
      this.balance.classList.remove('showRed', 'showBlack');
      this.balance.classList.add('showGreen');
    } else {
      this.balance.classList.remove('showRed', 'showGreen');
      this.balance.classList.add('showBlack');
    }
  }

  // Submit Expense Form
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;

    if (expenseValue === '' || amountValue === '' || amountValue < 0) {
      this.expenseFeedback.classList.add('show-item');
      this.expenseFeedback.innerHTML = `<p>values cannot be empty or negative</p>`;

      setTimeout(() => {
        this.expenseFeedback.classList.remove('show-item');
      }, 4000);
    } else {
      let amount = parseInt(amountValue);

      this.expenseInput.value = '';
      this.amountInput.value = '';

      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount
      };

      this.itemID + 1;
      this.itemList.push(expense);

      // Display expense
      this.displayExpense(expense);

      // Show balance
      this.showBalance();
    }
  }

  // Display Expense Method
  displayExpense(expense) {
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML = `
        <div class="expense-item d-flex justify-content-between align-items-baseline">

        <h6 class="expense-title mb-0 text-uppercase list-item">${
          expense.title
        }</h6>
        <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

        <div class="expense-icons list-item">

        <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
          <i class="fas fa-edit"></i>
        </a>
        <a href="#" class="delete-icon" data-id="${expense.id}">
          <i class="fas fa-trash"></i>
        </a>
        </div>
      </div>    
    `;

    this.expenseList.appendChild(div);
  }

  // Total Expenses
  totalExpense() {
    let total = 0;

    if (this.itemList.length > 0) {
      total = this.itemList.reduce((acc, curr) => {
        // console.log(`total is ${acc} and current value is ${curr.amount}`);
        acc += curr.amount;
        // console.log(acc);
        return acc;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  // Edit Expense Method
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;

    // Remove from DOM
    this.expenseList.removeChild(parent);

    let expense = this.itemList.filter(item => {
      return item.id === id;
    });

    // Show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;

    // Remove from the list
    let tempList = this.itemList.filter(item => {
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }

  // Delete Expense Method
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;

    // Remove from DOM
    this.expenseList.removeChild(parent);

    // Remove from List
    let tempList = this.itemList.filter(item => {
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }
}

function eventListeners() {
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  // New instance of the UI class
  const ui = new UI();

  // Budget Form Submit Event
  budgetForm.addEventListener('submit', event => {
    event.preventDefault();
    ui.submitBudgetForm();
  });

  // Expense Form Submit Event
  expenseForm.addEventListener('submit', event => {
    event.preventDefault();
    ui.submitExpenseForm();
  });

  // Expense Form Click Event
  expenseList.addEventListener('click', event => {
    if (event.target.parentElement.classList.contains('edit-icon')) {
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains('delete-icon')) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  eventListeners();
});
