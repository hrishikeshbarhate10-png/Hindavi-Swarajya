import { Search } from "lucide-react";
import { useArtifacts } from "@/hooks/use-artifacts";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Artifacts() {
  const { data: artifacts, isLoading } = useArtifacts();
  const [search, setSearch] = useState("");

  const filtered = artifacts?.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.historicalUsage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-card rounded-3xl p-8 border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Relics & Weapons</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Explore the authentic artifacts, weaponry, and royal possessions from the glorious era.
          </p>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search artifacts, swords, armors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-80 bg-card rounded-2xl border animate-pulse" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No artifacts found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered?.map((artifact, idx) => (
            <motion.div 
              key={artifact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 bg-muted p-4 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10" />
                <img 
                  src={artifact.imageUrl} 
                  alt={artifact.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">{artifact.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                  {artifact.historicalUsage}
                </p>
                {artifact.fortId && (
                  <div className="mt-auto pt-4 border-t text-xs font-semibold text-secondary uppercase tracking-wider">
                    Associated with a Fort
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
