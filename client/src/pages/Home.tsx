import { Link } from "wouter";
import { Search, Map, ArrowRight, BookOpen, Trophy, Play, CheckCircle2, XCircle, CalendarClock } from "lucide-react";
import { useForts } from "@/hooks/use-forts";
import { FortCard } from "@/components/ui/FortCard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStories } from "@/hooks/use-stories";
import { useDailyQuiz } from "@/hooks/use-quiz";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const QUIZ_STORAGE_KEY = "hindavi_quiz_";

function getTodayKey() {
  const d = new Date();
  return `${QUIZ_STORAGE_KEY}${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

type SavedQuizState = {
  answeredOption: string;
  correct: boolean;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: forts, isLoading } = useForts();
  const { data: stories } = useStories();
  const { data: quiz } = useDailyQuiz();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [savedResult, setSavedResult] = useState<SavedQuizState | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(getTodayKey());
    if (stored) {
      try { setSavedResult(JSON.parse(stored)); } catch {}
    }
  }, []);

  function handleSubmitQuiz() {
    if (!selectedOption || !quiz) return;
    const correct = selectedOption === quiz.correctAnswer;
    const result: SavedQuizState = { answeredOption: selectedOption, correct };
    localStorage.setItem(getTodayKey(), JSON.stringify(result));
    setSavedResult(result);
  }

  const featuredForts = forts?.slice(0, 3) || [];
  const sahyadriForts = forts?.filter(f => f.region.toLowerCase().includes('sahyadri')).slice(0, 4) || [];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl h-[60vh] min-h-[400px]">
        <img
          src="https://pixabay.com/get/gbf0db9ea114caf3240ef1467a7662f095923434e73181d483d4bdadd58475b361b674a2cdea70ceb2dfa2f7b284dbcf825338d43696c1218b8a8f3a900906914_1280.jpg"
          alt="Majestic mountain fort"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/90" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block drop-shadow-md">
              Discover the Legacy
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg text-balance max-w-4xl">
              Explore the Invincible Forts of Marathas
            </h1>

            {/* Search Bar */}
            <div className="w-full max-w-md mx-auto mt-8 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search forts, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-forts"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm border-0 text-foreground placeholder:text-muted-foreground focus:ring-4 focus:ring-primary/30 shadow-xl transition-all"
              />
              <Link
                href={searchQuery ? `/forts?search=${encodeURIComponent(searchQuery)}` : `/forts`}
                className="absolute inset-y-2 right-2 px-6 bg-primary text-primary-foreground rounded-xl font-medium flex items-center hover:bg-primary/90 transition-colors shadow-md"
              >
                Search
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Battle Stories & Quiz Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Battle Stories */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-serif font-bold">Battle Stories</h2>
            </div>
            <Link href="/stories" className="flex items-center gap-1 text-primary font-medium text-sm hover:text-primary/80 transition-colors group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid gap-4">
            {stories?.slice(0, 3).map((story) => (
              <Link key={story.id} href={`/stories/${story.id}`}>
                <Card
                  className="overflow-hidden hover-elevate group cursor-pointer"
                  data-testid={`card-story-${story.id}`}
                >
                  <div className="flex h-32">
                    <div className="w-1/3 relative flex-shrink-0">
                      {story.imageUrl ? (
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors leading-snug">{story.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{story.description}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                        Read Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quiz of the Day */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-serif font-bold">Quiz of the Day</h2>
          </div>

          {quiz && (
            <Card className="p-6 border-2 border-primary/20 bg-primary/5">
              <h3 className="text-xl font-bold mb-4" data-testid="text-quiz-question">{quiz.question}</h3>

              {!savedResult ? (
                /* Unanswered state */
                <div className="space-y-4">
                  <RadioGroup onValueChange={setSelectedOption} value={selectedOption || ""}>
                    {quiz.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2 bg-background p-3 rounded-lg border">
                        <RadioGroupItem value={option} id={option} data-testid={`radio-quiz-${option}`} />
                        <Label htmlFor={option} className="flex-1 cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button
                    className="w-full"
                    disabled={!selectedOption}
                    onClick={handleSubmitQuiz}
                    data-testid="button-submit-quiz"
                  >
                    Submit Answer
                  </Button>
                </div>
              ) : (
                /* Answered — locked for the day */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-xl flex items-start gap-3 ${savedResult.correct ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {savedResult.correct
                      ? <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      : <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="font-bold">
                        {savedResult.correct ? "Correct! Jai Bhavani!" : `Incorrect. The answer is ${quiz.correctAnswer}.`}
                      </p>
                      <p className="text-sm mt-1">Your answer: {savedResult.answeredOption}</p>
                    </div>
                  </div>

                  {quiz.explanation && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{quiz.explanation}</p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/60 rounded-xl px-4 py-3 border">
                    <CalendarClock className="w-4 h-4 flex-shrink-0 text-primary" />
                    Come back tomorrow for a new question!
                  </div>
                </motion.div>
              )}
            </Card>
          )}
        </div>
      </section>

      {/* Featured Section */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Featured Forts</h2>
            <p className="text-muted-foreground mt-2">The crown jewels of the Maratha Empire</p>
          </div>
          <Link href="/forts" className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredForts.map((fort, idx) => (
              <motion.div
                key={fort.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <FortCard fort={fort} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Ads/Reward Section */}
      <section className="bg-primary/10 rounded-3xl p-8 border border-primary/20 text-center space-y-4">
        <div className="flex flex-col items-center">
          <Play className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold font-serif">Support the Legacy</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Watch a short video to unlock detailed technical layouts of artillery used in Maratha warfare.
          </p>
          <Button className="mt-4 bg-primary hover:bg-primary/90">
            Watch Ad to Unlock Artilleries
          </Button>
        </div>
      </section>

      {/* Region Section */}
      <section className="bg-card rounded-3xl p-6 md:p-10 border shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-medium text-sm">
              <Map className="w-4 h-4" /> Sahyadri Ranges
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Guardians of the Ghats</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Discover the strategic hill forts built atop the treacherous Sahyadri mountains that proved impenetrable against massive armies.
            </p>
            <Link href="/forts?region=Sahyadri" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium shadow-md hover:bg-secondary/90 transition-all hover:-translate-y-0.5">
              Explore Region
            </Link>
          </div>

          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            {sahyadriForts.length > 0 ? sahyadriForts.map(fort => (
              <Link key={fort.id} href={`/forts/${fort.id}`} className="group block relative h-40 rounded-2xl overflow-hidden shadow-sm">
                <img src={fort.imageUrl} alt={fort.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white font-serif font-bold group-hover:text-primary transition-colors">{fort.name}</span>
              </Link>
            )) : (
              [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />)
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
