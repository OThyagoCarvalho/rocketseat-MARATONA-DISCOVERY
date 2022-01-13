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

const storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transaction')) || []
  },

  set(transactions) {
    return localStorage.setItem(
      'dev.finances:transaction',
      JSON.stringify(transactions)
    )
  }
}

const sumTransactions = {
  all: storage.get(),

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
    tr.innerHTML = DOM.innerHTMLTransaction(transactionList, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transactionList, index) {
    const CSSclass = transactionList.amount > 0 ? 'income' : 'expense'

    const amount = utils.formatCurrency(transactionList.amount)

    const html = ` 
           
              <td class="description">${transactionList.description}</td>
              <td class="${CSSclass}">${amount}</td>
              <td class="date">${transactionList.date}</td>
              <td>
                <img onclick="sumTransactions.remove(${index})" src="images/minus.svg" alt="minus sign">
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
  formatAmount(value) {
    value = Number(value) * 100

    return value
  },
  formatDate(date) {
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
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

const form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: form.description.value,
      amount: form.amount.value,
      date: form.date.value
    }
  },

  validateFields() {
    const { description, amount, date } = form.getValues()
    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Todos os campos são obrigatórios')
    }
  },
  formatValues() {
    let { description, amount, date } = form.getValues()

    amount = utils.formatAmount(amount)
    date = utils.formatDate(date)

    return { description, amount, date }
  },

  clearFields() {
    form.description.value = ''
    form.amount.value = ''
    form.date.value = ''
  },

  submit(event) {
    event.preventDefault()

    try {
      form.validateFields()
      const transaction = form.formatValues()
      sumTransactions.add(transaction)
      form.clearFields()
      modal.close()
    } catch (error) {
      alert(error.message)
    }
  }
}

const app = {
  init() {
    sumTransactions.all.forEach(DOM.addTransaction)
    DOM.updateBalance()

    storage.set(sumTransactions.all)
  },

  reload() {
    DOM.clearTransactions()
    app.init()
  }
}

app.init()
