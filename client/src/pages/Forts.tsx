import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useForts } from "@/hooks/use-forts";
import { FortCard } from "@/components/ui/FortCard";
import { motion } from "framer-motion";

const REGIONS = ["All", "Sahyadri", "Konkan", "Desh", "Khandesh"];

export default function Forts() {
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");
  
  // Debounce search in a real app, keeping it simple here
  const { data: forts, isLoading } = useForts();

  const filteredForts = forts?.filter(fort => {
    const matchesSearch = fort.name.toLowerCase().includes(search.toLowerCase()) || 
                          fort.description.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = activeRegion === "All" || fort.region.includes(activeRegion);
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Explore Forts</h1>
        <p className="text-muted-foreground text-lg">Browse the vast network of strategic military fortifications.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <div className="flex items-center gap-2 px-3 py-3 bg-muted rounded-xl text-muted-foreground">
            <Filter className="w-5 h-5" />
          </div>
          {REGIONS.map(region => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`whitespace-nowrap px-5 py-3 rounded-xl font-medium transition-all ${
                activeRegion === region 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "bg-card border hover:bg-muted text-foreground"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[400px] bg-card rounded-2xl border animate-pulse" />
          ))}
        </div>
      ) : filteredForts?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">No forts found</h3>
          <p className="text-muted-foreground">Try adjusting your search or region filters.</p>
          <button 
            onClick={() => { setSearch(""); setActiveRegion("All"); }}
            className="mt-6 px-6 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForts?.map((fort, idx) => (
            <motion.div 
              key={fort.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            >
              <FortCard fort={fort} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
