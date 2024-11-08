import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const previewInfoMessageVariants = cva(
  "flex items-center gap-3 px-4 py-3 rounded-md font-mono text-sm bg-card/50 border border-border/50 min-w-[380px]",
  {
    variants: {
      variant: {
        initializing: "text-primary border-primary/20",
        success: "text-green-500 border-green-500/20",
        error: "text-destructive border-destructive/20",
      },
    },
    defaultVariants: {
      variant: "initializing",
    },
  }
);

interface PreviewInfoMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof previewInfoMessageVariants> {
  children: React.ReactNode;
}

export function PreviewInfoMessage({
  className,
  variant,
  children,
  ...props
}: PreviewInfoMessageProps) {
  const getIcon = () => {
    switch (variant) {
      case "initializing":
        return "▶";
      case "success":
        return "✓";
      case "error":
        return "✕";
      default:
        return "▶";
    }
  };

  return (
    <div
      className={cn(previewInfoMessageVariants({ variant }), className)}
      {...props}
    >
      <span className="text-base">{getIcon()}</span>
      <span>{children}</span>
    </div>
  );
}
