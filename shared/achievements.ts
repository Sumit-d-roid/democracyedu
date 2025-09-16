export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'progress' | 'mastery' | 'dedication';
  requirement: {
    type:
      | 'lessons_completed'
      | 'sections_completed'
      | 'quiz_score'
      | 'points_earned'
      | 'streak_days'
      | 'perfect_quizzes';
    value: number;
    lessonId?: string; // for lesson-specific achievements
  };
  points: number;
  unlocked?: boolean;
}

export const achievements: Achievement[] = [
  // Learning Achievements
  {
    id: 'first_lesson',
    title: 'Constitutional Explorer',
    description: "Complete your first lesson about Nepal's Constitution",
    icon: '🌟',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 1 },
    points: 100,
  },
  {
    id: 'rights_expert',
    title: 'Rights Champion',
    description: 'Master the Fundamental Rights lesson',
    icon: '⚖️',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 1, lessonId: 'fundamental-rights' },
    points: 150,
  },
  {
    id: 'government_guru',
    title: 'Government Structure Guru',
    description: 'Complete the Government Structure lesson',
    icon: '🏛️',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 1, lessonId: 'government-structure' },
    points: 150,
  },
  {
    id: 'federal_master',
    title: 'Federalism Master',
    description: 'Complete the Federal System lesson',
    icon: '🗺️',
    category: 'learning',
    requirement: { type: 'lessons_completed', value: 1, lessonId: 'federal-system' },
    points: 200,
  },
  {
    id: 'constitution_scholar',
    title: 'Constitution Scholar',
    description: 'Complete all constitutional lessons',
    icon: '🎓',
    category: 'mastery',
    requirement: { type: 'lessons_completed', value: 3 },
    points: 500,
  },

  // Progress Achievements
  {
    id: 'section_starter',
    title: 'Section Starter',
    description: 'Complete 5 lesson sections',
    icon: '📖',
    category: 'progress',
    requirement: { type: 'sections_completed', value: 5 },
    points: 50,
  },
  {
    id: 'dedicated_reader',
    title: 'Dedicated Reader',
    description: 'Complete 10 lesson sections',
    icon: '📚',
    category: 'progress',
    requirement: { type: 'sections_completed', value: 10 },
    points: 100,
  },
  {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Complete 15 lesson sections',
    icon: '🔍',
    category: 'progress',
    requirement: { type: 'sections_completed', value: 15 },
    points: 200,
  },

  // Quiz Achievements
  {
    id: 'quiz_rookie',
    title: 'Quiz Rookie',
    description: 'Score 70% or higher on your first quiz',
    icon: '🏃',
    category: 'learning',
    requirement: { type: 'quiz_score', value: 70 },
    points: 75,
  },
  {
    id: 'quiz_champion',
    title: 'Quiz Champion',
    description: 'Score 90% or higher on any quiz',
    icon: '🏆',
    category: 'mastery',
    requirement: { type: 'quiz_score', value: 90 },
    points: 250,
  },
  {
    id: 'perfect_score',
    title: 'Perfect Scholar',
    description: 'Score 100% on any quiz',
    icon: '💯',
    category: 'mastery',
    requirement: { type: 'quiz_score', value: 100 },
    points: 300,
  },
  {
    id: 'quiz_perfectionist',
    title: 'Quiz Perfectionist',
    description: 'Score 100% on 3 different quizzes',
    icon: '🎯',
    category: 'mastery',
    requirement: { type: 'perfect_quizzes', value: 3 },
    points: 500,
  },

  // Points Achievements
  {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Earn your first 100 points',
    icon: '🪙',
    category: 'progress',
    requirement: { type: 'points_earned', value: 100 },
    points: 25,
  },
  {
    id: 'point_master',
    title: 'Point Master',
    description: 'Earn 500 total points',
    icon: '💰',
    category: 'progress',
    requirement: { type: 'points_earned', value: 500 },
    points: 100,
  },
  {
    id: 'point_legend',
    title: 'Point Legend',
    description: 'Earn 1000 total points',
    icon: '👑',
    category: 'mastery',
    requirement: { type: 'points_earned', value: 1000 },
    points: 200,
  },

  // Dedication Achievements
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a lesson between 6 AM and 11 AM',
    icon: '🌅',
    category: 'dedication',
    requirement: { type: 'lessons_completed', value: 1 },
    points: 50,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a lesson between 6 PM and 11 PM',
    icon: '🌙',
    category: 'dedication',
    requirement: { type: 'lessons_completed', value: 1 },
    points: 50,
  },
];

export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return achievements.filter((achievement) => achievement.category === category);
};

export const getCategoryIcon = (category: Achievement['category']): string => {
  switch (category) {
    case 'learning':
      return '📚';
    case 'progress':
      return '📈';
    case 'mastery':
      return '🎯';
    case 'dedication':
      return '⭐';
    default:
      return '🏆';
  }
};

export const getCategoryColor = (category: Achievement['category']): string => {
  switch (category) {
    case 'learning':
      return 'blue';
    case 'progress':
      return 'green';
    case 'mastery':
      return 'purple';
    case 'dedication':
      return 'orange';
    default:
      return 'gray';
  }
};
