export interface LessonSection {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
}

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  sections: LessonSection[];
  summary: string[];
}

export const lessonContents: Record<string, LessonContent> = {
  'fundamental-rights': {
    id: 'fundamental-rights',
    title: 'Fundamental Rights',
    description: 'Learn about the fundamental rights guaranteed by Nepal\'s Constitution, including civil liberties and human rights protections.',
    icon: '⚖️',
    difficulty: 'beginner',
    estimatedTime: '15 minutes',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction to Fundamental Rights',
        content: `Fundamental rights are basic human rights guaranteed by Nepal's Constitution to all citizens. These rights ensure dignity, equality, and freedom for every person in Nepal. The Constitution of Nepal 2015 includes comprehensive fundamental rights that protect citizens from discrimination and ensure access to justice, education, and basic services.`,
        keyPoints: [
          'Fundamental rights are constitutionally guaranteed',
          'They protect all citizens equally',
          'These rights ensure human dignity and freedom',
          'They are enforceable through courts'
        ]
      },
      {
        id: 'right-to-equality',
        title: 'Right to Equality (Article 18)',
        content: `Article 18 of Nepal's Constitution guarantees the right to equality. This means all citizens are equal before the law and entitled to equal protection. No person can be discriminated against based on religion, race, caste, tribe, sex, language, or political belief. This article also prohibits untouchability and caste-based discrimination.`,
        keyPoints: [
          'All citizens are equal before the law',
          'No discrimination based on religion, race, caste, or gender',
          'Untouchability is prohibited and punishable',
          'Equal access to public services and facilities'
        ]
      },
      {
        id: 'freedom-rights',
        title: 'Freedom Rights (Articles 16-17)',
        content: `The Constitution guarantees several freedom rights including the right to live with dignity (Article 16) and freedom of opinion and expression (Article 17). Citizens have the right to express their thoughts freely, access information, and participate in peaceful assembly. However, these freedoms come with reasonable restrictions to maintain public order and national security.`,
        keyPoints: [
          'Right to live with dignity',
          'Freedom of opinion and expression',
          'Right to access information',
          'Freedom of peaceful assembly',
          'Rights subject to reasonable restrictions'
        ]
      },
      {
        id: 'economic-social-rights',
        title: 'Economic and Social Rights',
        content: `Nepal's Constitution includes important economic and social rights such as the right to education (Article 31), right to health (Article 35), and right to food (Article 36). These rights ensure basic standards of living and human development. The state has the obligation to progressively implement these rights through appropriate legislation and policies.`,
        keyPoints: [
          'Right to free and compulsory basic education',
          'Right to healthcare services',
          'Right to food sovereignty',
          'Right to safe drinking water and sanitation',
          'Progressive implementation by the state'
        ]
      }
    ],
    summary: [
      'Fundamental rights ensure equality and dignity for all citizens',
      'Article 18 guarantees right to equality and prohibits discrimination',
      'Freedom rights include expression, information, and assembly',
      'Economic and social rights cover education, health, and basic needs',
      'These rights are enforceable through constitutional mechanisms'
    ]
  },
  
  'government-structure': {
    id: 'government-structure',
    title: 'Government Structure',
    description: 'Understand the structure of Nepal\'s government including the executive, legislative, and judicial branches.',
    icon: '🏛️',
    difficulty: 'intermediate',
    estimatedTime: '20 minutes',
    sections: [
      {
        id: 'three-branches',
        title: 'Three Branches of Government',
        content: `Nepal follows the principle of separation of powers with three distinct branches: Executive, Legislative, and Judicial. Each branch has specific powers and responsibilities, providing checks and balances to prevent abuse of power. This system ensures democratic governance and protection of citizens' rights.`,
        keyPoints: [
          'Executive branch implements and enforces laws',
          'Legislative branch makes laws',
          'Judicial branch interprets laws and ensures justice',
          'Separation of powers prevents concentration of authority'
        ]
      },
      {
        id: 'executive-branch',
        title: 'Executive Branch',
        content: `The executive branch is headed by the President as the Head of State and the Prime Minister as the Head of Government. The President performs ceremonial functions and acts on the advice of the Council of Ministers. The Prime Minister leads the government and is responsible to the federal parliament. The Council of Ministers assists in policy implementation and administration.`,
        keyPoints: [
          'President is the Head of State',
          'Prime Minister is the Head of Government',
          'Council of Ministers assists in governance',
          'Executive implements policies and laws'
        ]
      },
      {
        id: 'legislative-branch',
        title: 'Legislative Branch - Federal Parliament',
        content: `Nepal has a bicameral federal parliament consisting of the House of Representatives (Lower House) and the National Assembly (Upper House). The House of Representatives has 275 members elected through mixed electoral system. The National Assembly has 59 members representing provinces and special groups. Parliament makes laws, controls public finances, and oversees the executive.`,
        keyPoints: [
          'Bicameral parliament with two houses',
          'House of Representatives: 275 members',
          'National Assembly: 59 members',
          'Makes laws and controls public finances',
          'Provides oversight of executive actions'
        ]
      },
      {
        id: 'judicial-branch',
        title: 'Judicial Branch',
        content: `The judicial system is headed by the Supreme Court, followed by High Courts at the provincial level, and District Courts at the local level. The Chief Justice leads the Supreme Court, which is the highest court for constitutional interpretation and final appeals. The judiciary is independent and ensures rule of law, constitutional compliance, and protection of fundamental rights.`,
        keyPoints: [
          'Supreme Court is the highest judicial authority',
          'High Courts operate at provincial level',
          'District Courts handle local matters',
          'Independent judiciary ensures rule of law',
          'Courts protect constitutional rights'
        ]
      }
    ],
    summary: [
      'Nepal follows separation of powers with three branches',
      'Executive led by President and Prime Minister',
      'Bicameral federal parliament makes laws',
      'Independent judiciary ensures constitutional compliance',
      'System provides checks and balances for democratic governance'
    ]
  },

  'federal-system': {
    id: 'federal-system',
    title: 'Federal System',
    description: 'Explore Nepal\'s federal system with provinces, local governments, and power distribution.',
    icon: '🗺️',
    difficulty: 'advanced',
    estimatedTime: '25 minutes',
    sections: [
      {
        id: 'federalism-concept',
        title: 'Understanding Federalism in Nepal',
        content: `Nepal adopted federalism through the Constitution of 2015, transforming from a unitary state to a federal democratic republic. Federalism distributes power between the federal government, seven provinces, and 753 local governments. This system aims to ensure inclusive development, local autonomy, and equitable resource distribution while maintaining national unity.`,
        keyPoints: [
          'Transition from unitary to federal system',
          'Three levels of government: federal, provincial, local',
          'Seven provinces with constitutional status',
          '753 local governments across the country',
          'Focus on inclusive and equitable development'
        ]
      },
      {
        id: 'three-levels',
        title: 'Three Levels of Government',
        content: `The Constitution establishes three levels of government with distinct powers and responsibilities. The federal government handles national defense, foreign policy, and citizenship. Provincial governments manage education, health, and internal security within their territories. Local governments focus on basic services, local infrastructure, and community development programs.`,
        keyPoints: [
          'Federal level: defense, foreign policy, currency',
          'Provincial level: education, health, internal security',
          'Local level: basic services, local infrastructure',
          'Concurrent powers shared between levels',
          'Clear division prevents overlap and conflict'
        ]
      },
      {
        id: 'seven-provinces',
        title: 'Seven Provinces of Nepal',
        content: `Nepal is divided into seven provinces, each with its own government, assembly, and chief minister. The provinces are: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, and Sudurpashchim. Each province has the authority to make laws on provincial matters, collect certain taxes, and implement development programs suited to their regional needs and priorities.`,
        keyPoints: [
          'Seven provinces with constitutional recognition',
          'Each province has its own government and assembly',
          'Provincial assemblies make laws on provincial matters',
          'Chief Minister heads provincial government',
          'Provinces can address regional development needs'
        ]
      },
      {
        id: 'local-governments',
        title: 'Local Government Structure',
        content: `Local governments comprise municipalities and rural municipalities, each governed by elected councils. There are 293 municipalities and 460 rural municipalities across Nepal. Local governments have significant autonomy in delivering basic services like education, healthcare, water supply, and sanitation. They also have taxation powers and can implement local development projects based on community needs.`,
        keyPoints: [
          '293 municipalities and 460 rural municipalities',
          'Elected councils govern local areas',
          'Autonomous delivery of basic services',
          'Local taxation and budget powers',
          'Community-focused development programs'
        ]
      }
    ],
    summary: [
      'Nepal adopted federal system through 2015 Constitution',
      'Three levels: federal, provincial, and local governments',
      'Seven provinces with their own governments and assemblies',
      '753 local governments provide basic services',
      'System promotes inclusive development and local autonomy'
    ]
  }
};