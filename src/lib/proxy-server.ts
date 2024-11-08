// Créer une classe pour gérer le proxy
export class ProxyServer {
  private listeners: ((path: string) => void)[] = [];

  constructor(private baseUrl: string) {}

  async fetch(path: string) {
    const response = await fetch(`${this.baseUrl}${path}`);
    // Notifier les listeners du changement d'URL
    this.listeners.forEach((listener) => listener(path));
    return response;
  }

  onUrlChange(callback: (path: string) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}
