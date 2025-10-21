// PWA utilities for service worker registration and management

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

// Service Worker registration
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('Service Worker registered:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, show update notification
            showUpdateNotification();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Show update notification when new content is available
function showUpdateNotification() {
  // You could show a toast/banner here
  console.log('New content available! Please refresh the page.');
  
  // Auto-reload after a delay (optional)
  setTimeout(() => {
    if (confirm('New content is available. Reload to get the latest version?')) {
      window.location.reload();
    }
  }, 3000);
}

// PWA install prompt management
export class PWAInstallManager {
  private installPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private listeners: ((state: PWAInstallState) => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.installPrompt = e as BeforeInstallPromptEvent;
      this.notifyListeners();
    });

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      this.isInstalled = true;
      this.installPrompt = null;
      this.notifyListeners();
    });

    // Check if launched from home screen (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as { standalone?: boolean }).standalone) {
      this.isInstalled = true;
    }
  }

  public getState(): PWAInstallState {
    return {
      isInstallable: !!this.installPrompt,
      isInstalled: this.isInstalled,
      installPrompt: this.installPrompt
    };
  }

  public async promptInstall(): Promise<boolean> {
    if (!this.installPrompt) {
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choiceResult = await this.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA install');
        return true;
      } else {
        console.log('User dismissed PWA install');
        return false;
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    } finally {
      this.installPrompt = null;
      this.notifyListeners();
    }
  }

  public onStateChange(callback: (state: PWAInstallState) => void) {
    this.listeners.push(callback);
    // Call immediately with current state
    callback(this.getState());
  }

  public removeListener(callback: (state: PWAInstallState) => void) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(callback => callback(state));
  }
}

// Background sync for offline form submissions
export function queueFormSubmission(formData: Record<string, unknown>, endpoint: string) {
  if ('serviceWorker' in navigator && 'sync' in (window as { ServiceWorkerRegistration: { prototype: { sync?: unknown } } }).ServiceWorkerRegistration.prototype) {
    // Store form data in IndexedDB for background sync
    storeFormDataForSync(formData, endpoint);
    
    // Register for background sync
    navigator.serviceWorker.ready.then(registration => {
      const syncRegistration = registration as unknown as { sync: { register: (tag: string) => Promise<void> } };
      return syncRegistration.sync.register('contact-form-sync');
    }).catch(error => {
      console.error('Background sync registration failed:', error);
    });
  }
}

// Store form data in IndexedDB for offline submission
function storeFormDataForSync(formData: Record<string, unknown>, endpoint: string) {
  const request = indexedDB.open('improtango-offline', 1);
  
  request.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains('pendingSubmissions')) {
      db.createObjectStore('pendingSubmissions', { keyPath: 'id', autoIncrement: true });
    }
  };
  
  request.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const transaction = db.transaction(['pendingSubmissions'], 'readwrite');
    const store = transaction.objectStore('pendingSubmissions');
    
    store.add({
      formData,
      endpoint,
      timestamp: Date.now()
    });
  };
}

// Check if PWA features are supported
export function checkPWASupport() {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    manifest: 'manifest' in document.createElement('link'),
    installPrompt: 'BeforeInstallPromptEvent' in window,
    backgroundSync: 'serviceWorker' in navigator && 'sync' in (window as { ServiceWorkerRegistration: { prototype: { sync?: unknown } } }).ServiceWorkerRegistration.prototype,
    pushNotifications: 'PushManager' in window,
    notifications: 'Notification' in window
  };
}