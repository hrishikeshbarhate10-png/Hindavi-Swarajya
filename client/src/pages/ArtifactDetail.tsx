import { useRoute, Link } from "wouter";
import { ArrowLeft, Castle, Shield } from "lucide-react";
import { useArtifact } from "@/hooks/use-artifacts";
import { useFort } from "@/hooks/use-forts";
import { motion } from "framer-motion";

function AssociatedFort({ fortId }: { fortId: number }) {
  const { data: fort } = useFort(fortId);
  if (!fort) return null;
  return (
    <Link
      href={`/forts/${fortId}`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
    >
      <Castle className="w-4 h-4" /> {fort.name}
    </Link>
  );
}

export default function ArtifactDetail() {
  const [, params] = useRoute("/artifacts/:id");
  const artifactId = Number(params?.id);
  const { data: artifact, isLoading, error } = useArtifact(artifactId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-32 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-card rounded-3xl border" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-muted rounded-xl" />
            <div className="h-32 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !artifact) {
    return (
      <div className="text-center py-32">
        <h2 className="text-3xl font-serif font-bold mb-4">Artifact not found</h2>
        <Link href="/artifacts" className="text-primary hover:underline">Return to artifacts</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back */}
      <Link
        href="/artifacts"
        className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-xl hover:bg-muted transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Artifacts
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl bg-card border aspect-square max-h-[500px]"
        >
          <img
            src={artifact.imageUrl}
            alt={artifact.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
              <Shield className="w-4 h-4 text-primary" /> Maratha Artifact
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
              {artifact.name}
            </h1>
          </div>

          <div className="bg-card rounded-2xl p-6 border shadow-sm space-y-4">
            <h2 className="text-xl font-serif font-bold flex items-center gap-3">
              <span className="w-6 h-1 bg-primary rounded-full" />
              Historical Significance
            </h2>
            <p className="text-foreground/80 leading-relaxed text-lg">
              {artifact.historicalUsage}
            </p>
          </div>

          {artifact.fortId && (
            <div className="bg-card rounded-2xl p-6 border shadow-sm space-y-3">
              <h2 className="text-xl font-serif font-bold flex items-center gap-3">
                <span className="w-6 h-1 bg-secondary rounded-full" />
                Associated Fort
              </h2>
              <AssociatedFort fortId={artifact.fortId} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
