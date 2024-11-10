import { useState, useEffect, useRef } from "react";
import { useWebContainer } from "@/lib/webcontainer-context";
import { PreviewTabs } from "./Preview/PreviewTabs";
import { Fullscreen, Minimize, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PreviewInfoMessage } from "./Preview/ui/PreviewInfoMessage";
import { Loader } from "./Preview/ui/Loader/Loader";

type MessageStatus = "success" | "initializing";

interface StatusMessage {
  text: string;
  variant: MessageStatus;
}

export interface PreviewServer {
  port: number;
  url: string;
  displayUrl: string;
}

interface PreviewProps {
  isFullscreen: boolean;
  onFullscreenChange: (isFullscreen: boolean) => void;
}

export function Preview({ isFullscreen, onFullscreenChange }: PreviewProps) {
  const [servers, setServers] = useState<PreviewServer[]>([]);
  const [activePort, setActivePort] = useState<number | null>(null);
  const [isFirstStart, setIsFirstStart] = useState(true);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [isRunningAndReady, setIsRunningAndReady] = useState(false);
  const { webcontainer, loading, isInstalled } = useWebContainer();

  // Référence pour stocker les timers de fermeture par port
  const closeTimers = useRef<Record<number, NodeJS.Timeout>>({});

  const handleServerUpdate = (
    port: number,
    url: string,
    options: {
      updateUrl?: string;
      setActive?: boolean;
    } = {}
  ) => {
    setServers((prev) => {
      // Si on a une URL à mettre à jour
      if (options.updateUrl !== undefined) {
        return prev.map((server) => {
          if (server.port === port) {
            const newDisplayUrl = `localhost:${port}${options.updateUrl}`;
            const baseUrl = server.url.split("/").slice(0, 3).join("/");
            return {
              ...server,
              url: `${baseUrl}${options.updateUrl}`,
              displayUrl: newDisplayUrl,
            };
          }
          return server;
        });
      }

      // Si le serveur existe déjà, ne rien faire
      const serverExists = prev.some((server) => server.port === port);
      if (serverExists) return prev;

      // Si c'est un nouveau serveur et qu'on doit le rendre actif
      if (options.setActive) {
        setActivePort(port);
      }

      // Ajouter le nouveau serveur
      return [
        ...prev,
        {
          port,
          url,
          displayUrl: `localhost:${port}`,
        },
      ];
    });
  };

  // Fonction pour mettre à jour les URLs
  const handleUrlChange = (port: number, newDisplayUrl: string) => {
    const path = newDisplayUrl.replace(`localhost:${port}`, "") || "/";
    console.log("Updating URL:", path);
    handleServerUpdate(port, "", { updateUrl: path });
  };

  useEffect(() => {
    if (!webcontainer || loading) return;

    // Écouter les nouveaux serveurs
    const serverReadyHandler = (port: number, url: string) => {
      // Si un timer de fermeture existe pour ce port, l'annuler
      if (closeTimers.current[port]) {
        clearTimeout(closeTimers.current[port]);
        delete closeTimers.current[port];
      }

      handleServerUpdate(port, url, { setActive: true });

      setTimeout(() => {
        setIsServerRunning(true);
        setTimeout(() => {
          setIsFirstStart(false);
          setIsRunningAndReady(true);
        }, 2000);
      }, 2000);
    };

    // Écouter la fermeture des ports
    const portHandler = (port: number, type: "open" | "close") => {
      if (type === "close") {
        console.log(`Server stopped on port ${port}`);

        // Créer un nouveau timer pour ce port
        closeTimers.current[port] = setTimeout(() => {
          setServers((prev) => {
            const newServers = prev.filter((server) => server.port !== port);
            if (newServers.length === 0) {
              setIsServerRunning(false);
              setIsRunningAndReady(false);
            }
            return newServers;
          });

          if (activePort === port) {
            setActivePort(null);
          }

          // Nettoyer le timer
          delete closeTimers.current[port];
        }, 2000);
      }
    };

    const unsubscribeServer = webcontainer.on(
      "server-ready",
      serverReadyHandler
    );
    const unsubscribePort = webcontainer.on("port", portHandler);

    // Nettoyer tous les timers au démontage
    return () => {
      unsubscribeServer();
      unsubscribePort();
      Object.values(closeTimers.current).forEach(clearTimeout);
    };
  }, [webcontainer, loading]);

  const getStatusMessages = (): StatusMessage[] => {
    // Premier démarrage des serveurs
    if (isFirstStart) {
      // Initialisation du WebContainer
      if (loading) {
        console.log("📱 Chargement du WebContainer");
        return [
          {
            text: "Initialisation du WebContainer...",
            variant: "initializing",
          },
        ];
      }

      // Installation des dépendances
      if (!isInstalled) {
        console.log("📦 Installation des dépendances");
        return [
          { text: "Initialisation du WebContainer...", variant: "success" },
          { text: "Installation des dépendances...", variant: "initializing" },
        ];
      }

      // Démarrage des serveurs
      if (!servers.length) {
        console.log("⏳ Démarrage des serveurs");
        return [
          { text: "Initialisation du WebContainer...", variant: "success" },
          { text: "Installation des dépendances...", variant: "success" },
          { text: "Démarrage des serveurs...", variant: "initializing" },
        ];
      }

      // Préparation de l'environnement
      if (!isServerRunning) {
        console.log("🌟 Préparation de l'environnement");
        return [
          { text: "Initialisation du WebContainer...", variant: "success" },
          { text: "Installation des dépendances...", variant: "success" },
          { text: "Démarrage des serveurs...", variant: "success" },
          {
            text: "Préparation de l'environnement...",
            variant: "initializing",
          },
        ];
      }

      // Environnement prêt
      console.log("✨ Environnement prêt");
      return [
        { text: "Initialisation du WebContainer...", variant: "success" },
        { text: "Installation des dépendances...", variant: "success" },
        { text: "Démarrage des serveurs...", variant: "success" },
        { text: "Préparation de l'environnement...", variant: "success" },
      ];
    }
    // On est plus sur le premier démarrage
    // Serveurs arrêtés
    if (!servers.length) {
      console.log("⛔ Arrêt des serveurs");
      return [
        { text: "En attente du redémarrage...", variant: "initializing" },
      ];
    }
    // Redémarrage des serveurs
    if (!isServerRunning) {
      console.log("🔄 Redémarrage des serveurs");
      return [
        { text: "En attente du redémarrage...", variant: "success" },
        {
          text: "Préparation de l'environnement...",
          variant: "initializing",
        },
      ];
    }
    // Serveurs redémarrés
    console.log("✅ Serveurs redémarrés");
    return [
      { text: "En attente du redémarrage...", variant: "success" },
      {
        text: "Préparation de l'environnement...",
        variant: "success",
      },
    ];
  };

  const renderMessages = (messages: StatusMessage[]) => (
    <div className="space-y-2">
      {messages.map((message, index) => (
        <div
          key={message.text}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both"
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <PreviewInfoMessage variant={message.variant}>
            {message.text}
          </PreviewInfoMessage>
        </div>
      ))}
    </div>
  );

  // Détermine si on doit afficher le loader
  const shouldShowLoader = () => !isRunningAndReady;

  if (shouldShowLoader()) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {renderMessages(getStatusMessages())}
        <div className="absolute">
          <Loader />
        </div>
      </div>
    );
  }

  const activeServer = servers.find((s) => s.port === activePort);

  // Fonction pour gérer le basculement plein écran
  const toggleFullscreen = () => {
    onFullscreenChange(!isFullscreen);
  };

  const handleReload = () => {
    if (activeServer) {
      // Force le rechargement de l'iframe en réassignant la même URL
      const iframe = document.querySelector<HTMLIFrameElement>(
        `iframe[title="preview-${activeServer.port}"]`
      );
      if (iframe) {
        iframe.src = iframe.src;
      }
    }
  };

  console.log("🚀 Affichage de la preview");

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-card/50",
        isFullscreen && "fixed inset-0 z-50 bg-background"
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50">
        <PreviewTabs
          servers={servers}
          activePort={activePort}
          onPortSelect={setActivePort}
          onUrlChange={handleUrlChange}
        />
        <div className="flex items-center gap-1 mr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleReload}
            title="Recharger la preview"
            disabled={!activeServer}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Réduire" : "Agrandir"}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Fullscreen className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {activeServer ? (
        <iframe
          key={activeServer.url}
          title={`preview-${activeServer.port}`}
          src={activeServer.url}
          className="w-full h-full bg-background"
          sandbox="allow-same-origin allow-scripts allow-forms"
          allow="cross-origin-isolated"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
          Aucun serveur sélectionné
        </div>
      )}
    </div>
  );
}
