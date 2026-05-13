import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Castle, Sword, Clock, Heart, BookOpen } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useFavorites } from "@/hooks/use-favorites";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: "/", label: "Explore", icon: Home },
  { href: "/forts", label: "Forts", icon: Castle },
  { href: "/stories", label: "Stories", icon: BookOpen },
  { href: "/artifacts", label: "Artifacts", icon: Sword },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/favorites", label: "Saved", icon: Heart, showBadge: true },
];

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { favorites } = useFavorites();
  const savedCount = favorites.length;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-card border-r border-border z-50">
        <div className="p-6">
          <Link href="/" className="block">
            <h1 className="text-2xl font-serif font-bold text-primary tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Castle className="w-8 h-8 text-primary" />
              <span>Hindavi</span>
            </h1>
          </Link>
          <p className="text-sm text-muted-foreground mt-1 font-serif italic">The Maratha Heritage</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const count = item.showBadge ? savedCount : 0;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                data-testid={`nav-link-${item.label.toLowerCase()}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "opacity-70")} />
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <span
                    data-testid="favorites-count-badge-sidebar"
                    className="ml-auto min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pb-20 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 glass-panel px-4 py-4 flex items-center justify-center">
          <Link href="/">
            <h1 className="text-xl font-serif font-bold text-primary tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Castle className="w-6 h-6 text-primary" />
              <span>Hindavi</span>
            </h1>
          </Link>
        </header>
        
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 glass-panel z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const count = item.showBadge ? savedCount : 0;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <div className={cn(
                    "p-1.5 rounded-full transition-all duration-300",
                    isActive ? "bg-primary/10" : "bg-transparent"
                  )}>
                    <item.icon className={cn("w-5 h-5", isActive ? "fill-primary/20" : "")} />
                  </div>
                  {count > 0 && (
                    <span
                      data-testid="favorites-count-badge-mobile"
                      className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[10px] font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center leading-none"
                    >
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
