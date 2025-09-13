import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Lessons from "@/pages/Lessons";
import LessonDetail from "@/pages/LessonDetail";
import Quiz from "@/pages/Quiz";
import Progress from "@/pages/Progress";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/lessons" component={Lessons} />
      <Route path="/lessons/:lessonId" component={LessonDetail} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/progress" component={Progress} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ProgressProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <Router />
            </div>
            <Toaster />
          </ProgressProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
