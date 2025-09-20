import { useState, useEffect, useMemo, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import { lessonContents, LessonContent, LessonSection } from '@shared/lessonContent';

export default function LessonDetail() {
  const [, params] = useRoute('/lessons/:lessonId');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { markSectionComplete, isSectionComplete, markLessonComplete, isLessonComplete } = useProgress();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  const lessonId = params?.lessonId;
  const lesson: LessonContent | undefined = lessonId ? lessonContents[lessonId] : undefined;
  
  useEffect(() => {
    if (!lesson) return;
    
    // Find the first incomplete section
    const firstIncompleteIndex = lesson.sections.findIndex(
      section => !isSectionComplete(lesson.id, section.id)
    );
    
    if (firstIncompleteIndex !== -1) {
      setCurrentSectionIndex(firstIncompleteIndex);
    } else {
      // All sections are complete, go to the last section to show completion summary
      setCurrentSectionIndex(lesson.sections.length - 1);
    }
  }, [lesson, isSectionComplete]);
  
  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t('lesson.not-found')}</h1>
          <Button onClick={() => setLocation('/lessons')} data-testid="button-back-to-lessons">
            {t('lesson.back-to-lessons')}
          </Button>
        </div>
      </div>
    );
  }
  
  const currentSection = lesson.sections[currentSectionIndex];

  // Reading time estimation (words per minute)
  const READING_WPM = 200;
  const sectionReadingTimeMinutes = useMemo(() => {
    const textParts: string[] = [];
    if (currentSection?.content) textParts.push(currentSection.content);
    if (currentSection?.keyPoints) textParts.push(currentSection.keyPoints.join(' '));
    const totalWords = textParts.join(' ').trim().split(/\s+/).filter(Boolean).length;
    if (totalWords === 0) return 0;
    return Math.max(1, Math.round(totalWords / READING_WPM));
  }, [currentSection]);
  const totalSections = lesson.sections.length;
  const completedSections = lesson.sections.filter(section => 
    isSectionComplete(lesson.id, section.id)
  ).length;
  const progressPercentage = (completedSections / totalSections) * 100;
  const isCurrentSectionComplete = isSectionComplete(lesson.id, currentSection.id);
  const isLastSection = currentSectionIndex === totalSections - 1;
  const lessonCompleted = isLessonComplete(lesson.id);

  // Scroll progress within current section
  const sectionContentRef = useRef<HTMLDivElement | null>(null);
  const [sectionScrollProgress, setSectionScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionContentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // If content shorter than viewport, mark 100%
      if (rect.height <= viewportHeight * 0.6) {
        setSectionScrollProgress(100);
        return;
      }

      const distanceFromTop = window.scrollY + rect.top; // element top relative to document
      const scrollPosition = window.scrollY - distanceFromTop; // how much we've scrolled into element
      const scrollable = rect.height - viewportHeight * 0.6; // allow early completion
      const pct = Math.min(100, Math.max(0, (scrollPosition / scrollable) * 100));
      setSectionScrollProgress(pct);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSectionIndex]);
  
  const handleSectionComplete = () => {
    markSectionComplete(lesson.id, currentSection.id);
    
    // Check if all sections are now complete
    const allSectionsComplete = lesson.sections.every(section => 
      section.id === currentSection.id || isSectionComplete(lesson.id, section.id)
    );
    
    if (allSectionsComplete) {
      markLessonComplete(lesson.id);
    }
  };
  
  const handleNext = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };
  
  const handleSectionJump = (index: number) => {
    setCurrentSectionIndex(index);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/lessons')}
            className="mb-4"
            data-testid="button-back-to-lessons"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('lesson.back-to-lessons')}
          </Button>
          
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{lesson.icon}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" data-testid="text-lesson-title">
                {lesson.title}
              </h1>
              <p className="text-muted-foreground mb-4">{lesson.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" data-testid="badge-difficulty">
                  {lesson.difficulty}
                </Badge>
                <Badge variant="outline" data-testid="badge-time">
                  <Clock className="w-3 h-3 mr-1" />
                  {lesson.estimatedTime}
                </Badge>
                <Badge variant="outline" data-testid="badge-sections">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {totalSections} {t('lesson.sections-count')}
                </Badge>
                {lessonCompleted && (
                  <Badge variant="default" className="bg-green-600" data-testid="badge-completed">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {t('lessons.completed')}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('lesson.progress')}</span>
                  <span data-testid="text-progress-fraction">
                    {completedSections}/{totalSections} {t('lesson.sections-count')}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" data-testid="progress-lesson" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Section Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('lesson.sections')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lesson.sections.map((section, index) => {
                  const sectionComplete = isSectionComplete(lesson.id, section.id);
                  const isCurrent = index === currentSectionIndex;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionJump(index)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        isCurrent 
                          ? 'bg-primary text-primary-foreground' 
                          : sectionComplete
                          ? 'bg-green-50 hover:bg-green-100 text-green-800'
                          : 'hover:bg-accent'
                      }`}
                      data-testid={`button-section-${index}`}
                    >
                      <div className="flex items-center gap-2">
                        {sectionComplete && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm font-medium truncate">
                          {section.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl" data-testid="text-section-title">
                    {currentSection.title}
                  </CardTitle>
                  <Badge variant="outline" data-testid="badge-section-number">
                    {t('lesson.section')} {currentSectionIndex + 1} {t('lesson.of')} {totalSections}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span data-testid="text-section-reading-time">{sectionReadingTimeMinutes} min read</span>
                  <span aria-hidden>•</span>
                  <span className="flex items-center gap-1" data-testid="text-section-scroll-progress">
                    {Math.round(sectionScrollProgress)}% {t('lesson.progress')}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="h-1 w-full bg-muted rounded overflow-hidden" aria-label="Section scroll progress">
                    <div
                      className="h-full bg-primary transition-all duration-200"
                      style={{ width: `${sectionScrollProgress}%` }}
                      data-testid="progress-section-scroll"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Section Content */}
                <div className="prose max-w-none" data-testid="text-section-content" ref={sectionContentRef}>
                  <p className="text-base leading-relaxed">{currentSection.content}</p>
                </div>
                
                {/* Key Points */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Points</h3>
                  <div className="grid gap-2">
                    {currentSection.keyPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-accent/50 rounded-md"
                        data-testid={`text-key-point-${index}`}
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Section Actions */}
                <div className="pt-6 border-t">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentSectionIndex === 0}
                        data-testid="button-previous-section"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={isLastSection}
                        data-testid="button-next-section"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    
                    <div>
                      {!isCurrentSectionComplete ? (
                        <Button 
                          onClick={handleSectionComplete}
                          data-testid="button-mark-complete"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Complete
                        </Button>
                      ) : (
                        <Badge variant="default" className="bg-green-600" data-testid="badge-section-completed">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Lesson Summary (shown on last section) */}
                {isLastSection && lessonCompleted && (
                  <div className="p-6 bg-green-50 rounded-md border border-green-200">
                    <h3 className="text-lg font-semibold mb-3 text-green-800">
                      🎉 Lesson Complete! Key Takeaways:
                    </h3>
                    <div className="space-y-2">
                      {lesson.summary.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2"
                          data-testid={`text-summary-point-${index}`}
                        >
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-green-800">{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <Button 
                        onClick={() => setLocation('/quiz')}
                        className="bg-green-600 hover:bg-green-700"
                        data-testid="button-take-quiz"
                      >
                        Take Quiz to Test Your Knowledge
                      </Button>
                    </div>
                  </div>
                )}

                {/* Glossary Section */}
                {lesson.glossary && lesson.glossary.length > 0 && (
                  <div className="pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-2">{t('glossary.title')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('glossary.description')}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {lesson.glossary.map((item, idx) => (
                        <div key={idx} className="border rounded-md p-4">
                          <div className="font-medium text-primary">{item.term}</div>
                          <div className="text-sm mt-1">{item.definition}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}