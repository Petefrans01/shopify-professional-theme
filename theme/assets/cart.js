// Gestion du panier AJAX
class CartDrawer {
  constructor() {
    this.cart = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.getCart();
  }

  bindEvents() {
    // Boutons d'ajout au panier
    document.querySelectorAll('.product-card__quick-add').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.dataset.productId;
        this.addToCart(productId);
      });
    });

    // Mise à jour de la quantité
    document.querySelectorAll('.quantity-selector__input').forEach(input => {
      input.addEventListener('change', (e) => {
        const key = e.target.dataset.lineItemKey;
        const quantity = parseInt(e.target.value);
        this.updateCart(key, quantity);
      });
    });
  }

  async getCart() {
    try {
      const response = await fetch('/cart.js');
      this.cart = await response.json();
      this.updateCartCount();
      return this.cart;
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
    }
  }

  async addToCart(productId, quantity = 1) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          quantity: quantity
        })
      });

      if (response.ok) {
        const item = await response.json();
        await this.getCart();
        this.showNotification('Produit ajouté au panier');
        return item;
      } else {
        throw new Error('Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      console.error('Erreur:', error);
      this.showNotification('Erreur lors de l\'ajout au panier', 'error');
    }
  }

  async updateCart(key, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: quantity
        })
      });

      if (response.ok) {
        this.cart = await response.json();
        this.updateCartCount();
        location.reload(); // Recharger la page pour afficher les changements
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du panier:', error);
    }
  }

  updateCartCount() {
    const cartCount = document.querySelector('[data-cart-count]');
    if (cartCount && this.cart) {
      cartCount.textContent = this.cart.item_count;
    }
  }

  showNotification(message, type = 'success') {
    // Créer une notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 1rem 2rem;
      background: ${type === 'success' ? '#16a34a' : '#dc2626'};
      color: white;
      border-radius: 4px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialiser le panier
document.addEventListener('DOMContentLoaded', () => {
  new CartDrawer();
});

// Animations CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
