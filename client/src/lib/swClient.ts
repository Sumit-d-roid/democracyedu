export type UpdateInfo = { registration: ServiceWorkerRegistration; waiting: ServiceWorker };

class SWClient {
  private registration?: ServiceWorkerRegistration;
  private updateListeners: Array<(info: UpdateInfo) => void> = [];

  init() {
    if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
    window.addEventListener('load', () => {
      const versionParam = `v=${Date.now()}`;
      navigator.serviceWorker
        .register(`/service-worker.js?${versionParam}`)
        .then((reg) => {
          this.registration = reg;
          // If there's an updated SW waiting, notify
          if (reg.waiting) this.notifyWaiting(reg);

          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.addEventListener('statechange', () => {
              if (installing.state === 'installed' && reg.waiting) {
                this.notifyWaiting(reg);
              }
            });
          });
        })
        .catch((err) => console.error('[SW] register failed', err));
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // When a new SW takes control, reload once
      if (!sessionStorage.getItem('sw-updated')) {
        sessionStorage.setItem('sw-updated', '1');
        window.location.reload();
      }
    });
  }

  onUpdate(cb: (info: UpdateInfo) => void) {
    this.updateListeners.push(cb);
    return () => {
      this.updateListeners = this.updateListeners.filter((f) => f !== cb);
    };
  }

  private notifyWaiting(reg: ServiceWorkerRegistration) {
    if (reg.waiting) {
      this.updateListeners.forEach((cb) => cb({ registration: reg, waiting: reg.waiting! }));
    }
  }

  skipWaiting() {
    const sw = this.registration?.waiting;
    if (sw) {
      sw.postMessage({ type: 'SKIP_WAITING' });
    }
  }
}

export const swClient = new SWClient();
