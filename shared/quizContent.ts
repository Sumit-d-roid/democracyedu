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
  audiences?: ('school' | 'college')[];
  relatedArticles?: string[];
  cognitiveLevel?: 'recall' | 'comprehension' | 'application' | 'analysis' | 'evaluation';
  targetObjectives?: string[];
  sourceArticles?: { ref: string; note?: string }[];
}

export const quizContents: Record<string, QuizContent> = {
  'labor-rights': {
    id: 'labor-rights',
    title: 'Labor Rights and Employment Quiz',
    description: 'Test your knowledge of labor rights and employment protections in Nepal.',
    category: 'Constitutional Rights',
    questions: [
      {
        id: 'lr1',
        question: 'What fundamental rights are guaranteed to workers in Nepal\'s Constitution?',
        type: 'multiple-choice',
        options: [
          'Only right to work',
          'Fair wages and safe conditions',
          'Only union membership',
          'Only minimum wage'
        ],
        correctAnswer: 1,
        explanation: 'The Constitution guarantees workers fundamental rights including fair wages, safe working conditions, and social security.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'lr2',
        question: 'What is explicitly prohibited under labor rights provisions?',
        type: 'multiple-choice',
        options: [
          'All union activities',
          'Working overtime',
          'Forced labor and child labor',
          'Foreign employment'
        ],
        correctAnswer: 2,
        explanation: 'The Constitution explicitly prohibits forced labor and child labor as part of its fundamental labor rights provisions.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'lr3',
        question: 'What role do trade unions play in labor rights?',
        type: 'multiple-choice',
        options: [
          'No official role',
          'Only collect dues',
          'Rights protection and collective bargaining',
          'Only social activities'
        ],
        correctAnswer: 2,
        explanation: 'Trade unions play crucial roles in protecting worker rights and engaging in collective bargaining on behalf of workers.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'lr4',
        question: 'What does the social security system provide for workers?',
        type: 'multiple-choice',
        options: [
          'Only salary',
          'Only leave benefits',
          'Comprehensive benefits including health and retirement',
          'Only accident coverage'
        ],
        correctAnswer: 2,
        explanation: 'The social security system provides comprehensive benefits including health insurance, accident compensation, and retirement benefits.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'lr5',
        question: 'How are labor rights enforced in Nepal?',
        type: 'multiple-choice',
        options: [
          'Through police only',
          'No enforcement mechanism',
          'Through labor offices and tribunals',
          'By workers themselves'
        ],
        correctAnswer: 2,
        explanation: 'Labor rights are enforced through labor offices and tribunals, with support from labor inspectors and the court system.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },
  'right-to-information': {
    id: 'right-to-information',
    title: 'Right to Information Quiz',
    description: 'Test your understanding of Nepal\'s Right to Information provisions and implementation.',
    category: 'Constitutional Rights',
    questions: [
      {
        id: 'rti1',
        question: 'What is the primary purpose of the Right to Information in Nepal\'s Constitution?',
        type: 'multiple-choice',
        options: [
          'To restrict information access',
          'To ensure access to public information',
          'To protect government secrets',
          'To regulate media only'
        ],
        correctAnswer: 1,
        explanation: 'The Right to Information ensures citizens\' access to information of public importance, promoting transparency and accountability in governance.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'rti2',
        question: 'Which body oversees the implementation of RTI in Nepal?',
        type: 'multiple-choice',
        options: [
          'Supreme Court',
          'Parliament',
          'National Information Commission',
          'Ministry of Communication'
        ],
        correctAnswer: 2,
        explanation: 'The National Information Commission is responsible for overseeing the implementation of RTI provisions and ensuring compliance.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'rti3',
        question: 'What are public bodies required to do under RTI provisions?',
        type: 'multiple-choice',
        options: [
          'Only respond to court orders',
          'Appoint Information Officers and maintain records',
          'Keep all information confidential',
          'Share information only with media'
        ],
        correctAnswer: 1,
        explanation: 'Public bodies must appoint Information Officers, maintain records, and proactively disclose certain information as per RTI provisions.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'rti4',
        question: 'How are RTI exemptions determined?',
        type: 'multiple-choice',
        options: [
          'All information is exempt',
          'Based on public interest tests and clear guidelines',
          'At the discretion of any officer',
          'No exemptions are allowed'
        ],
        correctAnswer: 1,
        explanation: 'RTI exemptions are determined through public interest tests and clear guidelines, balancing transparency with legitimate privacy and security concerns.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'rti5',
        question: 'What role do civil society organizations play in RTI implementation?',
        type: 'multiple-choice',
        options: [
          'No role allowed',
          'Only file complaints',
          'Promote awareness and usage',
          'Replace government functions'
        ],
        correctAnswer: 2,
        explanation: 'Civil society organizations play crucial roles in promoting RTI awareness and helping citizens use RTI effectively.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },
  'property-rights': {
    id: 'property-rights',
    title: 'Property Rights Quiz',
    description: 'Test your understanding of property rights and restrictions under Nepal\'s Constitution.',
    category: 'Constitutional Rights',
    questions: [
      {
        id: 'pr1',
        question: 'What is the constitutional stance on property acquisition for public purpose?',
        type: 'multiple-choice',
        options: [
          'Completely prohibited',
          'Allowed without compensation',
          'Allowed with fair compensation',
          'Only government property can be acquired'
        ],
        correctAnswer: 2,
        explanation: 'The Constitution allows property acquisition for public purpose but requires fair compensation to be provided to the owner.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'pr2',
        question: 'How does the Constitution address inheritance rights?',
        type: 'multiple-choice',
        options: [
          'Only males have inheritance rights',
          'Equal rights regardless of gender',
          'Only firstborn children have rights',
          'Based on family traditions only'
        ],
        correctAnswer: 1,
        explanation: 'The Constitution guarantees equal inheritance rights regardless of gender, promoting gender equality in property matters.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'pr3',
        question: 'What type of restrictions can be imposed on property rights?',
        type: 'multiple-choice',
        options: [
          'No restrictions allowed',
          'Only during emergencies',
          'Reasonable restrictions for public benefit',
          'Only on foreign-owned property'
        ],
        correctAnswer: 2,
        explanation: 'The state can impose reasonable restrictions on property rights for public benefit, including land ceilings and environmental protection.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'pr4',
        question: 'How are property disputes primarily resolved?',
        type: 'multiple-choice',
        options: [
          'Through police intervention only',
          'By community leaders only',
          'Through courts and special tribunals',
          'No formal resolution system exists'
        ],
        correctAnswer: 2,
        explanation: 'Property disputes are resolved through courts and special tribunals, with established legal and administrative procedures.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'pr5',
        question: 'What is the constitutional approach to foreign property ownership?',
        type: 'multiple-choice',
        options: [
          'Completely unrestricted',
          'Subject to specific restrictions',
          'Completely prohibited',
          'Only allowed for diplomatic missions'
        ],
        correctAnswer: 1,
        explanation: 'Foreign property ownership is subject to specific restrictions under constitutional and legal provisions to protect national interests.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },
  'media-press-freedom': {
    id: 'media-press-freedom',
    title: 'Media and Press Freedom Quiz',
    description: 'Test your knowledge of constitutional provisions for media and press freedom in Nepal.',
    category: 'Constitutional Rights',
    questions: [
      {
        id: 'mpf1',
        question: 'What fundamental protection does the Constitution provide to media organizations?',
        type: 'multiple-choice',
        options: [
          'Protection only for government media',
          'Protection against censorship and equipment seizure',
          'Protection only for print media',
          'Protection only during emergencies'
        ],
        correctAnswer: 1,
        explanation: 'The Constitution protects media organizations against censorship, closure, and equipment seizure, ensuring their ability to operate freely.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'mpf2',
        question: 'Which organization oversees ethical standards in Nepali media?',
        type: 'multiple-choice',
        options: [
          'Ministry of Information',
          'Supreme Court',
          'Press Council Nepal',
          'Parliamentary Committee'
        ],
        correctAnswer: 2,
        explanation: 'Press Council Nepal is responsible for overseeing ethical standards in media and promoting responsible journalism.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'mpf3',
        question: 'How does the Constitution protect digital media?',
        type: 'multiple-choice',
        options: [
          'It doesn\'t cover digital media',
          'Only protects government websites',
          'Extends press freedom protections to all digital platforms',
          'Only protects registered news websites'
        ],
        correctAnswer: 2,
        explanation: 'The Constitution extends press freedom protections to all digital media platforms, including social media, news websites, and digital broadcasting.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'mpf4',
        question: 'What protection exists regarding media registration cancellation?',
        type: 'multiple-choice',
        options: [
          'No protection exists',
          'Protection only for large media houses',
          'Prohibition of cancellation based on content',
          'Protection only with court order'
        ],
        correctAnswer: 2,
        explanation: 'The Constitution prohibits the cancellation of media registrations based on content, protecting editorial independence.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'mpf5',
        question: 'Which right is guaranteed to journalists regarding their sources?',
        type: 'multiple-choice',
        options: [
          'Must always reveal sources',
          'Right to protect source identity',
          'Only protect government sources',
          'No specific rights about sources'
        ],
        correctAnswer: 1,
        explanation: 'Journalists have the constitutional right to protect the identity of their sources, a crucial aspect of press freedom.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },
  'language-culture': {
    id: 'language-culture',
    title: 'Language and Cultural Rights Quiz',
    description: 'Test your understanding of Nepal\'s constitutional provisions for language rights and cultural preservation.',
    category: 'Constitutional Rights',
    questions: [
      {
        id: 'lc1',
        question: 'What status does the Constitution give to languages spoken in Nepal?',
        type: 'multiple-choice',
        options: [
          'Only Nepali is recognized officially',
          'All languages are recognized as national languages',
          'Only regional languages are recognized',
          'Languages must apply for official recognition'
        ],
        correctAnswer: 1,
        explanation: 'The Constitution recognizes all languages spoken in Nepal as national languages, reflecting the country\'s commitment to linguistic diversity.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: 'lc2',
        question: 'Which right regarding mother tongue education is guaranteed by the Constitution?',
        type: 'multiple-choice',
        options: [
          'Right to establish private language schools only',
          'Right to receive basic education in mother tongue',
          'Right to study mother tongue as an optional subject',
          'Right to teach mother tongue in universities only'
        ],
        correctAnswer: 1,
        explanation: 'Communities have the constitutional right to receive basic education in their mother tongue, supporting linguistic preservation and educational access.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'lc3',
        question: 'What role does the Language Commission play in Nepal?',
        type: 'multiple-choice',
        options: [
          'Directly teaching languages',
          'Publishing dictionaries only',
          'Advising on language policies and preservation',
          'Enforcing language laws'
        ],
        correctAnswer: 2,
        explanation: 'The Language Commission serves an advisory role on language policies and preservation strategies, helping guide government decisions on language matters.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: 'lc4',
        question: 'Which level of government can determine additional official languages for their region?',
        type: 'multiple-choice',
        options: [
          'Only federal government',
          'Only provincial government',
          'Only local government',
          'Both local and provincial governments'
        ],
        correctAnswer: 3,
        explanation: 'Both local and provincial governments have the authority to determine additional official languages for their respective regions.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: 'lc5',
        question: 'What is one of the main challenges in implementing language and cultural rights?',
        type: 'multiple-choice',
        options: [
          'Lack of constitutional provisions',
          'Resource limitations and standardization issues',
          'Opposition from communities',
          'Absence of government institutions'
        ],
        correctAnswer: 1,
        explanation: 'Resource limitations and standardization issues, particularly in mother tongue education, are major challenges in implementing language and cultural rights.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },
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
  },

  'directive-principles': {
    id: 'directive-principles',
    title: 'Directive Principles & State Policies',
    description: 'Test your knowledge of Nepal\'s Directive Principles, State Policies, and Obligations',
    category: 'Constitution',
    questions: [
      {
        id: '1',
        question: 'In which Part of the Constitution of Nepal (2015) are Directive Principles, Policies and Obligations of the State mentioned?',
        type: 'multiple-choice',
        options: ['Part 2', 'Part 3', 'Part 4', 'Part 5'],
        correctAnswer: 2,
        explanation: 'Directive Principles, Policies and Obligations of the State are found in Part 4 of the Constitution of Nepal (2015), Articles 50-55.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'Which of the following is NOT a Directive Principle of the State?',
        type: 'multiple-choice',
        options: ['Protect sovereignty and integrity', 'Promote rule of law and human rights', 'Provide free emergency health care', 'Achieve socialism-oriented economy'],
        correctAnswer: 2,
        explanation: 'Providing free emergency health care is a Fundamental Right under health, not a Directive Principle. The other options are Directive Principles mentioned in Article 50.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'The State\'s obligation regarding Directive Principles is to:',
        type: 'multiple-choice',
        options: ['Enforce them in courts', 'Use them to guide laws, policies, and programs', 'Replace Fundamental Rights with them', 'Apply them only during emergencies'],
        correctAnswer: 1,
        explanation: 'The State is obligated to use Directive Principles to guide the formulation of laws, policies, and programs. They are not directly enforceable in courts.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'Under State Policies, Nepal is committed to:',
        type: 'multiple-choice',
        options: ['Protecting biodiversity and mitigating climate change', 'Privatizing all natural resources', 'Recognizing only one language and culture', 'Maintaining military dominance in South Asia'],
        correctAnswer: 0,
        explanation: 'Nepal\'s State Policies include protecting biodiversity and mitigating climate change effects. The other options contradict various state policies.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'What is the major difference between Fundamental Rights and Directive Principles?',
        type: 'multiple-choice',
        options: ['Both are equally enforceable in court', 'Fundamental Rights are enforceable, Directive Principles are not', 'Directive Principles give more power to citizens', 'Directive Principles are stronger than Fundamental Rights'],
        correctAnswer: 1,
        explanation: 'The key difference is that Fundamental Rights are legally enforceable in courts, while Directive Principles serve as guidelines and are not directly enforceable.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },

  'fundamental-duties': {
    id: 'fundamental-duties',
    title: 'Fundamental Duties of Citizens',
    description: 'Test your knowledge of citizens\' constitutional duties and responsibilities',
    category: 'Constitution',
    questions: [
      {
        id: '1',
        question: 'Fundamental Duties are listed in which part of the Constitution?',
        type: 'multiple-choice',
        options: ['Part 3', 'Part 4', 'Part 5', 'Part 6'],
        correctAnswer: 2,
        explanation: 'Fundamental Duties of Citizens are listed in Part 5 of the Constitution of Nepal 2015.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'Which of the following is a Fundamental Duty of citizens?',
        type: 'multiple-choice',
        options: [
          'Enjoying rights without responsibilities',
          'Obeying laws and participating in democratic process',
          'Ignoring environmental concerns',
          'Disregarding social justice'
        ],
        correctAnswer: 1,
        explanation: 'Citizens have a fundamental duty to obey laws and participate in the democratic process, including voting and civic engagement.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'Protecting forests, rivers, and wildlife falls under which duty?',
        type: 'multiple-choice',
        options: ['Rule of Law', 'Environmental Responsibility', 'National Security', 'Promotion of Culture'],
        correctAnswer: 1,
        explanation: 'Environmental Responsibility is a fundamental duty that includes protecting natural resources like forests, rivers, and wildlife.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'Fundamental Duties ensure that:',
        type: 'multiple-choice',
        options: [
          'Citizens can act without accountability',
          'Rights are exercised responsibly',
          'Only the government has responsibilities',
          'The Constitution can be ignored'
        ],
        correctAnswer: 1,
        explanation: 'Fundamental Duties ensure that constitutional rights are exercised responsibly, balancing individual freedoms with societal obligations.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'Promoting education, research, innovation, and culture is part of:',
        type: 'multiple-choice',
        options: [
          'National Security',
          'Rule of Law',
          'Promotion of Education and Culture',
          'Loyalty and Respect'
        ],
        correctAnswer: 2,
        explanation: 'The duty to promote education, research, innovation, and culture falls under the Promotion of Education and Culture category of fundamental duties.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },

  'constitutional-bodies': {
    id: 'constitutional-bodies',
    title: 'Constitutional Bodies',
    description: 'Test your knowledge of Nepal\'s Constitutional Bodies and their roles',
    category: 'Constitution',
    questions: [
      {
        id: '1',
        question: 'Which constitutional body is responsible for investigating abuse of authority and corruption?',
        type: 'multiple-choice',
        options: [
          'Election Commission',
          'Commission for Investigation of Abuse of Authority (CIAA)',
          'National Human Rights Commission',
          'Public Service Commission'
        ],
        correctAnswer: 1,
        explanation: 'The Commission for Investigation of Abuse of Authority (CIAA) is Nepal\'s premier anti-corruption agency, responsible for investigating and preventing corruption and abuse of authority in public offices.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'What is the main function of the Election Commission?',
        type: 'multiple-choice',
        options: [
          'Investigating corruption',
          'Protecting human rights',
          'Conducting and supervising all elections',
          'Managing civil service recruitment'
        ],
        correctAnswer: 2,
        explanation: 'The Election Commission is responsible for conducting, supervising, directing, and controlling all elections in Nepal, including federal parliament, provincial assemblies, and local bodies.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'The National Human Rights Commission (NHRC) has the power to:',
        type: 'multiple-choice',
        options: [
          'Conduct elections',
          'Recruit civil servants',
          'Inspect detention facilities',
          'Distribute natural resources'
        ],
        correctAnswer: 2,
        explanation: 'The NHRC has the power to visit and inspect any government premises or institution where people are detained, as part of its mandate to protect human rights.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'Which commission is responsible for fair recruitment in civil service?',
        type: 'multiple-choice',
        options: [
          'Public Service Commission',
          'Election Commission',
          'National Women Commission',
          'Fiscal Commission'
        ],
        correctAnswer: 0,
        explanation: 'The Public Service Commission ensures fair and merit-based recruitment in Nepal\'s civil service through competitive examinations and selection processes.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'Constitutional Bodies in Nepal:',
        type: 'multiple-choice',
        options: [
          'Are part of the executive branch',
          'Report directly to the Prime Minister',
          'Report to the Federal Parliament',
          'Are controlled by the Supreme Court'
        ],
        correctAnswer: 2,
        explanation: 'Constitutional Bodies are independent institutions that report directly to the Federal Parliament, ensuring their autonomy from executive control.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },

  'local-government': {
    id: 'local-government',
    title: 'Local Government System',
    description: 'Test your understanding of Nepal\'s local government structure and functions',
    category: 'Governance',
    questions: [
      {
        id: '1',
        question: 'How many municipalities are there in Nepal?',
        type: 'multiple-choice',
        options: ['273', '283', '293', '303'],
        correctAnswer: 2,
        explanation: 'Nepal has 293 municipalities (Nagarpalikas) which serve as local governments for urban areas.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '2',
        question: 'Who heads the executive body of a municipality?',
        type: 'multiple-choice',
        options: [
          'Chief Administrative Officer',
          'Mayor',
          'Ward Chairperson',
          'District Coordinator'
        ],
        correctAnswer: 1,
        explanation: 'The Mayor serves as the head of the executive body in municipalities, while in rural municipalities, it\'s the Chairperson.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '3',
        question: 'Which of these is NOT a function of local government?',
        type: 'multiple-choice',
        options: [
          'Basic education management',
          'Primary healthcare',
          'Foreign policy decisions',
          'Local infrastructure development'
        ],
        correctAnswer: 2,
        explanation: 'Foreign policy is exclusively handled by the federal government. Local governments manage local services like education, healthcare, and infrastructure.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'Local governments receive funding from:',
        type: 'multiple-choice',
        options: [
          'Federal government only',
          'Provincial government only',
          'Both federal and provincial governments plus own revenue',
          'International donors only'
        ],
        correctAnswer: 2,
        explanation: 'Local governments receive fiscal transfers from both federal and provincial governments and can generate their own revenue through local taxes and fees.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'Which committee at the local level often handles minor legal disputes?',
        type: 'multiple-choice',
        options: [
          'Executive Committee',
          'Judicial Committee',
          'Administrative Committee',
          'Planning Committee'
        ],
        correctAnswer: 1,
        explanation: 'The Judicial Committee, usually headed by the Deputy Mayor/Vice-Chair, handles minor legal disputes at the local level.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },

  'political-parties': {
    id: 'political-parties',
    title: 'Political Parties and Elections',
    description: 'Test your knowledge of Nepal\'s political party system and electoral processes',
    category: 'Politics',
    questions: [
      {
        id: '1',
        question: 'How many members of the House of Representatives are elected through First-Past-the-Post (FPTP)?',
        type: 'multiple-choice',
        options: ['145', '155', '165', '175'],
        correctAnswer: 2,
        explanation: '165 members of the House of Representatives are elected through the First-Past-the-Post system, while 110 are elected through Proportional Representation.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '2',
        question: 'Which body is responsible for registering and regulating political parties in Nepal?',
        type: 'multiple-choice',
        options: [
          'Supreme Court',
          'Election Commission',
          'Ministry of Home Affairs',
          'Parliament Secretariat'
        ],
        correctAnswer: 1,
        explanation: 'The Election Commission is responsible for registering political parties, regulating their activities, and ensuring they follow democratic principles and election codes.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '3',
        question: 'What type of electoral system does Nepal use?',
        type: 'multiple-choice',
        options: [
          'Pure First-Past-the-Post',
          'Pure Proportional Representation',
          'Mixed Electoral System',
          'Single Transferable Vote'
        ],
        correctAnswer: 2,
        explanation: 'Nepal uses a mixed electoral system that combines First-Past-the-Post (FPTP) and Proportional Representation (PR) to ensure both direct representation and inclusivity.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'Political parties in Nepal must ensure:',
        type: 'multiple-choice',
        options: [
          'Only regional representation',
          'Only ethnic representation',
          'Inclusive representation in party committees',
          'Only gender representation'
        ],
        correctAnswer: 2,
        explanation: 'Political parties must ensure inclusive representation in their party committees, including representation of various groups: women, Dalits, indigenous peoples, Madhesis, and other marginalized communities.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '5',
        question: 'Which of these is NOT a legitimate source of political party funding?',
        type: 'multiple-choice',
        options: [
          'Membership fees',
          'State funding',
          'Foreign government donations',
          'Individual citizen donations'
        ],
        correctAnswer: 2,
        explanation: 'Foreign government donations are prohibited as a source of political party funding. Legitimate sources include membership fees, domestic donations, and state funding based on electoral performance.',
        difficulty: 'medium',
        points: 15
      }
    ]
  },
  
  'citizenship': {
    id: 'citizenship',
    title: 'Citizenship and Immigration',
    description: 'Test your understanding of Nepal\'s citizenship laws and immigration policies',
    category: 'Rights',
    questions: [
      {
        id: '1',
        question: 'Which of these is a method of acquiring Nepali citizenship?',
        type: 'multiple-choice',
        options: [
          'Only by birth',
          'Only by descent',
          'Multiple methods including descent, birth, and naturalization',
          'Only through naturalization'
        ],
        correctAnswer: 2,
        explanation: 'Nepal\'s Constitution provides multiple pathways to citizenship including by descent (through parents), by birth (for those born in Nepal), by naturalization (through marriage or long-term residence), and honorary citizenship.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'Who manages visa and residence permits in Nepal?',
        type: 'multiple-choice',
        options: [
          'Ministry of Foreign Affairs',
          'Department of Immigration',
          'Home Ministry',
          'District Administration Office'
        ],
        correctAnswer: 1,
        explanation: 'The Department of Immigration is responsible for managing visas, residence permits, and foreign national registration in Nepal.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'Which right is specifically reserved for Nepali citizens?',
        type: 'multiple-choice',
        options: [
          'Right to life',
          'Right to health',
          'Right to vote',
          'Right to fair trial'
        ],
        correctAnswer: 2,
        explanation: 'While many rights apply to all persons in Nepal, certain rights like voting are specifically reserved for citizens only.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'What is a current challenge in Nepal\'s citizenship system?',
        type: 'multiple-choice',
        options: [
          'Too many citizens',
          'Issues of statelessness',
          'Excess immigration',
          'Too many naturalization cases'
        ],
        correctAnswer: 1,
        explanation: 'Statelessness remains a significant challenge in Nepal\'s citizenship system, particularly affecting children of single mothers and certain marginalized communities.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '5',
        question: 'Non-citizens in Nepal:',
        type: 'multiple-choice',
        options: [
          'Have all the same rights as citizens',
          'Have no rights at all',
          'Have limited rights and restrictions on property ownership',
          'Can vote in local elections'
        ],
        correctAnswer: 2,
        explanation: 'Non-citizens have limited rights in Nepal and face restrictions on certain activities like property ownership and political participation, while still maintaining basic human rights.',
        difficulty: 'medium',
        points: 15
      }
    ]
  },

  'emergency-powers': {
    id: 'emergency-powers',
    title: 'Emergency Powers',
    description: 'Test your knowledge of emergency provisions in Nepal\'s Constitution',
    category: 'Constitution',
    questions: [
      {
        id: '1',
        question: 'Who can declare a state of emergency in Nepal?',
        type: 'multiple-choice',
        options: [
          'Prime Minister directly',
          'President on Council of Ministers\' recommendation',
          'Parliament by simple majority',
          'Supreme Court Chief Justice'
        ],
        correctAnswer: 1,
        explanation: 'The President declares a state of emergency, but only upon the recommendation of the Council of Ministers. This ensures both executive oversight and checks on power.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '2',
        question: 'Within how many days must Parliament approve an emergency declaration?',
        type: 'multiple-choice',
        options: ['15 days', '30 days', '45 days', '60 days'],
        correctAnswer: 1,
        explanation: 'A state of emergency must be approved by Parliament within 30 days of declaration. Without this approval, the emergency declaration becomes void.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'Which right cannot be suspended during an emergency?',
        type: 'multiple-choice',
        options: [
          'Right to assembly',
          'Right to property',
          'Right to life and habeas corpus',
          'Right to information'
        ],
        correctAnswer: 2,
        explanation: 'Certain fundamental rights, including the right to life and habeas corpus, cannot be suspended even during emergencies to protect basic human rights.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '4',
        question: 'What is the maximum initial extension period for an emergency?',
        type: 'multiple-choice',
        options: [
          'One month',
          'Two months',
          'Three months',
          'Six months'
        ],
        correctAnswer: 2,
        explanation: 'An emergency can be extended for up to three months at a time, requiring fresh parliamentary approval for each extension.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'Which body can review the constitutionality of emergency declarations?',
        type: 'multiple-choice',
        options: [
          'Election Commission',
          'Supreme Court',
          'Constitutional Council',
          'Parliament Committee'
        ],
        correctAnswer: 1,
        explanation: 'The Supreme Court has the power to review the constitutionality of emergency declarations and measures taken during emergencies.',
        difficulty: 'medium',
        points: 15
      }
    ]
  },

  'constitutional-amendments': {
    id: 'constitutional-amendments',
    title: 'Constitutional Amendments',
    description: 'Test your knowledge of Nepal\'s constitutional amendment process and history',
    category: 'Constitution',
    questions: [
      {
        id: '1',
        question: 'What majority is required in Parliament to pass a constitutional amendment?',
        type: 'multiple-choice',
        options: [
          'Simple majority',
          'Two-thirds majority',
          'Three-fourths majority',
          'Unanimous consent'
        ],
        correctAnswer: 1,
        explanation: 'Constitutional amendments require a two-thirds majority in Parliament for passage, ensuring broad consensus for significant changes.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '2',
        question: 'Which of these cannot be amended without special procedures?',
        type: 'multiple-choice',
        options: [
          'Administrative procedures',
          'Electoral systems',
          'Sovereignty and territorial integrity',
          'Local government structure'
        ],
        correctAnswer: 2,
        explanation: 'Sovereignty and territorial integrity are fundamental aspects of the Constitution that require special procedures for amendment to ensure protection of core national interests.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '3',
        question: 'When do Provincial Assemblies need to approve constitutional amendments?',
        type: 'multiple-choice',
        options: [
          'Never',
          'For all amendments',
          'When changes affect provincial powers',
          'Only for emergency provisions'
        ],
        correctAnswer: 2,
        explanation: 'Provincial Assemblies must approve amendments that affect provincial powers or boundaries, reflecting Nepal\'s federal structure.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'The amendment process includes:',
        type: 'multiple-choice',
        options: [
          'Only parliamentary vote',
          'Public consultation and parliamentary debate',
          'Supreme Court approval only',
          'Presidential decree only'
        ],
        correctAnswer: 1,
        explanation: 'The amendment process includes both public consultation and parliamentary debate to ensure thorough consideration and democratic participation.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '5',
        question: 'Constitutional amendments since 2015 have addressed:',
        type: 'multiple-choice',
        options: [
          'Only administrative issues',
          'Only security matters',
          'Multiple issues including federal boundaries and citizenship',
          'Only economic policies'
        ],
        correctAnswer: 2,
        explanation: 'Since 2015, constitutional amendments have addressed various issues including federal boundaries, citizenship provisions, and representation matters.',
        difficulty: 'medium',
        points: 15
      }
    ]
  },

  'public-service': {
    id: 'public-service',
    title: 'Public Service Commission',
    description: 'Test your knowledge of Nepal\'s Public Service Commission and civil service recruitment',
    category: 'Governance',
    questions: [
      {
        id: '1',
        question: 'Who appoints the Chairperson of the Public Service Commission?',
        type: 'multiple-choice',
        options: [
          'Prime Minister directly',
          'Parliament through voting',
          'President on Constitutional Council\'s recommendation',
          'Supreme Court Chief Justice'
        ],
        correctAnswer: 2,
        explanation: 'The Chairperson of the Public Service Commission is appointed by the President on the recommendation of the Constitutional Council.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '2',
        question: 'What is the term of office for PSC members?',
        type: 'multiple-choice',
        options: [
          'Four years',
          'Five years',
          'Six years',
          'Seven years'
        ],
        correctAnswer: 2,
        explanation: 'Members of the Public Service Commission serve for a term of six years.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '3',
        question: 'Which of these is a function of the PSC?',
        type: 'multiple-choice',
        options: [
          'Making laws',
          'Conducting civil service examinations',
          'Managing government finances',
          'Foreign policy decisions'
        ],
        correctAnswer: 1,
        explanation: 'The PSC is responsible for conducting civil service examinations and ensuring merit-based recruitment in the civil service.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '4',
        question: 'PSC recommendations are:',
        type: 'multiple-choice',
        options: [
          'Optional for the government',
          'Binding within its jurisdiction',
          'Subject to parliamentary approval',
          'Only advisory in nature'
        ],
        correctAnswer: 1,
        explanation: 'The recommendations of the Public Service Commission are binding on matters within its jurisdiction.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'Recent PSC reforms include:',
        type: 'multiple-choice',
        options: [
          'Eliminating examinations',
          'Restricting applications',
          'Online applications and computerized testing',
          'Reducing transparency'
        ],
        correctAnswer: 2,
        explanation: 'The PSC has modernized its processes through reforms including online applications, computerized testing, and digital result publication.',
        difficulty: 'medium',
        points: 15
      }
    ]
  },

  'judiciary': {
    id: 'judiciary',
    title: 'Judiciary System',
    description: 'Test your knowledge of Nepal\'s judicial system and courts',
    category: 'Governance',
    questions: [
      {
        id: '1',
        question: 'How many tiers are there in Nepal\'s court system?',
        type: 'multiple-choice',
        options: [
          'Two tiers',
          'Three tiers',
          'Four tiers',
          'Five tiers'
        ],
        correctAnswer: 1,
        explanation: 'Nepal has a three-tier court system consisting of the Supreme Court, High Courts at the provincial level, and District Courts.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'Which court is the final interpreter of Nepal\'s Constitution?',
        type: 'multiple-choice',
        options: [
          'High Court',
          'Constitutional Court',
          'Supreme Court',
          'Federal Court'
        ],
        correctAnswer: 2,
        explanation: 'The Supreme Court is Nepal\'s highest court and the final interpreter of the Constitution, with its decisions binding on all other courts.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'What type of cases do District Courts primarily handle?',
        type: 'multiple-choice',
        options: [
          'Only criminal cases',
          'Only civil cases',
          'Both civil and criminal cases',
          'Only constitutional cases'
        ],
        correctAnswer: 2,
        explanation: 'District Courts are courts of first instance that handle both civil and criminal cases at the local level.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'Which body oversees judicial conduct and accountability?',
        type: 'multiple-choice',
        options: [
          'Parliament',
          'Judicial Council',
          'Supreme Court only',
          'Ministry of Law'
        ],
        correctAnswer: 1,
        explanation: 'The Judicial Council provides oversight of judicial conduct and accountability while maintaining judicial independence.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '5',
        question: 'Special Courts in Nepal are established for:',
        type: 'multiple-choice',
        options: [
          'Replacing regular courts',
          'Handling specific types of cases',
          'Political cases only',
          'International cases only'
        ],
        correctAnswer: 1,
        explanation: 'Special Courts and Tribunals are established to handle specific types of cases like administrative matters and labor disputes, ensuring expert handling of specialized legal matters.',
        difficulty: 'medium',
        points: 15
      }
    ]
  },

  'parliamentary-procedures': {
    id: 'parliamentary-procedures',
    title: 'Parliamentary Procedures',
    description: 'Test your knowledge of Nepal\'s parliamentary procedures and legislative process',
    category: 'Governance',
    questions: [
      {
        id: '1',
        question: 'What is the first stage in the legislative process?',
        type: 'multiple-choice',
        options: [
          'Committee review',
          'Bill introduction',
          'Final voting',
          'Presidential assent'
        ],
        correctAnswer: 1,
        explanation: 'The legislative process begins with bill introduction in Parliament, followed by readings, committee review, and voting.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'Which parliamentary session allows members to question ministers?',
        type: 'multiple-choice',
        options: [
          'Zero Hour',
          'Question Hour',
          'Debate Hour',
          'Motion Time'
        ],
        correctAnswer: 1,
        explanation: 'Question Hour is a dedicated session where members can question ministers about government policies and actions.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'Parliamentary committees have the power to:',
        type: 'multiple-choice',
        options: [
          'Pass laws independently',
          'Appoint ministers',
          'Summon officials and gather evidence',
          'Declare emergencies'
        ],
        correctAnswer: 2,
        explanation: 'Parliamentary committees have the power to summon officials, gather evidence, and make recommendations to Parliament.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '4',
        question: 'Who maintains order during parliamentary sessions?',
        type: 'multiple-choice',
        options: [
          'Prime Minister',
          'President',
          'Speaker',
          'Chief Whip'
        ],
        correctAnswer: 2,
        explanation: 'The Speaker maintains order during parliamentary sessions and ensures adherence to parliamentary rules and procedures.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '5',
        question: 'What is Zero Hour used for in Parliament?',
        type: 'multiple-choice',
        options: [
          'Lunch break',
          'Voting on bills',
          'Raising urgent matters',
          'Committee meetings'
        ],
        correctAnswer: 2,
        explanation: 'Zero Hour is a time when members can raise urgent matters of public importance without prior notice.',
        difficulty: 'hard',
        points: 20
      }
    ]
  },

  'financial-procedures': {
    id: 'financial-procedures',
    title: 'Financial Procedures',
    description: 'Test your knowledge of Nepal\'s financial procedures and fiscal management',
    category: 'Governance',
    questions: [
      {
        id: '1',
        question: 'Who presents the annual budget to Parliament?',
        type: 'multiple-choice',
        options: [
          'Prime Minister',
          'Finance Minister',
          'President',
          'Revenue Secretary'
        ],
        correctAnswer: 1,
        explanation: 'The Finance Minister presents the annual budget to Parliament, where it undergoes debate and scrutiny before approval.',
        difficulty: 'easy',
        points: 10
      },
      {
        id: '2',
        question: 'Which body conducts annual audits of government accounts?',
        type: 'multiple-choice',
        options: [
          'Finance Ministry',
          'Revenue Board',
          'Office of the Auditor General',
          'Parliamentary Committee'
        ],
        correctAnswer: 2,
        explanation: 'The Office of the Auditor General is responsible for conducting annual audits of all government accounts to ensure financial accountability.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '3',
        question: 'The National Natural Resources and Fiscal Commission is responsible for:',
        type: 'multiple-choice',
        options: [
          'Collecting taxes',
          'Preparing budgets',
          'Recommending resource distribution',
          'Conducting audits'
        ],
        correctAnswer: 2,
        explanation: 'The Commission recommends formulas for the distribution of resources between different levels of government in Nepal\'s federal system.',
        difficulty: 'hard',
        points: 20
      },
      {
        id: '4',
        question: 'Revenue rights in Nepal are:',
        type: 'multiple-choice',
        options: [
          'Exclusively federal',
          'Divided between government levels',
          'Only for local governments',
          'Managed by provinces only'
        ],
        correctAnswer: 1,
        explanation: 'The constitution divides revenue rights between federal, provincial, and local governments as part of fiscal federalism.',
        difficulty: 'medium',
        points: 15
      },
      {
        id: '5',
        question: 'Which of these is a key expenditure control mechanism?',
        type: 'multiple-choice',
        options: [
          'Public voting',
          'Pre-audit checks',
          'Media coverage',
          'Political approval'
        ],
        correctAnswer: 1,
        explanation: 'Pre-audit checks are one of the key expenditure control mechanisms, along with budget controls and treasury management.',
        difficulty: 'medium',
        points: 15
      }
    ]
  }
};