// Constantes et configuration globale

window.theme = window.theme || {};

// Routes Shopify
window.theme.routes = {
  cart_add_url: '/cart/add.js',
  cart_change_url: '/cart/change.js',
  cart_update_url: '/cart/update.js',
  cart_url: '/cart.js',
  predictive_search_url: '/search/suggest.json'
};

// Messages de traduction
window.theme.strings = {
  addToCart: 'Ajouter au panier',
  soldOut: 'Épuisé',
  unavailable: 'Non disponible',
  addedToCart: 'Ajouté au panier',
  cartError: 'Erreur lors de la mise à jour du panier',
  quantityError: 'Quantité invalide',
  loading: 'Chargement...',
  noResults: 'Aucun résultat',
  searchPlaceholder: 'Rechercher...'
};

// Configuration du thème
window.theme.config = {
  enableQuickView: true,
  enableWishlist: false,
  cartType: 'drawer', // 'drawer' ou 'page'
  currencyFormat: '€{{amount}}',
  moneyFormat: '€{{amount_with_comma_separator}}',
  showVendor: false,
  showSaleLabel: true,
  enableImageZoom: true
};

// Fonctions utilitaires
window.theme.utils = {
  formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || window.theme.config.moneyFormat;

    function formatWithDelimiters(number, precision = 2, thousands = '.', decimal = ',') {
      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  },

  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  serializeForm(form) {
    const formData = new FormData(form);
    const serialized = {};
    
    for (const [key, value] of formData.entries()) {
      serialized[key] = value;
    }
    
    return serialized;
  },

  getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  updateUrlParameter(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
  }
};

// Export pour utilisation dans d'autres fichiers
export default window.theme;
