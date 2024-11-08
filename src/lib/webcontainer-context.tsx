import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { WebContainer } from "@webcontainer/api";
import { webContainerService } from "./webcontainer";

interface WebContainerContextType {
  webcontainer: WebContainer | null;
  loading: boolean;
  error: Error | null;
  isInstalled: boolean;
  setIsInstalled: (value: boolean) => void;
}

const WebContainerContext = createContext<WebContainerContextType>({
  webcontainer: null,
  loading: true,
  error: null,
  isInstalled: false,
  setIsInstalled: () => {},
});

export function WebContainerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<
    Omit<WebContainerContextType, "setIsInstalled">
  >({
    webcontainer: null,
    loading: true,
    error: null,
    isInstalled: false,
  });

  const setIsInstalled = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, isInstalled: value }));
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const instance = await webContainerService.boot();
        setState({
          webcontainer: instance,
          loading: false,
          error: null,
          isInstalled: false,
        });
      } catch (err) {
        setState({
          webcontainer: null,
          loading: false,
          error:
            err instanceof Error
              ? err
              : new Error("Failed to initialize WebContainer"),
          isInstalled: false,
        });
      }
    };

    initialize();
  }, []);

  return (
    <WebContainerContext.Provider value={{ ...state, setIsInstalled }}>
      {children}
    </WebContainerContext.Provider>
  );
}

export function useWebContainer() {
  return useContext(WebContainerContext);
}
