import { useRoute } from "wouter";
import { MapPin, Calendar, Compass, ShieldAlert, Heart, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useFort } from "@/hooks/use-forts";
import { useFavorites } from "@/hooks/use-favorites";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

export default function FortDetail() {
  const [, params] = useRoute("/forts/:id");
  const fortId = Number(params?.id);
  const { data: fort, isLoading, error } = useFort(fortId);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [emblaRef] = useEmblaCarousel({ loop: true });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-32 bg-muted rounded-xl" />
        <div className="h-[50vh] bg-card rounded-3xl border" />
        <div className="space-y-4">
          <div className="h-10 w-1/2 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !fort) {
    return (
      <div className="text-center py-32">
        <h2 className="text-3xl font-serif font-bold mb-4">Fort not found</h2>
        <Link href="/forts" className="text-primary hover:underline">Return to forts</Link>
      </div>
    );
  }

  const favorited = isFavorite(fort.id);
  // Default fallback image if array is empty
  const images = fort.images?.length > 0 ? fort.images : [{ id: 0, url: fort.imageUrl }];

  return (
    <div className="space-y-8 pb-12">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <Link href="/forts" className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-xl hover:bg-muted transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        
        <button
          onClick={() => toggleFavorite(fort.id)}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all shadow-sm ${
            favorited 
              ? "bg-primary text-primary-foreground border-transparent" 
              : "bg-card border text-foreground hover:bg-muted"
          }`}
        >
          <Heart className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
          {favorited ? "Saved" : "Save to Favorites"}
        </button>
      </div>

      {/* Title & Meta */}
      <div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4">
          {fort.name}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-lg text-sm">
            <MapPin className="w-4 h-4 text-primary" /> {fort.location}, {fort.region}
          </span>
          {fort.builtYear && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-lg text-sm">
              <Calendar className="w-4 h-4 text-primary" /> {fort.builtYear} CE
            </span>
          )}
          {fort.difficulty && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-lg text-sm">
              <Compass className="w-4 h-4 text-secondary" /> {fort.difficulty} Trek
            </span>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black">
        <div className="overflow-hidden h-[50vh] min-h-[400px]" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((img, i) => (
              <div key={img.id || i} className="flex-[0_0_100%] min-w-0 relative h-full">
                <img 
                  src={img.url} 
                  alt={`${fort.name} - View ${i + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm flex items-center gap-2 border border-white/20">
            <ImageIcon className="w-4 h-4" /> {images.length} Photos
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card rounded-3xl p-6 md:p-8 border shadow-sm">
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              History & Description
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              {fort.description.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
          
          <section className="bg-secondary/10 rounded-3xl p-6 md:p-8 border border-secondary/20">
            <h2 className="text-2xl font-serif font-bold text-secondary-foreground dark:text-secondary mb-4 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-secondary" />
              Strategic Importance
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {fort.strategicImportance}
            </p>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card rounded-3xl p-6 border shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl border-b pb-4">Visitor Information</h3>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Best Time to Visit</p>
              <p className="font-medium text-foreground">{fort.bestTime || "October to February"}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
              <p className="font-medium font-mono text-foreground">
                {fort.latitude?.toFixed(4) || "N/A"}, {fort.longitude?.toFixed(4) || "N/A"}
              </p>
            </div>

            <a 
              href={`https://maps.google.com/?q=${fort.latitude},${fort.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all hover:-translate-y-0.5"
            >
              <MapPin className="w-5 h-5" /> Open in Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
