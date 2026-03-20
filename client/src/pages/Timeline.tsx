import { Clock } from "lucide-react";
import { useTimeline } from "@/hooks/use-timeline";
import { motion } from "framer-motion";

export default function Timeline() {
  const { data: events, isLoading } = useTimeline();

  // Sort events chronologically just in case
  const sortedEvents = events?.slice().sort((a, b) => a.year - b.year);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-2">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Chronicles of Valor</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Trace the rise of the Maratha Empire through key historical events, battles, and architectural marvels.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-pulse">
               <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
               <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-card border h-40" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {sortedEvents?.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-8 last:mb-0"
            >
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary text-secondary-foreground shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              
              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-card rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 relative">
                {/* Connector Arrow */}
                <div className="absolute top-5 w-4 h-4 bg-card border-t border-r -rotate-45 md:group-odd:-right-2 md:group-even:-left-2 hidden md:block border-border" />
                
                <span className="text-primary font-bold text-xl font-serif block mb-2">{event.year} CE</span>
                <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                
                {event.imageUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden h-40">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
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
