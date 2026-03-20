import { useFavorites } from "@/hooks/use-favorites";
import { useForts } from "@/hooks/use-forts";
import { FortCard } from "@/components/ui/FortCard";
import { Heart, Castle } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Favorites() {
  const { favorites } = useFavorites();
  const { data: forts, isLoading } = useForts();

  const savedForts = forts?.filter(f => favorites.includes(f.id)) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Heart className="w-8 h-8 text-primary fill-primary/20" />
        </div>
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Saved Forts</h1>
          <p className="text-muted-foreground text-lg">Your personal collection of heritage sites.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-card rounded-2xl border animate-pulse" />
          ))}
        </div>
      ) : savedForts.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/60 shadow-sm max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Castle className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-3">No saved forts yet</h2>
          <p className="text-muted-foreground mb-8 text-lg px-6">
            Start exploring and tap the heart icon to save the forts you want to visit or remember.
          </p>
          <Link 
            href="/forts" 
            className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-md hover:bg-primary/90 transition-transform hover:-translate-y-0.5"
          >
            Explore Forts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedForts.map((fort, idx) => (
            <motion.div 
              key={fort.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <FortCard fort={fort} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
