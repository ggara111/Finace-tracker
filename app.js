let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let spendingChart = null;

function addTransaction() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const date = new Date().toLocaleDateString();

  if (!description || isNaN(amount)) {
    alert('Please fill in all fields!');
    return;
  }

  const category = document.getElementById('category').value;
  const transaction = { description, amount, type, category, date };
  transactions.push(transaction);
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

  updateChart(); // <-- right here, inside updateDashboard, at the bottom
}

function clearForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

function toggleFinn() {
  const popup = document.getElementById('finnPopup');
  popup.classList.toggle('open');
}

function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Show selected page
  document.getElementById(`page-${pageName}`).classList.add('active');

  // Highlight active nav item
  event.currentTarget.classList.add('active');
}


function updateChart() {
  const expenses = transactions.filter(t => t.type === 'expense');

  const categoryTotals = {};
  expenses.forEach(t => {
    const cat = t.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);
  const colors = [
    '#4ade80', '#f87171', '#60a5fa', '#facc15',
    '#c084fc', '#fb923c', '#34d399', '#f472b6'
  ];

  if (spendingChart) {
    spendingChart.destroy();
  }

  if (labels.length === 0) return;

  const ctx = document.getElementById('spendingChart').getContext('2d');
  spendingChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: '#ffffff' }
        }
      }
    }
  });
}

// Load everything when page opens
updateDashboard();

