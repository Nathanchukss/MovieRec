import { Film } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-background via-background/80 to-transparent">
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <Film className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary tracking-tight">
            MovieRec
          </span>
        </div>
      </div>
    </header>
  );
}
