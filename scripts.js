const modal = {
  open() {
    document.querySelector('.modal-overlay').classList.add('active')
    document.querySelector('.footer').classList.add('sr-only')
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active')
    document.querySelector('.footer').classList.remove('sr-only')
  }
}

const sumTransactions = {
  all: [
    {
      id: 1,
      description: 'Luz',
      amount: -50000,
      date: '23/01/2021'
    },

    {
      id: 2,
      description: 'Criação Website',
      amount: 500000,
      date: '23/01/2021'
    },
    {
      id: 3,
      description: 'Internet',
      amount: -20000,
      date: '23/01/2021'
    },
    {
      id: 4,
      description: 'Criação de App',
      amount: 2000000,
      date: '23/01/2021'
    },
    {
      id: 5,
      description: 'Compras',
      amount: -100000,
      date: '23/01/2021'
    }
  ],
  add(transaction) {
    sumTransactions.all.push(transaction)

    app.reload()
  },

  remove(index) {
    sumTransactions.all.splice(index, 1)

    app.reload()
  },
  incomes() {
    let income = 0
    sumTransactions.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })
    return income
  },
  expenses() {
    let expense = 0
    sumTransactions.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense
  },
  total() {
    let total = sumTransactions.incomes() + sumTransactions.expenses()
    return total
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction(transactionList, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transactionList)

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transactionList) {
    const CSSclass = transactionList.amount > 0 ? 'income' : 'expense'

    const amount = utils.formatCurrency(transactionList.amount)

    const html = ` 
           
              <td class="description">${transactionList.description}</td>
              <td class="${CSSclass}">${amount}</td>
              <td class="date">${transactionList.date}</td>
              <td>
                <img src="images/minus.svg" alt="minus sign">
              </td>
    `

    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = utils.formatCurrency(
      sumTransactions.incomes()
    )
    document.getElementById('expenseDisplay').innerHTML = utils.formatCurrency(
      sumTransactions.expenses()
    )
    document.getElementById('totalDisplay').innerHTML = utils.formatCurrency(
      sumTransactions.total()
    )
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }

  //must create method to update balance here.
}

const utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, '')

    value = Number(value) / 100

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + value
  }
}

// Calls

const app = {
  init() {
    sumTransactions.all.forEach(transactionList => {
      DOM.addTransaction(transactionList)
    })

    DOM.updateBalance()
  },

  reload() {
    DOM.clearTransactions()
    app.init()
  }
}

app.init()
