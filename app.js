// This array stores all transactions in memory
let transactions = [];

function addTransaction() {
  // Grab the values from the form
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  // Don't add if fields are empty
  if (!description || isNaN(amount)) {
    alert('Please fill in all fields!');
    return;
  }

  // Create a transaction object and add it to our array
  const transaction = { description, amount, type };
  transactions.push(transaction);

  // Refresh the UI
  updateDashboard();
  clearForm();
}

function updateDashboard() {
  // Calculate totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  // Update the cards
  document.querySelector('.income p').textContent = `$${income.toFixed(2)}`;
  document.querySelector('.expenses p').textContent = `$${expenses.toFixed(2)}`;
  document.querySelector('.balance p').textContent = `$${balance.toFixed(2)}`;

  // Update the transaction list
  const list = document.getElementById('transactions');
  list.innerHTML = transactions.map(t => `
    <li class="${t.type}">
      <span>${t.description}</span>
      <span>${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}</span>
    </li>
  `).join('');
}

function clearForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

