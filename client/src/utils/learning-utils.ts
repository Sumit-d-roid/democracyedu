import type {
  Course,
  Module,
  Lesson,
  LearningPath,
  Prerequisite,
  ContentProgress,
  DifficultyLevel,
  CompletionStatus
} from '../types/learning';

// Helper to check if prerequisites are met
export function checkPrerequisites(
  prerequisites: Prerequisite[],
  progress: ContentProgress[]
): boolean {
  return prerequisites.every(prerequisite => {
    const prereqProgress = progress.find(p => p.contentId === prerequisite.id);
    if (!prereqProgress) return false;

    if (prerequisite.requiredScore && prereqProgress.score) {
      return prereqProgress.score >= prerequisite.requiredScore;
    }

    if (prerequisite.requiredStatus) {
      return prereqProgress.status === prerequisite.requiredStatus;
    }

    return prereqProgress.status === 'completed';
  });
}

// Helper to get next available content
export function getNextAvailableContent(
  course: Course,
  progress: ContentProgress[]
): { type: 'module' | 'lesson'; id: string } | null {
  // Check modules in order
  for (const module of course.modules) {
    const moduleProgress = progress.find(p => p.contentId === module.id);
    
    // If module not started or in progress, check prerequisites
    if (!moduleProgress || moduleProgress.status !== 'completed') {
      if (!module.prerequisites || checkPrerequisites(module.prerequisites, progress)) {
        // Check lessons in this module
        for (const lesson of module.lessons) {
          const lessonProgress = progress.find(p => p.contentId === lesson.id);
          
          if (!lessonProgress || lessonProgress.status !== 'completed') {
            if (!lesson.prerequisites || checkPrerequisites(lesson.prerequisites, progress)) {
              return { type: 'lesson', id: lesson.id };
            }
          }
        }
        
        // If no specific lesson found but module not complete
        if (moduleProgress?.status !== 'completed') {
          return { type: 'module', id: module.id };
        }
      }
    }
  }
  
  return null;
}

// Helper to calculate content completion percentage
export function calculateCompletionPercentage(
  contentId: string,
  progress: ContentProgress[]
): number {
  const contentProgress = progress.filter(p => p.contentId === contentId);
  const completed = contentProgress.filter(p => p.status === 'completed').length;
  return (completed / contentProgress.length) * 100;
}

// Helper to suggest difficulty level based on user performance
export function suggestDifficultyLevel(
  averageScore: number,
  currentDifficulty: DifficultyLevel
): DifficultyLevel {
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  const currentIndex = difficulties.indexOf(currentDifficulty);

  if (averageScore >= 90 && currentIndex < difficulties.length - 1) {
    return difficulties[currentIndex + 1];
  } else if (averageScore <= 60 && currentIndex > 0) {
    return difficulties[currentIndex - 1];
  }

  return currentDifficulty;
}

// Helper to generate a learning schedule
export function generateLearningSchedule(
  learningPath: LearningPath,
  availableTimePerDay: number
): Array<{ date: Date; contentId: string; duration: number }> {
  const schedule = [];
  let currentDate = new Date();
  let totalDuration = 0;

  for (const pathCourse of learningPath.courses) {
    // Find the actual course object (assuming caller has provided a higher level map if needed)
    // For now, we treat modules and lessons as the schedulable content.
    // TODO: Accept a course lookup map to avoid external dependency.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const pseudoCourse = pathCourse; // placeholder to show intent

    // Without access to concrete lesson durations, we simulate using a default duration (e.g., 15 minutes per lesson)
    // This resolves the undefined function reference while keeping schedule structure.
    const DEFAULT_LESSON_DURATION = 15;

    // In a richer data model we'd iterate actual modules/lessons; here we create a single placeholder entry per course.
    const syntheticContent = [{ id: pathCourse.courseId, duration: DEFAULT_LESSON_DURATION }];

    for (const content of syntheticContent) {
      if (totalDuration + content.duration <= availableTimePerDay) {
        schedule.push({
          date: new Date(currentDate),
          contentId: content.id,
          duration: content.duration
        });
        totalDuration += content.duration;
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
        totalDuration = content.duration;
        schedule.push({
          date: new Date(currentDate),
          contentId: content.id,
          duration: content.duration
        });
      }
    }
  }

  return schedule;
}

// Helper to sort content by dependencies
export function sortContentByDependencies(
  modules: Module[]
): Module[] {
  const visited = new Set<string>();
  const sorted: Module[] = [];

  function visit(module: Module) {
    if (visited.has(module.id)) return;
    visited.add(module.id);

    if (module.prerequisites) {
      for (const prereq of module.prerequisites) {
        const dependentModule = modules.find(m => m.id === prereq.id);
        if (dependentModule) {
          visit(dependentModule);
        }
      }
    }

    sorted.push(module);
  }

  modules.forEach(visit);
  return sorted;
}

// Helper to validate learning path integrity
export function validateLearningPath(
  path: LearningPath,
  courses: Course[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if all courses exist
  for (const pathCourse of path.courses) {
    const course = courses.find(c => c.id === pathCourse.courseId);
    if (!course) {
      errors.push(`Course ${pathCourse.courseId} not found`);
      continue;
    }

    // Check prerequisites
    if (course.prerequisites) {
      for (const prereq of course.prerequisites) {
        const prereqCourse = path.courses.find(pc => pc.courseId === prereq.id);
        if (!prereqCourse) {
          errors.push(`Prerequisite course ${prereq.id} not included in path`);
        } else if (prereqCourse.order >= pathCourse.order) {
          errors.push(`Invalid prerequisite order for course ${prereq.id}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Helper to get estimated completion time
export function getEstimatedCompletionTime(
  content: Course | Module | Lesson,
  userProfile?: {
    averageCompletionRate?: number;
    difficultyFactor?: Record<DifficultyLevel, number>;
  }
): number {
  let baseTime = content.estimatedDuration;

  if (userProfile) {
    // Adjust based on user's historical completion rate
    if (userProfile.averageCompletionRate) {
      baseTime = baseTime / userProfile.averageCompletionRate;
    }

    // Adjust based on difficulty level
    if (userProfile.difficultyFactor && content.difficulty) {
      baseTime = baseTime * (userProfile.difficultyFactor[content.difficulty] || 1);
    }
  }

  return Math.ceil(baseTime);
}