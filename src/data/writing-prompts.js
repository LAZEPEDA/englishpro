// ========================================
// EnglishPro — Writing Prompts
// ========================================

export const writingPrompts = [
    // A1
    {
        id: 'w-a1-01', level: 'A1', difficulty: -2.0, type: 'email',
        title: 'Introduce Yourself',
        prompt: 'Write a short email to a new friend. Tell them your name, age, where you live, and what you like to do in your free time.',
        wordRange: [30, 60], timeMinutes: 10
    },
    // A2
    {
        id: 'w-a2-01', level: 'A2', difficulty: -1.0, type: 'description',
        title: 'Describe Your Daily Routine',
        prompt: 'Write about your typical day. What time do you wake up? What do you do in the morning, afternoon, and evening? Include at least 5 different activities.',
        wordRange: [60, 100], timeMinutes: 15
    },
    // B1
    {
        id: 'w-b1-01', level: 'B1', difficulty: 0.0, type: 'email',
        title: 'Complaint Letter',
        prompt: 'Write a formal email to a hotel manager. You recently stayed at their hotel and had problems with your room (it was noisy, the air conditioning did not work, etc.). Explain the problems and say what you would like them to do about it.',
        wordRange: [120, 180], timeMinutes: 20
    },
    // B2
    {
        id: 'w-b2-01', level: 'B2', difficulty: 1.0, type: 'essay',
        title: 'Technology and Education',
        prompt: 'Some people believe that technology has improved education, while others think it has made students less focused. Discuss both views and give your own opinion. Use specific examples to support your arguments.',
        wordRange: [200, 280], timeMinutes: 30
    },
    // C1
    {
        id: 'w-c1-01', level: 'C1', difficulty: 1.8, type: 'report',
        title: 'Workplace Well-being Report',
        prompt: 'Write a report for your company\'s management team about employee well-being. Include an analysis of current issues (work-life balance, mental health, workplace culture), supported by data or examples, and propose at least three actionable recommendations.',
        wordRange: [280, 400], timeMinutes: 40
    },
    // C2
    {
        id: 'w-c2-01', level: 'C2', difficulty: 2.5, type: 'essay',
        title: 'The Ethics of Artificial Intelligence',
        prompt: 'Critically evaluate the ethical implications of deploying artificial intelligence in criminal justice systems. Consider issues such as algorithmic bias, accountability, transparency, and the potential erosion of human agency. Draw upon relevant philosophical frameworks and empirical evidence to support your analysis.',
        wordRange: [350, 500], timeMinutes: 45
    },
];

export function getWritingPromptByLevel(level) {
    return writingPrompts.find(p => p.level === level) || writingPrompts[2];
}

// ========================================
// Speaking Prompts
// ========================================

export const speakingPrompts = [
    // A1
    {
        id: 's-a1-01', level: 'A1', difficulty: -2.0,
        title: 'About You',
        prompt: 'Tell me about yourself. What is your name? Where are you from? What do you like?',
        prepTime: 15, responseTime: 45
    },
    // A2
    {
        id: 's-a2-01', level: 'A2', difficulty: -1.0,
        title: 'Your Favorite Place',
        prompt: 'Describe your favourite place (a park, cafe, beach, etc.). Where is it? What does it look like? Why do you like going there?',
        prepTime: 20, responseTime: 60
    },
    // B1
    {
        id: 's-b1-01', level: 'B1', difficulty: 0.0,
        title: 'A Memorable Experience',
        prompt: 'Talk about a memorable experience you had recently. What happened? How did you feel? What did you learn from it?',
        prepTime: 30, responseTime: 90
    },
    // B2
    {
        id: 's-b2-01', level: 'B2', difficulty: 1.0,
        title: 'Agree or Disagree',
        prompt: 'Some people think that social media brings people closer together, while others believe it creates division. What is your opinion? Give reasons and examples.',
        prepTime: 30, responseTime: 120
    },
    // C1
    {
        id: 's-c1-01', level: 'C1', difficulty: 1.8,
        title: 'Analyse a Trend',
        prompt: 'Remote work has become increasingly common. Discuss the advantages and disadvantages for both employees and employers. What do you think the future of work will look like?',
        prepTime: 45, responseTime: 150
    },
    // C2
    {
        id: 's-c2-01', level: 'C2', difficulty: 2.5,
        title: 'Critical Analysis',
        prompt: 'Some philosophers argue that the concept of free will is an illusion. To what extent do you agree? Discuss with reference to implications for moral responsibility and the justice system.',
        prepTime: 60, responseTime: 180
    },
];

export function getSpeakingPromptByLevel(level) {
    return speakingPrompts.find(p => p.level === level) || speakingPrompts[2];
}
