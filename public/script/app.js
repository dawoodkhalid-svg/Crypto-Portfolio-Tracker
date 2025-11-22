// Crypto Portfolio Tracker - Client-side JavaScript
// Simple CRUD operations using fetch API

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
  
  //Get form and list elements
  var form = document.getElementById('crypto-form');
  var cryptoItems = document.getElementById('crypto-items');
  var formTitle = document.getElementById('form-title');
  var submitText = document.getElementById('submit-text');
  var cancelBtn = document.getElementById('cancel-btn');
  var filterTabs = document.querySelectorAll('.tab-btn');
  
  //Variables to track state
  var currentFilter = 'all';
  var editingId = null;
  
  //Load cryptos when page loads
  loadCryptos();
  
  //Form submit event
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    //Get form values
    var cryptoData = {
      name: document.getElementById('name').value,
      symbol: document.getElementById('symbol').value.toUpperCase(),
      buyPrice: document.getElementById('buyPrice').value,
      targetPrice: document.getElementById('targetPrice').value,
      status: document.getElementById('status').value,
      notes: document.getElementById('notes').value
    };
    
    //Check if editing or creating
    if (editingId) {
      updateCrypto(editingId, cryptoData);
    } else {
      createCrypto(cryptoData);
    }
  });
  
  //Cancel button click
  cancelBtn.addEventListener('click', function() {
    resetForm();
    form.reset();
  });
  
  //Filter tabs click
  for (var i = 0; i < filterTabs.length; i++) {
    filterTabs[i].addEventListener('click', function(e) {
      // Remove active from all tabs
      for (var j = 0; j < filterTabs.length; j++) {
        filterTabs[j].classList.remove('active');
      }
      // Add active to clicked tab
      e.target.classList.add('active');
      currentFilter = e.target.getAttribute('data-filter');
      loadCryptos();
    });
  }
  
  //CREATE: Add new crypto
  function createCrypto(data) {
    fetch('/api/crypto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      alert('Cryptocurrency added!');
      form.reset();
      loadCryptos();
    })
    .catch(function(error) {
      alert('Error adding crypto');
      console.log(error);
    });
  }
  
  //READ: Load all cryptos
  function loadCryptos() {
    fetch('/api/crypto')
    .then(function(response) {
      return response.json();
    })
    .then(function(cryptos) {
      //Filter if needed
      var filtered = cryptos;
      if (currentFilter !== 'all') {
        filtered = [];
        for (var i = 0; i < cryptos.length; i++) {
          if (cryptos[i].status === currentFilter) {
            filtered.push(cryptos[i]);
          }
        }
      }
      displayCryptos(filtered);
    })
    .catch(function(error) {
      console.log('Error loading cryptos:', error);
    });
  }
  
  //Display cryptos in the page
  function displayCryptos(cryptos) {
    //Clears the list
    cryptoItems.innerHTML = '';
    
    //Check if empty
    if (cryptos.length === 0) {
      cryptoItems.innerHTML = '<p class="empty-message">No cryptocurrencies found.</p>';
      return;
    }
    
    //Loop through each crypto and create card
    for (var i = 0; i < cryptos.length; i++) {
      var crypto = cryptos[i];
      
      //Calculate potential gain
      var gain = ((crypto.targetPrice - crypto.buyPrice) / crypto.buyPrice * 100).toFixed(2);
      var gainClass = gain >= 0 ? 'potential-gain' : 'potential-loss';
      
      //Create card in HTML
      var cardHTML = '<div class="crypto-card">';
      cardHTML += '<div class="crypto-header">';
      cardHTML += '<div class="crypto-title">';
      cardHTML += '<h3>' + crypto.name + '</h3>';
      cardHTML += '<span class="crypto-symbol">' + crypto.symbol + '</span>';
      cardHTML += '</div>';
      cardHTML += '<span class="status-badge status-' + crypto.status + '">';
      cardHTML += (crypto.status === 'owned' ? 'Portfolio' : 'Watchlist');
      cardHTML += '</span></div>';
      
      cardHTML += '<div class="crypto-prices">';
      cardHTML += '<div class="price-item"><div class="price-label">Buy Price</div>';
      cardHTML += '<div class="price-value">$' + parseFloat(crypto.buyPrice).toFixed(2) + '</div></div>';
      cardHTML += '<div class="price-item"><div class="price-label">Target Price</div>';
      cardHTML += '<div class="price-value">$' + parseFloat(crypto.targetPrice).toFixed(2) + '</div></div>';
      cardHTML += '<div class="price-item"><div class="price-label">Potential Gain</div>';
      cardHTML += '<div class="price-value ' + gainClass + '">' + gain + '%</div></div>';
      cardHTML += '</div>';
      
      if (crypto.notes) {
        cardHTML += '<div class="crypto-notes">"' + crypto.notes + '"</div>';
      }
      
      cardHTML += '<div class="crypto-actions">';
      cardHTML += '<button class="btn-edit" onclick="editCrypto(\'' + crypto._id + '\')">Edit</button>';
      cardHTML += '<button class="btn-delete" onclick="deleteCrypto(\'' + crypto._id + '\')">Delete</button>';
      cardHTML += '</div></div>';
      
      cryptoItems.innerHTML += cardHTML;
    }
  }
  
  //UPDATE: Edits crypto (load into form)
  window.editCrypto = function(id) {
    fetch('/api/crypto/' + id)
    .then(function(response) {
      return response.json();
    })
    .then(function(crypto) {
      //Fill the frmo with data 
      document.getElementById('name').value = crypto.name;
      document.getElementById('symbol').value = crypto.symbol;
      document.getElementById('buyPrice').value = crypto.buyPrice;
      document.getElementById('targetPrice').value = crypto.targetPrice;
      document.getElementById('status').value = crypto.status;
      document.getElementById('notes').value = crypto.notes || '';
      
      //Change form title
      formTitle.textContent = 'Edit Crypto';
      submitText.textContent = 'Update Crypto';
      cancelBtn.style.display = 'inline-block';
      editingId = id;
      
      //Scroll to top
      window.scrollTo(0, 0);
    })
    .catch(function(error) {
      alert('Error loading crypto');
    });
  };
  
  //UPDATE Save changes
  function updateCrypto(id, data) {
    fetch('/api/crypto/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      alert('Cryptocurrency updated!');
      form.reset();
      resetForm();
      loadCryptos();
    })
    .catch(function(error) {
      alert('Error updating crypto');
    });
  }
  
  //DELETE: Remove crypto
  window.deleteCrypto = function(id) {
    //Confirm before delete
    if (!confirm('Are you sure you want to delete this cryptocurrency?')) {
      return;
    }
    
    fetch('/api/crypto/' + id, {
      method: 'DELETE'
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      alert('Cryptocurrency deleted!');
      loadCryptos();
    })
    .catch(function(error) {
      alert('Error deleting crypto');
    });
  };
  
  //Reset form to add mode
  function resetForm() {
    editingId = null;
    formTitle.textContent = 'Add New Crypto';
    submitText.textContent = 'Add Crypto';
    cancelBtn.style.display = 'none';
  }
  
});