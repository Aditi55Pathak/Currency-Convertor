const API_KEY = '5fa32b8ca857f6f78af6361a';  
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// DOM Elements
const themeSelector = document.getElementById('theme');
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const convertBtn = document.getElementById('convertBtn');
const resultBox = document.getElementById('result');
const resultText = document.getElementById('resultText');
const favoriteBtn = document.getElementById('favoriteBtn');
const historyList = document.getElementById('historyList');
const favoritesList = document.getElementById('favoritesList');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// State
let currencies = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
themeSelector.addEventListener('change', handleThemeChange);
swapBtn.addEventListener('click', swapCurrencies);
convertBtn.addEventListener('click', performConversion);
favoriteBtn.addEventListener('click', toggleFavorite);
tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

// Functions
async function initializeApp() {
    await fetchCurrencies();
    populateCurrencySelects();
    loadTheme();
    renderHistory();
    renderFavorites();
}

async function fetchCurrencies() {
    try {
        const response = await fetch(`${BASE_URL}/latest/USD`);
        const data = await response.json();
        currencies = Object.keys(data.conversion_rates);
    } catch (error) {
        console.error('Error fetching currencies:', error);
        currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']; // Fallback
    }
}

function populateCurrencySelects() {
    const selects = [fromCurrencySelect, toCurrencySelect];
    
    selects.forEach(select => {
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            select.appendChild(option);
        });
    });
    
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'EUR';
}

function handleThemeChange() {
    const theme = themeSelector.value;
    document.body.className = theme === 'light' ? '' : `${theme}-theme`;
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeSelector.value = savedTheme;
    if (savedTheme !== 'light') {
        document.body.className = `${savedTheme}-theme`;
    }
}

function swapCurrencies() {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
}

async function performConversion() {
    const amount = amountInput.value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    if (!amount || isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/pair/${fromCurrency}/${toCurrency}`);
        const data = await response.json();
        
        if (data.result === 'error') {
            throw new Error(data['error-type']);
        }
        
        const rate = data.conversion_rate;
        const convertedAmount = (amount * rate).toFixed(2);
        
        const result = {
            amount,
            fromCurrency,
            toCurrency,
            result: convertedAmount,
            timestamp: new Date().toISOString()
        };
        
        displayResult(result);
        addToHistory(result);
    } catch (error) {
        console.error('Error performing conversion:', error);
        showError('Failed to perform conversion. Please try again.');
    }
}

function displayResult(result) {
    resultText.textContent = `${result.amount} ${result.fromCurrency} = ${result.result} ${result.toCurrency}`;
    resultBox.classList.remove('hidden');
    updateFavoriteButton(result);
}

function updateFavoriteButton(result) {
    const isFavorite = favorites.some(fav => 
        fav.fromCurrency === result.fromCurrency && 
        fav.toCurrency === result.toCurrency
    );
    
    favoriteBtn.innerHTML = isFavorite ? 
        '<i class="fas fa-star"></i>' : 
        '<i class="far fa-star"></i>';
}

function toggleFavorite() {
    const currentResult = getCurrentResult();
    if (!currentResult) return;
    
    const existingIndex = favorites.findIndex(fav => 
        fav.fromCurrency === currentResult.fromCurrency && 
        fav.toCurrency === currentResult.toCurrency
    );
    
    if (existingIndex === -1) {
        favorites.unshift(currentResult);
        if (favorites.length > 5) favorites.pop();
    } else {
        favorites.splice(existingIndex, 1);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(currentResult);
    renderFavorites();
}

function getCurrentResult() {
    const resultText = document.getElementById('resultText').textContent;
    if (!resultText) return null;
    
    const match = resultText.match(/(\d+(\.\d+)?)\s+(\w+)\s+=\s+(\d+(\.\d+)?)\s+(\w+)/);
    if (!match) return null;
    
    return {
        amount: match[1],
        fromCurrency: match[3],
        toCurrency: match[6],
        result: match[4]
    };
}

function addToHistory(result) {
    history.unshift(result);
    if (history.length > 5) history.pop();
    localStorage.setItem('history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    renderList(historyList, history);
}

function renderFavorites() {
    renderList(favoritesList, favorites);
}

function renderList(element, items) {
    element.innerHTML = '';
    items.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        
        const conversionText = document.createElement('span');
        conversionText.textContent = `${item.amount} ${item.fromCurrency} = ${item.result} ${item.toCurrency}`;
        
        const actionButton = document.createElement('button');
        if (element === favoritesList) {
            actionButton.innerHTML = '<i class="fas fa-trash"></i>';
            actionButton.addEventListener('click', () => removeFavorite(item));
        } else {
            actionButton.innerHTML = '<i class="far fa-star"></i>';
            actionButton.addEventListener('click', () => addToFavorites(item));
        }
        
        listItem.appendChild(conversionText);
        listItem.appendChild(actionButton);
        element.appendChild(listItem);
    });
}

function addToFavorites(item) {
    if (!favorites.some(fav => 
        fav.fromCurrency === item.fromCurrency && 
        fav.toCurrency === item.toCurrency
    )) {
        favorites.unshift(item);
        if (favorites.length > 5) favorites.pop();
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    }
}

function removeFavorite(item) {
    favorites = favorites.filter(fav => 
        !(fav.fromCurrency === item.fromCurrency && 
          fav.toCurrency === item.toCurrency)
    );
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function switchTab(tabId) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

function showError(message) {
    resultText.textContent = message;
    resultBox.classList.remove('hidden');
    resultBox.style.backgroundColor = '#fee2e2';
    setTimeout(() => {
        resultBox.style.backgroundColor = '';
    }, 3000);
}

// Helper function to format dates
function formatDate(dateString) {
    const options = { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
}