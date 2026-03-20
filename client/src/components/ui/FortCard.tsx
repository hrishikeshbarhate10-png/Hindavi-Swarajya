import { Link } from "wouter";
import { Heart, MapPin, Calendar } from "lucide-react";
import { type Fort } from "@shared/schema";
import { useFavorites } from "@/hooks/use-favorites";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FortCardProps {
  fort: Fort;
  className?: string;
}

export function FortCard({ fort, className }: FortCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(fort.id);

  return (
    <div className={cn("group relative bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300", className)}>
      <Link href={`/forts/${fort.id}`} className="absolute inset-0 z-10" aria-label={`View ${fort.name}`} />
      
      {/* Image with Dark Wash */}
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        <img 
          src={fort.imageUrl} 
          alt={fort.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Favorite Button (Z-index above link) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(fort.id);
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-colors"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-5 h-5 transition-transform active:scale-75", favorited ? "fill-primary text-primary" : "text-white")} />
        </button>

        {/* Floating Badge */}
        {fort.difficulty && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 text-xs font-semibold rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
            {fort.difficulty}
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <h3 className="text-xl font-serif font-bold mb-1 group-hover:text-primary-foreground transition-colors">{fort.name}</h3>
          <div className="flex items-center text-sm text-white/80 gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {fort.region}
            </span>
            {fort.builtYear && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {fort.builtYear} CE
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {fort.description}
        </p>
      </div>
    </div>
  );
}
