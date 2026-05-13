import { useRoute, Link } from "wouter";
import { ArrowLeft, BookOpen, Sword } from "lucide-react";
import { useStory } from "@/hooks/use-stories";
import { motion } from "framer-motion";

export default function StoryDetail() {
  const [, params] = useRoute("/stories/:id");
  const storyId = Number(params?.id);
  const { data: story, isLoading, error } = useStory(storyId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-32 bg-muted rounded-xl" />
        <div className="h-[45vh] bg-card rounded-3xl border" />
        <div className="space-y-4 max-w-3xl">
          <div className="h-10 w-2/3 bg-muted rounded-xl" />
          <div className="h-6 w-1/2 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="text-center py-32">
        <h2 className="text-3xl font-serif font-bold mb-4">Story not found</h2>
        <Link href="/stories" className="text-primary hover:underline">Return to stories</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/stories"
        className="inline-flex items-center gap-2 px-4 py-2 bg-card border rounded-xl hover:bg-muted transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Stories
      </Link>

      {/* Hero Image */}
      {story.imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl h-[45vh] min-h-[300px]"
        >
          <img
            src={story.imageUrl}
            alt={story.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium mb-3">
              <Sword className="w-4 h-4" /> Battle Story
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-lg">
              {story.title}
            </h1>
          </div>
        </motion.div>
      )}

      {/* If no image, show title above */}
      {!story.imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" /> Battle Story
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            {story.title}
          </h1>
        </motion.div>
      )}

      {/* Description & Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-6"
      >
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <p className="text-lg text-foreground/80 font-medium italic leading-relaxed">
            {story.description}
          </p>
        </div>

        <div className="bg-card rounded-3xl p-6 md:p-10 border shadow-sm">
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-primary rounded-full" />
            The Full Account
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed space-y-4">
            {story.content.split('\n').filter(p => p.trim()).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
