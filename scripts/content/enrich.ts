import { promises as fs } from 'fs';
import path from 'path';
import {
  ContentManifestSchema,
  LessonContentSchema,
  QuizContentSchema,
  type ContentManifest,
  type LessonContent,
  type QuizContent,
} from '../../shared/contentSchemas.js';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content');

async function readJSON<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

async function writeJSON(filePath: string, data: unknown) {
  const out = JSON.stringify(data, null, 2) + '\n';
  await fs.writeFile(filePath, out, 'utf-8');
}

function ensureLessonEnrichment(lesson: LessonContent): LessonContent {
  const existingIds = new Set(lesson.sections.map((s) => s.id));
  const title = lesson.title;

  const additions = [
    {
      id: 'key-terms-glossary',
      title: 'Key Terms and Definitions',
      content:
        `This section clarifies important terms frequently used in "${title}" to make core ideas easier to remember and apply.`,
      keyPoints: [
        'Plain-language definitions of core concepts',
        'Examples that illustrate usage',
        'Contrast with commonly confused terms',
        'Memory aids for quick recall',
      ],
    },
    {
      id: 'case-study-application',
      title: 'Case Study: Applying Concepts',
      content:
        `A practical scenario demonstrates how principles from "${title}" operate in real life. Consider a local authority decision challenged for compliance with constitutional norms. Analyze actors involved, legal basis, and remedy pathways to understand implementation dynamics.`,
      keyPoints: [
        'Translate concepts into real-world steps',
        'Identify actors, mandates, and processes',
        'Assess remedies and accountability routes',
        'Reflect on lessons for future decisions',
      ],
    },
    {
      id: 'implementation-gaps',
      title: 'Implementation Gaps and Challenges',
      content:
        `Even with strong legal and policy frameworks, realizing "${title}" can face capacity, coordination, and resource constraints. Data quality and awareness gaps may slow progress and produce uneven outcomes across regions.`,
      keyPoints: [
        'Capacity and resource constraints',
        'Inter-agency coordination needs',
        'Data and monitoring limitations',
        'Awareness and access disparities',
      ],
    },
    {
      id: 'future-outlook',
      title: 'Future Outlook',
      content:
        `Next steps for "${title}" emphasize better evidence use, digital tools, stronger participation, and periodic progress reviews to translate commitments into measurable outcomes.`,
      keyPoints: [
        'Evidence-informed decision-making',
        'Digital enablement and access',
        'Inclusive participation mechanisms',
        'Transparent progress reporting',
      ],
    },
    {
      id: 'quick-recap',
      title: 'Quick Recap and Reflection',
      content:
        `Use this recap to check your understanding of "${title}". Try to explain each key point in your own words and note any questions for later review.`,
      keyPoints: [
        'Restate concepts briefly from memory',
        'List two practical implications',
        'Identify one area needing deeper study',
        'Plan one action to apply the lesson',
      ],
    },
  ];

  // Add sections that aren't present yet
  for (const sec of additions) {
    if (!existingIds.has(sec.id)) {
      lesson.sections.push(sec);
    }
  }

  // Ensure summary includes a future-looking point
  const futurePoint = 'Future focus on evidence, digital tools, and participation';
  if (!lesson.summary.includes(futurePoint)) {
    lesson.summary.push(futurePoint);
  }

  // Add a small glossary if not present
  if (!lesson.glossary) {
    const baseGlossary: { term: string; definition: string }[] = [];
    const id = lesson.id;
    const push = (term: string, definition: string) => baseGlossary.push({ term, definition });

    if (id.includes('fundamental-rights')) {
      push('Fundamental Rights', 'Basic rights guaranteed by the Constitution enforceable through courts.');
      push('Proportionality', 'A legal test ensuring limitations on rights are necessary and minimally impairing.');
      push('Habeas Corpus', 'A writ requiring a detained person be brought before a court.');
    } else if (id.includes('government-structure')) {
      push('Separation of Powers', 'Division of state authority among executive, legislative, and judicial branches.');
      push('Checks and Balances', 'Mutual oversight mechanisms preventing concentration of power.');
      push('Judicial Review', 'Court power to invalidate unconstitutional acts.');
    } else if (id.includes('federal-system')) {
      push('Federalism', 'System dividing powers among federal, provincial, and local governments.');
      push('Concurrent Powers', 'Powers shared by more than one level of government.');
      push('Intergovernmental Transfers', 'Fiscal resources shared across levels of government.');
    } else if (id.includes('local-government')) {
      push('Municipality', 'Urban local government unit with elected council and executive.');
      push('Social Audit', 'Public review mechanism for programs and spending.');
      push('Ward Committee', 'Local sub-unit committee for participation and service coordination.');
    } else if (id.includes('parliamentary-procedures')) {
      push('First Reading', 'Stage introducing a bill to Parliament.');
      push('Committee Stage', 'Detailed examination and amendment consideration phase.');
      push('Question Hour', 'Parliamentary time for members to question ministers.');
    } else if (id.includes('financial-procedures')) {
      push('Appropriation', 'Authorization for government expenditure.');
      push('Audit', 'Independent examination of financial records.');
      push('Equalization Grants', 'Transfers to balance resources among jurisdictions.');
    } else if (id.includes('judiciary')) {
      push('Original Jurisdiction', 'Authority of a court to hear a case first.');
      push('Appellate Jurisdiction', 'Authority to hear appeals from lower courts.');
      push('Precedent', 'Legal principle established in previous cases.');
    } else if (id.includes('right-to-information')) {
      push('RTI', 'Right to request and receive information of public importance.');
      push('Information Officer', 'Designated official to handle information requests.');
      push('Proactive Disclosure', 'Publishing information without a specific request.');
    } else if (id.includes('labor-rights')) {
      push('Collective Bargaining', 'Negotiation between employers and workers’ representatives.');
      push('Occupational Safety', 'Standards ensuring safe working conditions.');
      push('Social Security', 'System providing health, accident, and retirement benefits.');
    } else if (id.includes('property-rights')) {
      push('Eminent Domain', 'State acquisition of private property for public use with compensation.');
      push('Tenure', 'Legal right to hold property.');
      push('Encumbrance', 'Claim or liability on a property.');
    } else if (id.includes('media-press-freedom')) {
      push('Censorship', 'Suppression of speech or information.');
      push('Source Protection', 'Right of journalists to keep sources confidential.');
      push('Prior Restraint', 'Government action preventing publication.');
    } else if (id.includes('language-cultural-rights')) {
      push('Mother Tongue Education', 'Right to receive basic education in one’s native language.');
      push('Cultural Heritage', 'Inherited traditions and artifacts of a community.');
      push('Language Commission', 'Advisory body on language policies and preservation.');
    } else if (id.includes('citizenship')) {
      push('Naturalization', 'Granting citizenship to a non-citizen upon meeting conditions.');
      push('Descent', 'Citizenship acquired through parents.');
      push('Statelessness', 'Condition of not being recognized as a citizen by any state.');
    } else if (id.includes('constitutional-amendments')) {
      push('Two-Thirds Majority', 'Parliamentary threshold required to pass constitutional amendments.');
      push('Entrenchment', 'Protection of core constitutional provisions.');
      push('Provincial Consent', 'Approval needed from provinces for certain amendments.');
    } else if (id.includes('emergency-powers')) {
      push('State of Emergency', 'Legal regime allowing extraordinary measures during crises.');
      push('Habeas Corpus', 'Judicial safeguard against unlawful detention.');
      push('Sunset Clause', 'Automatic expiry of measures unless renewed.');
    } else if (id.includes('public-service-commission')) {
      push('Merit-based Recruitment', 'Selection of candidates based on qualifications and exam performance.');
      push('Competitive Examination', 'Testing method to evaluate candidate suitability.');
      push('Binding Recommendation', 'Decisions within PSC jurisdiction must be followed.');
    } else if (id.includes('directive-principles')) {
      push('Directive Principles', 'Guidelines for governance not directly enforceable in court.');
      push('State Policies', 'Specific policy directions laid out by the Constitution.');
      push('Obligations of the State', 'Duty to apply principles and report progress.');
    } else if (id.includes('constitutional-bodies')) {
      push('CIAA', 'Commission for Investigation of Abuse of Authority (anti-corruption).');
      push('Oversight', 'Monitoring and accountability over public institutions.');
      push('Independence', 'Autonomy from executive control.');
    }

    if (baseGlossary.length) {
      lesson.glossary = baseGlossary;
    }
  }

  return lesson;
}

function nextQuestionId(existing: QuizContent['questions']): string {
  // Prefer numeric incremental ids if the set is numeric; otherwise use prefixed ids
  const numeric = existing
    .map((q) => q.id)
    .filter((id) => /^\d+$/.test(id))
    .map((id) => parseInt(id, 10));
  if (numeric.length === existing.length && numeric.length > 0) {
    const max = Math.max(...numeric);
    return String(max + 1);
  }
  // fallback: ensure uniqueness with auto-N
  let n = 1;
  const taken = new Set(existing.map((q) => q.id));
  while (taken.has(`auto-${n}`)) n++;
  return `auto-${n}`;
}

function ensureQuizEnrichment(quiz: QuizContent): QuizContent {
  // Add up to 3 generic pedagogy-aligned questions that reinforce engagement and comprehension
  const additions = [] as QuizContent['questions'];

  // Q: Multiple-select about effective understanding components
  additions.push({
    id: 'PENDING',
    question: `Select all components that deepen understanding of ${quiz.title}.`,
    type: 'multiple-select',
    options: [
      'Clear definitions and key terms',
      'Legal/institutional frameworks where applicable',
      'Irrelevant myths unrelated to the topic',
      'Practical examples or case studies',
    ],
    correctAnswer: [0, 1, 3],
    explanation:
      'Core concepts, applicable frameworks, and practical examples build robust understanding; unrelated myths do not.',
    difficulty: 'medium',
    points: 15,
  });

  // Q: True/False about value of case studies
  additions.push({
    id: 'PENDING',
    question: 'Case studies help apply abstract concepts to real situations.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation:
      'Applying concepts in realistic contexts strengthens comprehension and recall.',
    difficulty: 'easy',
    points: 10,
  });

  // Q: Multiple-choice about effective study strategy
  additions.push({
    id: 'PENDING',
    question: 'Which study approach most improves retention of key ideas?',
    type: 'multiple-choice',
    options: [
      'Passive re-reading only',
      'Active recall with practice questions',
      'Ignoring difficult sections',
      'Cramming without breaks',
    ],
    correctAnswer: 1,
    explanation:
      'Active recall and practice yield better retention than passive reading or cramming.',
    difficulty: 'medium',
    points: 15,
  });

  // Q: Multiple-choice about connecting lesson to real-world governance/civic context
  additions.push({
    id: 'PENDING',
    question: `What is a practical way to connect ${quiz.title} to real-world decisions?`,
    type: 'multiple-choice',
    options: [
      'Avoid examples to stay abstract',
      'Relate concepts to local news or policies',
      'Memorize without context',
      'Focus only on unrelated trivia',
    ],
    correctAnswer: 1,
    explanation:
      'Linking concepts to current events and local policies improves understanding and relevance.',
    difficulty: 'easy',
    points: 10,
  });

  // Q: Multiple-select about effective evaluation of claims
  additions.push({
    id: 'PENDING',
    question: 'Select good strategies to evaluate claims about this topic.',
    type: 'multiple-select',
    options: [
      'Check primary legal/policy sources',
      'Consider institutional mandates',
      'Rely solely on anonymous social posts',
      'Look for credible data and context',
    ],
    correctAnswer: [0, 1, 3],
    explanation:
      'Verifying against primary sources, mandates, and credible data yields more reliable conclusions.',
    difficulty: 'hard',
    points: 20,
  });

  // Append new questions with safe unique ids, but avoid duplicates if similar question already exists (rudimentary text match)
  const existingQ = new Set(quiz.questions.map((q) => q.question.trim().toLowerCase()));
  for (const q of additions) {
    if (existingQ.has(q.question.trim().toLowerCase())) continue;
    const id = nextQuestionId(quiz.questions);
    quiz.questions.push({ ...q, id });
  }

  // Topic-specific additions (3 each) keyed by quiz id fragment
  const id = quiz.id;
  const addIfNew = (q: QuizContent['questions'][number]) => {
    if (!existingQ.has(q.question.trim().toLowerCase())) {
      const id = nextQuestionId(quiz.questions);
      quiz.questions.push({ ...q, id });
      existingQ.add(q.question.trim().toLowerCase());
    }
  };

  if (id.includes('government-structure')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which house of Parliament primarily represents provinces and special groups?',
      type: 'multiple-choice',
      options: ['House of Representatives', 'National Assembly', 'Constitutional Council', 'Judicial Council'],
      correctAnswer: 1,
      explanation: 'The National Assembly (Upper House) represents provinces and special groups.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select instruments that exemplify judicial checks on the executive.',
      type: 'multiple-select',
      options: ['Writ jurisdiction', 'Appropriation bill', 'Judicial review', 'Committee inquiry'],
      correctAnswer: [0, 2],
      explanation: 'Courts use writ jurisdiction and judicial review; appropriations and committee inquiries are legislative.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: The President exercises executive powers independently in day-to-day administration.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'Day-to-day executive authority rests with the Prime Minister and Council of Ministers.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('fundamental-rights')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which article prohibits untouchability and caste-based discrimination?',
      type: 'multiple-choice',
      options: ['Article 16', 'Article 17', 'Article 18', 'Article 31'],
      correctAnswer: 2,
      explanation: 'Article 18 (Right to Equality) prohibits untouchability and caste-based discrimination.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Which writ compels a public authority to perform a legal duty?',
      type: 'multiple-choice',
      options: ['Habeas corpus', 'Mandamus', 'Certiorari', 'Prohibition'],
      correctAnswer: 1,
      explanation: 'Mandamus directs a public authority to perform a required duty.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Economic and social rights are typically realized progressively.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'These rights depend on resource availability and are implemented over time.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('federal-system')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which functions are exclusive to the federal level?',
      type: 'multiple-select',
      options: ['Foreign policy', 'National defense', 'Primary education delivery', 'Currency issuance'],
      correctAnswer: [0, 1, 3],
      explanation: 'Foreign policy, defense, and currency are federal responsibilities.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'The mixed electoral system combines which two models?',
      type: 'multiple-choice',
      options: ['STV and RCV', 'FPTP and PR', 'MMP and AV', 'Block and Limited'],
      correctAnswer: 1,
      explanation: 'Nepal uses First-Past-the-Post and Proportional Representation.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: All levels of government in Nepal have equal powers.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 1,
      explanation: 'Powers are distinct and coordinated, not equal across levels.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('labor-rights')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which practices are explicitly prohibited under labor rights provisions?',
      type: 'multiple-select',
      options: ['Forced labor', 'Child labor', 'Collective bargaining', 'Safety inspections'],
      correctAnswer: [0, 1],
      explanation: 'Forced and child labor are prohibited; collective bargaining and inspections are part of rights/enforcement.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Social security can include health, accident, and retirement benefits.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Nepal’s social security framework typically includes health, accident, and retirement benefits.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Which bodies primarily enforce labor rights disputes?',
      type: 'multiple-choice',
      options: ['Parliamentary committees', 'Labor offices and tribunals', 'Election Commission', 'Press Council'],
      correctAnswer: 1,
      explanation: 'Labor offices and tribunals handle enforcement and dispute resolution.',
      difficulty: 'medium',
      points: 15,
    });
  } else if (id.includes('right-to-information')) {
    addIfNew({
      id: 'PENDING',
      question: 'Select obligations of public bodies under RTI.',
      type: 'multiple-select',
      options: ['Appoint Information Officers', 'Maintain records', 'Proactively disclose certain info', 'Delete requests after 24 hours'],
      correctAnswer: [0, 1, 2],
      explanation: 'They must appoint officers, maintain records, and proactively disclose specific information.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Which body oversees RTI implementation?',
      type: 'multiple-choice',
      options: ['Supreme Court', 'National Information Commission', 'Audit Office', 'Public Service Commission'],
      correctAnswer: 1,
      explanation: 'The National Information Commission oversees implementation and compliance.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'RTI exemptions are typically justified by:',
      type: 'multiple-choice',
      options: ['Public interest tests and guidelines', 'Discretion without criteria', 'Budget availability', 'Media opinion'],
      correctAnswer: 0,
      explanation: 'Exemptions rely on public interest tests and clear guidelines.',
      difficulty: 'hard',
      points: 20,
    });
  } else if (id.includes('property-rights')) {
    addIfNew({
      id: 'PENDING',
      question: 'Property can be acquired for public purpose provided that:',
      type: 'multiple-choice',
      options: ['No compensation is needed', 'Fair compensation is provided', 'Only foreign property is targeted', 'Courts are not involved'],
      correctAnswer: 1,
      explanation: 'Acquisition requires fair compensation to the owner.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select reasonable restrictions that may be imposed on property rights.',
      type: 'multiple-select',
      options: ['Land ceilings', 'Environmental protections', 'Arbitrary seizures without cause', 'Urban planning rules'],
      correctAnswer: [0, 1, 3],
      explanation: 'Reasonable restrictions include ceilings, environmental rules, and planning; arbitrary seizures are not allowed.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Inheritance rights are equal regardless of gender.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'The Constitution guarantees equal inheritance rights regardless of gender.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('media-press-freedom')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which protections support press freedom?',
      type: 'multiple-select',
      options: ['Protection from censorship', 'Ban on content-based registration cancellation', 'Mandatory source disclosure', 'Equipment seizure without court order'],
      correctAnswer: [0, 1],
      explanation: 'Constitution protects against censorship and content-based cancellation; source protection is also recognized.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Digital media platforms are covered by press freedom protections.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Digital and online media are protected under press freedom provisions.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Which body oversees ethical standards in media?',
      type: 'multiple-choice',
      options: ['Supreme Court', 'Press Council Nepal', 'Election Commission', 'Auditor General'],
      correctAnswer: 1,
      explanation: 'Press Council Nepal oversees ethical standards.',
      difficulty: 'medium',
      points: 15,
    });
  } else if (id.includes('language-cultural-rights')) {
    addIfNew({
      id: 'PENDING',
      question: 'All languages spoken in Nepal are recognized as:',
      type: 'multiple-choice',
      options: ['Official state languages', 'National languages', 'Local dialects only', 'Unofficial categories'],
      correctAnswer: 1,
      explanation: 'They are recognized as national languages.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select correct statements about language policy.',
      type: 'multiple-select',
      options: ['Right to basic education in mother tongue', 'Only federal government decides regional languages', 'Language Commission advises on policy', 'Local/provincial governments may determine additional official languages'],
      correctAnswer: [0, 2, 3],
      explanation: 'Mother tongue education is a right; Language Commission advises; local/prov can set additional official languages.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Resource limitations can challenge implementation of language and cultural rights.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Resource and standardization constraints are common challenges.',
      difficulty: 'medium',
      points: 15,
    });
  } else if (id.includes('financial-procedures')) {
    addIfNew({
      id: 'PENDING',
      question: 'Who presents the annual budget?',
      type: 'multiple-choice',
      options: ['Prime Minister', 'Finance Minister', 'President', 'Revenue Secretary'],
      correctAnswer: 1,
      explanation: 'Finance Minister presents the budget to Parliament.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Key expenditure control mechanisms include:',
      type: 'multiple-select',
      options: ['Pre-audit checks', 'Treasury management', 'Citizen veto by petition', 'Parliamentary oversight of audits'],
      correctAnswer: [0, 1, 3],
      explanation: 'Pre-audits, treasury controls, and parliamentary review are central.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Which body conducts annual audits of government accounts?',
      type: 'multiple-choice',
      options: ['National Information Commission', 'Office of the Auditor General', 'Public Service Commission', 'Press Council'],
      correctAnswer: 1,
      explanation: 'Auditor General conducts annual audits.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('parliamentary-procedures')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which is the first stage in the legislative process?',
      type: 'multiple-choice',
      options: ['Committee stage', 'Bill introduction', 'Final reading', 'Presidential assent'],
      correctAnswer: 1,
      explanation: 'The legislative process starts with introduction of the bill.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select functions of parliamentary committees.',
      type: 'multiple-select',
      options: ['Investigations', 'Bill scrutiny', 'Executive appointments', 'Recommendations to Parliament'],
      correctAnswer: [0, 1, 3],
      explanation: 'Committees investigate, scrutinize, and recommend; they do not appoint the executive.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: The Speaker maintains order during sessions.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'The Speaker ensures adherence to rules and order.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('judiciary')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which is Nepal’s highest court?',
      type: 'multiple-choice',
      options: ['High Court', 'Supreme Court', 'District Court', 'Special Tribunal'],
      correctAnswer: 1,
      explanation: 'The Supreme Court is the apex court and final interpreter of the Constitution.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select judicial authorities relating to jurisdiction.',
      type: 'multiple-select',
      options: ['Original jurisdiction', 'Appellate jurisdiction', 'Fiscal jurisdiction', 'Advisory referendum'],
      correctAnswer: [0, 1],
      explanation: 'Courts exercise original and appellate jurisdiction; fiscal/advisory referendum are not standard judicial jurisdictions.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Special courts support expertise in specific case types.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Specialized courts/tribunals handle specific matters like labor or administrative cases.',
      difficulty: 'medium',
      points: 15,
    });
  } else if (id.includes('public-service')) {
    addIfNew({
      id: 'PENDING',
      question: 'Who appoints PSC members?',
      type: 'multiple-choice',
      options: ['Prime Minister', 'President on Constitutional Council recommendation', 'Chief Justice', 'Parliament by majority vote'],
      correctAnswer: 1,
      explanation: 'Appointment is by the President on recommendation of the Constitutional Council.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select PSC functions.',
      type: 'multiple-select',
      options: ['Conduct exams', 'Recruit civil servants directly without exams', 'Advise on personnel policy', 'Binding recommendations within jurisdiction'],
      correctAnswer: [0, 2, 3],
      explanation: 'PSC conducts exams, advises policy, and issues binding recommendations in its domain.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: PSC terms are six years.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'PSC members serve six-year terms.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('constitutional-amendments')) {
    addIfNew({
      id: 'PENDING',
      question: 'What majority is required for a constitutional amendment?',
      type: 'multiple-choice',
      options: ['Simple majority', 'Two-thirds majority', 'Three-fourths majority', 'Unanimous'],
      correctAnswer: 1,
      explanation: 'Two-thirds majority in Parliament is required.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select statements about amendment procedures in a federal system.',
      type: 'multiple-select',
      options: ['Some changes need provincial approval', 'No public consultation is allowed', 'Protected features have special safeguards', 'President unilaterally amends the Constitution'],
      correctAnswer: [0, 2],
      explanation: 'Changes affecting provinces may need their approval; core features are protected; no unilateral presidential amendments.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Amendments often follow extensive debate and scrutiny.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Debate and scrutiny are key parts of the amendment process.',
      difficulty: 'medium',
      points: 15,
    });
  } else if (id.includes('emergency-powers')) {
    addIfNew({
      id: 'PENDING',
      question: 'Who declares a state of emergency and on whose recommendation?',
      type: 'multiple-choice',
      options: ['Prime Minister alone', 'President on Council of Ministers recommendation', 'Parliament Speaker', 'Chief Justice'],
      correctAnswer: 1,
      explanation: 'The President declares on recommendation of the Council of Ministers.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select rights that cannot be suspended even during emergencies.',
      type: 'multiple-select',
      options: ['Right to life', 'Habeas corpus', 'Right to vote', 'Protection against torture'],
      correctAnswer: [0, 1, 3],
      explanation: 'Core rights like life, habeas corpus, and protection against torture are preserved.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Parliament must approve an emergency within 30 days.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Parliamentary approval is required within 30 days.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('citizenship')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which are recognized paths to citizenship?',
      type: 'multiple-select',
      options: ['Descent', 'Birth', 'Naturalization', 'Auction'],
      correctAnswer: [0, 1, 2],
      explanation: 'Descent, birth, and naturalization are valid paths; auction is not.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Which right is specifically reserved for citizens?',
      type: 'multiple-choice',
      options: ['Right to fair trial', 'Right to vote', 'Right to life', 'Freedom from torture'],
      correctAnswer: 1,
      explanation: 'Voting is reserved for citizens.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Statelessness is a challenge in Nepal’s citizenship system.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Statelessness affects certain populations and is a policy challenge.',
      difficulty: 'medium',
      points: 15,
    });
  } else if (id.includes('political-parties')) {
    addIfNew({
      id: 'PENDING',
      question: 'Select correct statements about political party regulation.',
      type: 'multiple-select',
      options: ['Inclusive representation in committees', 'Transparent financial reporting', 'Foreign government donations allowed', 'Regular internal elections'],
      correctAnswer: [0, 1, 3],
      explanation: 'Inclusive representation, transparency, and internal elections are required; foreign government donations are prohibited.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'How many HoR seats are FPTP seats?',
      type: 'multiple-choice',
      options: ['145', '155', '165', '175'],
      correctAnswer: 2,
      explanation: '165 members are elected via FPTP.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: The Election Commission registers and regulates parties.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'The EC handles party registration and regulation with codes of conduct.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('local-government')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which services commonly fall under local governments?',
      type: 'multiple-select',
      options: ['Waste and water', 'Primary healthcare', 'Foreign policy', 'Local infrastructure'],
      correctAnswer: [0, 1, 3],
      explanation: 'Local governments manage frontline services; foreign policy is federal.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Which committee handles minor disputes at local level?',
      type: 'multiple-choice',
      options: ['Executive Committee', 'Judicial Committee', 'Planning Committee', 'Audit Committee'],
      correctAnswer: 1,
      explanation: 'Judicial Committees address minor disputes at local level.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Participatory planning can improve budget alignment.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Participation improves alignment to local needs.',
      difficulty: 'easy',
      points: 10,
    });
  } else if (id.includes('constitutional-bodies')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which body investigates public office corruption?',
      type: 'multiple-choice',
      options: ['NHRC', 'CIAA', 'PSC', 'EC'],
      correctAnswer: 1,
      explanation: 'The CIAA investigates abuse of authority and corruption.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select statements about constitutional bodies.',
      type: 'multiple-select',
      options: ['They are independent', 'They report to Federal Parliament', 'They operate under executive control', 'They ensure oversight and governance'],
      correctAnswer: [0, 1, 3],
      explanation: 'They are independent, report to Parliament, and strengthen oversight and governance.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: NHRC may inspect detention facilities.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'NHRC can visit and inspect detention facilities.',
      difficulty: 'hard',
      points: 20,
    });
  } else if (id.includes('directive-principles')) {
    addIfNew({
      id: 'PENDING',
      question: 'Directive Principles, Policies and Obligations are in which Part?',
      type: 'multiple-choice',
      options: ['Part 2', 'Part 3', 'Part 4', 'Part 5'],
      correctAnswer: 2,
      explanation: 'They are in Part 4 of the Constitution (Articles 50–55).',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Select accurate statements about Directive Principles.',
      type: 'multiple-select',
      options: ['Guide laws and policies', 'Directly enforceable in courts', 'State must report progress', 'Promote inclusive and sustainable development'],
      correctAnswer: [0, 2, 3],
      explanation: 'They guide policy, require reporting, and promote inclusive/sustainable goals; they are not directly enforceable.',
      difficulty: 'hard',
      points: 20,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Biodiversity protection and climate mitigation are included in State Policies.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Environmental protection is noted in State Policies.',
      difficulty: 'medium',
      points: 15,
    });
  } else if (id.includes('fundamental-duties')) {
    addIfNew({
      id: 'PENDING',
      question: 'Which of the following are Fundamental Duties?',
      type: 'multiple-select',
      options: ['Obey the law', 'Participate in democratic processes', 'Exploit natural resources recklessly', 'Promote social harmony'],
      correctAnswer: [0, 1, 3],
      explanation: 'Duties include obeying law, engaging democratically, and promoting harmony; reckless exploitation is contrary to duties.',
      difficulty: 'medium',
      points: 15,
    });
    addIfNew({
      id: 'PENDING',
      question: 'True or False: Protecting forests, rivers, and biodiversity is part of environmental responsibilities.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Environmental protection is a core duty.',
      difficulty: 'easy',
      points: 10,
    });
    addIfNew({
      id: 'PENDING',
      question: 'Which area relates to culture and knowledge duties?',
      type: 'multiple-choice',
      options: ['Ignoring education', 'Promoting education and research', 'Destroying heritage', 'Censorship of language'],
      correctAnswer: 1,
      explanation: 'Duties include promoting education, research, and cultural preservation.',
      difficulty: 'hard',
      points: 20,
    });
  }

  return quiz;
}

async function main() {
  const manifestPath = path.join(CONTENT_ROOT, 'manifest.json');
  const manifestRaw = await readJSON<any>(manifestPath);
  const manifest = ContentManifestSchema.parse(manifestRaw) as ContentManifest;

  // Process lessons
  let lessonsUpdated = 0;
  for (const l of manifest.lessons) {
    const filePath = path.join(CONTENT_ROOT, l.file);
    const json = await readJSON<any>(filePath);
    const parsed = LessonContentSchema.parse(json);
    const enriched = ensureLessonEnrichment({ ...parsed, sections: [...parsed.sections], summary: [...parsed.summary] });
    const changed = JSON.stringify(parsed) !== JSON.stringify(enriched);
    if (changed) {
      await writeJSON(filePath, enriched);
      lessonsUpdated++;
    }
  }

  // Process quizzes
  let quizzesUpdated = 0;
  for (const q of manifest.quizzes) {
    const filePath = path.join(CONTENT_ROOT, q.file);
    const json = await readJSON<any>(filePath);
    const parsed = QuizContentSchema.parse(json);
    const enriched = ensureQuizEnrichment({ ...parsed, questions: [...parsed.questions] });
    const changed = JSON.stringify(parsed) !== JSON.stringify(enriched);
    if (changed) {
      await writeJSON(filePath, enriched);
      quizzesUpdated++;
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    `Enrichment complete. Lessons updated: ${lessonsUpdated}, Quizzes updated: ${quizzesUpdated}`
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Enrichment failed:', err);
  process.exit(1);
});
