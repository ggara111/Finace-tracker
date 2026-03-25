// Load transactions from localStorage on startup
// If nothing saved yet, start with empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const date = new Date().toLocaleDateString();

  if (!description || isNaN(amount)) {
    alert('Please fill in all fields!');
    return;
  }

  const transaction = { description, amount, type, date };
  transactions.push(transaction);

  // Save to localStorage every time we add a transaction
  saveTransactions();
  updateDashboard();
  clearForm();
}

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  updateDashboard();
}

function updateDashboard() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  document.querySelector('.income p').textContent = `$${income.toFixed(2)}`;
  document.querySelector('.expenses p').textContent = `$${expenses.toFixed(2)}`;
  document.querySelector('.balance p').textContent = `$${balance.toFixed(2)}`;

  const list = document.getElementById('transactions');
  list.innerHTML = transactions.map((t, index) => `
    <li class="${t.type}">
      <span>${t.description}</span>
      <span class="date">${t.date}</span>
      <span>${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${index})">✕</button>
    </li>
  `).join('');
}

function clearForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

// Load existing transactions when page opens
updateDashboard();

