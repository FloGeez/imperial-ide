import HyperText from "@/components/ui/hyper-text";

export function TopBar() {
  return (
    <div className="h-14 border-b border-blue-500/20 bg-card">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <img src="/icon.svg" alt="Logo" />
        <HyperText
          text="IMPERIAL_IDE"
          className="text-lg font-bold text-primary star-wars-title effect-text-glow"
        />
      </div>
    </div>
  );
}
