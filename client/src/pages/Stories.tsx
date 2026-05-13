import { Link } from "wouter";
import { BookOpen, ArrowRight } from "lucide-react";
import { useStories } from "@/hooks/use-stories";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function Stories() {
  const { data: stories, isLoading } = useStories();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-card rounded-3xl p-8 border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-serif font-bold text-foreground">Battle Stories</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Relive the legendary battles and heroic tales of the Maratha Empire. Each story a testament to courage, strategy, and sacrifice.
          </p>
        </div>
      </div>

      {/* Stories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-card rounded-2xl border animate-pulse" />
          ))}
        </div>
      ) : stories?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No stories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories?.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link href={`/stories/${story.id}`}>
                <Card
                  className="overflow-hidden hover-elevate group cursor-pointer h-full"
                  data-testid={`card-story-${story.id}`}
                >
                  <div className="flex h-44">
                    <div className="w-2/5 relative flex-shrink-0">
                      {story.imageUrl ? (
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-xl mb-2 group-hover:text-primary transition-colors leading-snug">
                          {story.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{story.description}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-primary font-medium text-sm mt-3">
                        Read Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
