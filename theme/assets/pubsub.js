// Système de publication/abonnement pour la communication entre composants

class PubSubManager {
  constructor() {
    this.subscribers = {};
  }

  subscribe(eventName, callback) {
    if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
    }

    this.subscribers[eventName].push(callback);

    // Retourner une fonction pour se désabonner
    return () => {
      this.subscribers[eventName] = this.subscribers[eventName].filter(
        cb => cb !== callback
      );
    };
  }

  publish(eventName, data) {
    if (!this.subscribers[eventName]) {
      return;
    }

    this.subscribers[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erreur dans l'abonné ${eventName}:`, error);
      }
    });
  }

  clear(eventName) {
    if (eventName) {
      delete this.subscribers[eventName];
    } else {
      this.subscribers = {};
    }
  }
}

// Créer une instance globale
const pubsub = new PubSubManager();

// Événements courants du thème
const THEME_EVENTS = {
  CART_UPDATED: 'cart:updated',
  CART_ERROR: 'cart:error',
  PRODUCT_ADDED: 'product:added',
  VARIANT_CHANGED: 'variant:changed',
  DRAWER_OPENED: 'drawer:opened',
  DRAWER_CLOSED: 'drawer:closed',
  SEARCH_PERFORMED: 'search:performed',
  FILTER_APPLIED: 'filter:applied',
  SORT_CHANGED: 'sort:changed'
};

// Exporter pour utilisation globale
window.PubSub = pubsub;
window.THEME_EVENTS = THEME_EVENTS;

export { pubsub as default, THEME_EVENTS };
