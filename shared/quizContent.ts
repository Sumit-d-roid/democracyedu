export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'multiple-select';
  options: string[];
  correctAnswer: number | number[]; // Array for multiple-select
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  hint?: string;
}

export interface QuizContent {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
}

export const quizContents: Record<string, QuizContent> = {
  'constitution-basics': {
    id: 'constitution-basics',
    title: 'Constitution Basics',
    description: 'Test your knowledge of Nepal\'s Constitution fundamentals',
    category: 'General',
    questions: [
      {
        id: '1',
        question: 'In which year was Nepal\'s current Constitution adopted?',
        type: 'multiple-choice',
        options: ['2015', '2016', '2017', '2018'],
        correctAnswer: 0,
        explanation: 'Nepal\'s Constitution was adopted on September 20, 2015, marking the country\'s transition to a federal democratic republic.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'How many provinces does Nepal have according to the current Constitution?',
        type: 'multiple-choice',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2,
        explanation: 'Nepal is divided into seven provinces as established by the 2015 Constitution, each with its own provincial government.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '3',
        question: 'What is the highest court in Nepal?',
        type: 'multiple-choice',
        options: ['High Court', 'Supreme Court', 'Constitutional Court', 'Federal Court'],
        correctAnswer: 1,
        explanation: 'The Supreme Court is the highest judicial authority in Nepal, responsible for constitutional interpretation and final appeals.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '4',
        question: 'How many members are there in Nepal\'s House of Representatives?',
        type: 'multiple-choice',
        options: ['245', '265', '275', '285'],
        correctAnswer: 2,
        explanation: 'The House of Representatives, the lower house of Nepal\'s federal parliament, consists of 275 members elected through a mixed electoral system.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'Nepal follows which type of government system?',
        type: 'multiple-choice',
        options: ['Unitary System', 'Federal System', 'Confederal System', 'Municipal System'],
        correctAnswer: 1,
        explanation: 'Nepal adopted a federal system of government through the 2015 Constitution, replacing the previous unitary system.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '6',
        question: 'Nepal is a secular state according to the 2015 Constitution.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Nepal is declared as a secular state in the 2015 Constitution, respecting all religions equally.',
        difficulty: 'easy',
        points: 10
      }
    ]
  },

  'fundamental-rights': {
    id: 'fundamental-rights',
    title: 'Fundamental Rights',
    description: 'Quiz on fundamental rights guaranteed by Nepal\'s Constitution',
    category: 'Rights',
    questions: [
      {
        id: '1',
        question: 'Which article of Nepal\'s Constitution deals with the Right to Equality?',
        type: 'multiple-choice',
        options: ['Article 16', 'Article 17', 'Article 18', 'Article 19'],
        correctAnswer: 2,
        explanation: 'Article 18 of Nepal\'s Constitution guarantees the Right to Equality, ensuring all citizens are equal before the law.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '2',
        question: 'The Right to Information is guaranteed under which article?',
        type: 'multiple-choice',
        options: ['Article 27', 'Article 28', 'Article 29', 'Article 30'],
        correctAnswer: 0,
        explanation: 'Article 27 of the Constitution guarantees the Right to Information, ensuring citizens can access information from public bodies.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'Which fundamental right prohibits untouchability and caste-based discrimination?',
        type: 'multiple-choice',
        options: ['Right to Freedom', 'Right to Equality', 'Right to Justice', 'Right to Education'],
        correctAnswer: 1,
        explanation: 'The Right to Equality (Article 18) specifically prohibits untouchability and any form of caste-based discrimination.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '4',
        question: 'The right to free and compulsory basic education is guaranteed under which article?',
        type: 'multiple-choice',
        options: ['Article 30', 'Article 31', 'Article 32', 'Article 33'],
        correctAnswer: 1,
        explanation: 'Article 31 guarantees the right to education, including free and compulsory basic education up to secondary level.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '5',
        question: 'Which of the following is NOT explicitly mentioned as a fundamental right in Nepal\'s Constitution?',
        type: 'multiple-choice',
        options: ['Right to Health', 'Right to Housing', 'Right to Internet Access', 'Right to Food'],
        correctAnswer: 2,
        explanation: 'While the Constitution guarantees rights to health, housing, and food, the right to internet access is not explicitly mentioned as a fundamental right.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '6',
        question: 'The Constitution guarantees both individual and collective rights.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'Nepal\'s Constitution recognizes both individual fundamental rights and collective rights of communities.',
        difficulty: 'medium',
        points: 15,
        hint: 'Think about community rights and cultural preservation'
      }
    ]
  },

  'government-structure': {
    id: 'government-structure',
    title: 'Government Structure',
    description: 'Test your understanding of Nepal\'s government structure and branches',
    category: 'Government',
    questions: [
      {
        id: '1',
        question: 'Who is the Head of State in Nepal?',
        type: 'multiple-choice',
        options: ['Prime Minister', 'President', 'Chief Justice', 'Speaker'],
        correctAnswer: 1,
        explanation: 'The President is the Head of State in Nepal, while the Prime Minister serves as the Head of Government.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'How many members are in Nepal\'s National Assembly (Upper House)?',
        type: 'multiple-choice',
        options: ['56', '59', '62', '65'],
        correctAnswer: 1,
        explanation: 'The National Assembly, the upper house of Nepal\'s federal parliament, consists of 59 members representing provinces and special groups.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'Which branch of government is responsible for interpreting laws?',
        type: 'multiple-choice',
        options: ['Executive', 'Legislative', 'Judicial', 'Administrative'],
        correctAnswer: 2,
        explanation: 'The Judicial branch interprets laws, ensures constitutional compliance, and protects fundamental rights through the court system.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '4',
        question: 'The Chief Justice leads which institution?',
        type: 'multiple-choice',
        options: ['High Court', 'District Court', 'Supreme Court', 'Constitutional Court'],
        correctAnswer: 2,
        explanation: 'The Chief Justice leads the Supreme Court, which is the highest judicial authority in Nepal.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '5',
        question: 'Which body controls public finances and oversees the executive branch?',
        type: 'multiple-choice',
        options: ['Supreme Court', 'Federal Parliament', 'Council of Ministers', 'Election Commission'],
        correctAnswer: 1,
        explanation: 'The Federal Parliament makes laws, controls public finances, and provides oversight of executive actions.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '6',
        question: 'The Prime Minister is directly elected by the people.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'The Prime Minister is elected by the House of Representatives, not directly by the people.',
        difficulty: 'easy',
        points: 10
      }
    ]
  },

  'federal-system': {
    id: 'federal-system',
    title: 'Federal System',
    description: 'Advanced quiz on Nepal\'s federal structure and governance',
    category: 'Federalism',
    questions: [
      {
        id: '1',
        question: 'How many local governments are there in Nepal?',
        type: 'multiple-choice',
        options: ['693', '723', '753', '783'],
        correctAnswer: 2,
        explanation: 'Nepal has 753 local governments comprising 293 municipalities and 460 rural municipalities.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '2',
        question: 'Which level of government is primarily responsible for basic education?',
        type: 'multiple-choice',
        options: ['Federal', 'Provincial', 'Local', 'All levels equally'],
        correctAnswer: 1,
        explanation: 'Provincial governments have primary responsibility for education, though all levels coordinate in educational service delivery.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'What type of electoral system does Nepal use for the House of Representatives?',
        type: 'multiple-choice',
        options: ['First Past the Post only', 'Proportional Representation only', 'Mixed Electoral System', 'Ranked Choice Voting'],
        correctAnswer: 2,
        explanation: 'Nepal uses a mixed electoral system combining First Past the Post and Proportional Representation for electing House of Representatives members.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '4',
        question: 'Which province is NOT among Nepal\'s seven provinces?',
        type: 'multiple-choice',
        options: ['Koshi', 'Himalaya', 'Bagmati', 'Gandaki'],
        correctAnswer: 1,
        explanation: 'The seven provinces are: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, and Sudurpashchim. Himalaya is not a province name.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'Foreign policy and national defense are responsibilities of which level of government?',
        type: 'multiple-choice',
        options: ['Provincial', 'Local', 'Federal', 'Shared responsibility'],
        correctAnswer: 2,
        explanation: 'Foreign policy and national defense are exclusive responsibilities of the federal government under Nepal\'s Constitution.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '6',
        question: 'All levels of government in Nepal have equal powers.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'Nepal follows cooperative federalism where different levels have distinct powers and responsibilities.',
        difficulty: 'medium',
        points: 15,
        hint: 'Consider the division of powers between federal, provincial, and local levels'
      }
    ]
  }
};