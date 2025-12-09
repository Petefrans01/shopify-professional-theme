// Fonctions globales et utilitaires

// PubSub pour la communication entre composants
const PubSub = {
  events: {},

  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },

  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  },

  unsubscribe(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
};

window.PubSub = PubSub;

// Gestion du menu mobile
class MobileMenu {
  constructor() {
    this.menuToggle = document.querySelector('.header__menu-toggle');
    this.menu = document.querySelector('.header__menu');
    
    if (this.menuToggle && this.menu) {
      this.init();
    }
  }

  init() {
    this.menuToggle.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.menu.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  close() {
    this.menu.classList.remove('active');
    this.menuToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
}

// Lazy Loading des images
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      this.images.forEach(img => imageObserver.observe(img));
    }
  }
}

// Filtres de collection
class CollectionFilters {
  constructor() {
    this.form = document.querySelector('.collection-filters');
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        this.applyFilters();
      }
    });

    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortCollection(e.target.value);
      });
    }
  }

  applyFilters() {
    const formData = new FormData(this.form);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      params.append(key, value);
    }

    window.location.href = `${window.location.pathname}?${params.toString()}`;
  }

  sortCollection(sortBy) {
    const url = new URL(window.location);
    url.searchParams.set('sort_by', sortBy);
    window.location.href = url.toString();
  }
}

// Recherche prédictive
class PredictiveSearch {
  constructor() {
    this.searchInput = document.querySelector('[data-predictive-search-input]');
    this.resultsContainer = document.querySelector('[data-predictive-search-results]');
    
    if (this.searchInput) {
      this.init();
    }
  }

  init() {
    let timeout;
    
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      
      const query = e.target.value;
      
      if (query.length < 3) {
        this.hideResults();
        return;
      }

      timeout = setTimeout(() => {
        this.search(query);
      }, 300);
    });
  }

  async search(query) {
    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`
      );
      
      const data = await response.json();
      this.displayResults(data.resources.results.products);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    }
  }

  displayResults(products) {
    if (!this.resultsContainer) return;

    if (products.length === 0) {
      this.resultsContainer.innerHTML = '<p>Aucun résultat</p>';
      return;
    }

    const html = products.map(product => `
      <a href="${product.url}" class="search-result">
        ${product.featured_image ? `
          <img src="${product.featured_image}" alt="${product.title}">
        ` : ''}
        <div>
          <h4>${product.title}</h4>
          <p>${product.price}</p>
        </div>
      </a>
    `).join('');

    this.resultsContainer.innerHTML = html;
    this.showResults();
  }

  showResults() {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'block';
    }
  }

  hideResults() {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'none';
    }
  }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
  new LazyLoader();
  new CollectionFilters();
  new PredictiveSearch();

  // Smooth scroll pour les ancres
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Accessibilité: focus visible
  document.body.addEventListener('mousedown', () => {
    document.body.classList.add('using-mouse');
  });

  document.body.addEventListener('keydown', () => {
    document.body.classList.remove('using-mouse');
  });
});

// Utilitaires d'accessibilité
window.addEventListener('load', () => {
  const focusableElements = document.querySelectorAll(
    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      if (!document.body.classList.contains('using-mouse')) {
        element.style.outline = '2px solid var(--color-primary)';
      }
    });

    element.addEventListener('blur', () => {
      element.style.outline = '';
    });
  });
});
