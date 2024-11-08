import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useWebContainer } from "@/lib/webcontainer-context";
import "@xterm/xterm/css/xterm.css";

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const currentProcessRef = useRef<any>(null);
  const { webcontainer, setIsInstalled } = useWebContainer();

  useEffect(() => {
    if (!terminalRef.current || !webcontainer) return;

    const term = new XTerm({
      theme: {
        background: "#030712",
        foreground: "#FFE81F",
        cursor: "#FFE81F",
        cursorAccent: "#030712",
      },
      fontFamily: "monospace",
      fontSize: 14,
      cursorBlink: true,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.open(terminalRef.current);
    fitAddon.fit();

    term.write(`
\x1b[0m
                  .-.          ╔════════════════════════════╗
                 |_:_|         ║   TERMINAL IMPÉRIAL v1.0   ║
                /(_Y_)\\        ║                            ║
               ( \\/M\\/ )       ║  "Impressive,              ║
            _.'-/'-'\\-'._      ║        very impressive"    ║
           /   '     '   \\     ║           - Darth Vader    ║
          /  ,    .-.    \\     ╚════════════════════════════╝
\x1b[0m\r\n`);

    // Démarrer jsh
    const startShell = async () => {
      try {
        const shellProcess = await webcontainer.spawn("jsh", {
          terminal: { cols: term.cols, rows: term.rows },
        });
        currentProcessRef.current = shellProcess;

        // État pour la gestion du prompt
        let isWaitingForPrompt = false;
        let commandCompleteCallback: (() => void) | null = null;

        // Configuration des streams
        shellProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              term.write(data);
              // Si on attend le prompt et qu'on le voit, on signale que la commande est terminée
              if (isWaitingForPrompt && data.includes("~/")) {
                isWaitingForPrompt = false;
                commandCompleteCallback?.();
              }
            },
          })
        );

        const shellInput = shellProcess.input.getWriter();
        term.onData((data) => shellInput.write(data));

        // Exécuter une commande et attendre qu'elle soit terminée
        const executeCommand = async (command: string) => {
          shellInput.write(command + "\n");
          await new Promise<void>((resolve) => {
            isWaitingForPrompt = true;
            commandCompleteCallback = resolve;
          });
        };

        // Attendre que le shell soit prêt
        await new Promise<void>((resolve) => {
          isWaitingForPrompt = true;
          commandCompleteCallback = resolve;
        });

        // Exécuter les commandes d'initialisation
        await executeCommand("npm install");
        setIsInstalled(true);

        await executeCommand("npm start");
      } catch (error) {
        console.error("Failed to start shell:", error);
        term.write("\r\n\x1b[31mFailed to start shell\x1b[0m\r\n");
      }
    };

    startShell();

    // Gestionnaire de redimensionnement
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
        if (currentProcessRef.current) {
          currentProcessRef.current.resize({
            cols: xtermRef.current?.cols,
            rows: xtermRef.current?.rows,
          });
        }
      }
    };

    // Observer pour détecter les changements de taille du conteneur
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    // Observer le conteneur du terminal
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      if (currentProcessRef.current) {
        currentProcessRef.current.kill();
      }
      xtermRef.current?.dispose();
    };
  }, [webcontainer, setIsInstalled]);

  return <div ref={terminalRef} className="h-full w-full" />;
}
