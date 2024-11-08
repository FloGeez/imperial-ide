import { WebContainer } from "@webcontainer/api";
import { files } from "./files";

class WebContainerService {
  private static instance: WebContainerService;
  private webcontainer: WebContainer | null = null;
  private bootPromise: Promise<WebContainer> | null = null;

  private constructor() {}

  static getInstance(): WebContainerService {
    if (!WebContainerService.instance) {
      WebContainerService.instance = new WebContainerService();
    }
    return WebContainerService.instance;
  }

  async boot(): Promise<WebContainer> {
    if (this.webcontainer) return this.webcontainer;
    if (this.bootPromise) return this.bootPromise;

    this.bootPromise = (async () => {
      try {
        console.log("Starting WebContainer boot...");
        this.webcontainer = await WebContainer.boot();

        console.log("Mounting files...");
        await this.webcontainer.mount(files);

        return this.webcontainer;
      } catch (error) {
        console.error("Boot error:", error);
        window.dispatchEvent(
          new CustomEvent("terminal-output", {
            detail: `\x1b[31m❌ Error: ${
              error instanceof Error ? error.message : "Unknown error"
            }\r\n`,
          })
        );
        this.webcontainer = null;
        this.bootPromise = null;
        throw error;
      }
    })();

    return this.bootPromise;
  }

  getWebContainer(): WebContainer | null {
    return this.webcontainer;
  }
}

export const webContainerService = WebContainerService.getInstance();

export function getWebContainer(): WebContainer | null {
  return webContainerService.getWebContainer();
}
