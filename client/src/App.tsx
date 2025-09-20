import { BookmarksProvider } from '@/contexts/BookmarksContext';
import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import AchievementNotification from "@/components/AchievementNotification";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Achievement } from "@shared/achievements";
import Header from "@/components/Header";
import Home from '@/pages/Home';
import Lessons from '@/pages/Lessons';
import LessonDetail from '@/pages/LessonDetail';
import Quiz from '@/pages/Quiz';
import Progress from '@/pages/Progress';
import Achievements from '@/pages/Achievements';
import GlossaryPage from '@/pages/Glossary';
import NotFound from '@/pages/not-found';
import Footer from '@/components/Footer';
import { SearchProvider } from '@/contexts/SearchContext';
import SearchCommand from '@/components/SearchCommand';
import { usePwa } from '@/hooks/use-pwa';
import UpdateBanner from '@/components/UpdateBanner';
import StreakBanner from '@/components/StreakBanner';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lessons" component={Lessons} />
      <Route path="/lessons/:lessonId" component={LessonDetail} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/progress" component={Progress} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/glossary" component={GlossaryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [achievementNotification, setAchievementNotification] = useState<Achievement | null>(null);
  usePwa();

  const handleAchievementUnlocked = (achievement: Achievement) => {
    setAchievementNotification(achievement);
  };

  const handleCloseNotification = () => {
    setAchievementNotification(null);
  };

  // UpdateBanner handles the UI for updates.

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ProgressProvider onAchievementUnlocked={handleAchievementUnlocked}>
            <BookmarksProvider>
              <SearchProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <UpdateBanner />
                <StreakBanner />
                <div className="flex-1">
                  <Router />
                </div>
                <Footer />
              </div>
              <SearchCommand />
              <Toaster />
              {/* Achievement Notification */}
              {achievementNotification && (
                <AchievementNotification
                  achievement={achievementNotification}
                  onClose={handleCloseNotification}
                  autoClose={true}
                />
              )}
              <OfflineIndicator />
              </SearchProvider>
            </BookmarksProvider>
          </ProgressProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
