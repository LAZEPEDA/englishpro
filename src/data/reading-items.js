// ========================================
// EnglishPro — Reading Item Bank
// Calibrated items with Rasch difficulty (b) parameters
// ========================================

export const readingItems = [
    // ===== A1 Level (b: -2.5 to -1.5) =====
    {
        id: 'r-a1-01',
        level: 'A1',
        difficulty: -2.3,
        type: 'multiple-choice',
        passage: `My name is Sarah. I am 25 years old. I live in London with my cat, Milo. I work in a shop. I like coffee and chocolate. On Sundays, I go to the park.`,
        question: 'Where does Sarah live?',
        options: ['Paris', 'London', 'New York', 'Berlin'],
        correct: 1,
        skill: 'reading'
    },
    {
        id: 'r-a1-02',
        level: 'A1',
        difficulty: -2.1,
        type: 'multiple-choice',
        passage: `The restaurant is open from Monday to Saturday. It is closed on Sundays. Lunch is from 12:00 to 3:00. Dinner is from 6:00 to 10:00.`,
        question: 'When is the restaurant closed?',
        options: ['Monday', 'Saturday', 'Sunday', 'Friday'],
        correct: 2,
        skill: 'reading'
    },
    {
        id: 'r-a1-03',
        level: 'A1',
        difficulty: -1.8,
        type: 'cloze',
        passage: `Hello! My name ___ Tom. I ___ from Australia. I ___ English and French. I ___ in a hospital. I am a ___.`,
        blanks: [
            { position: 0, options: ['is', 'am', 'are'], correct: 0 },
            { position: 1, options: ['is', 'am', 'are'], correct: 1 },
            { position: 2, options: ['speak', 'speaks', 'speaking'], correct: 0 },
            { position: 3, options: ['work', 'works', 'working'], correct: 0 },
            { position: 4, options: ['teacher', 'doctor', 'student'], correct: 1 },
        ],
        skill: 'reading'
    },
    // ===== A2 Level (b: -1.5 to -0.5) =====
    {
        id: 'r-a2-01',
        level: 'A2',
        difficulty: -1.3,
        type: 'multiple-choice',
        passage: `Last weekend, Maria went to the beach with her friends. They arrived at 10 in the morning. The weather was sunny and warm. They swam in the sea, played volleyball, and had a picnic. Maria took many photos. They left at 5 in the afternoon because it started to rain.`,
        question: 'Why did they leave the beach?',
        options: ['It was late', 'They were tired', 'It began to rain', 'They were hungry'],
        correct: 2,
        skill: 'reading'
    },
    {
        id: 'r-a2-02',
        level: 'A2',
        difficulty: -1.0,
        type: 'matching',
        passage: `Read the descriptions and match each person with the correct hobby:\n\n1. Tom loves animals. He has three dogs and two cats at home.\n2. Lisa enjoys being creative. She paints pictures every weekend.\n3. James likes staying active. He runs 5 kilometers every morning.\n4. Anna is interested in food. She tries new recipes from different countries.`,
        items: ['Tom', 'Lisa', 'James', 'Anna'],
        matches: ['Pet keeping', 'Painting', 'Running', 'Cooking'],
        correctPairs: [0, 1, 2, 3],
        skill: 'reading'
    },
    {
        id: 'r-a2-03',
        level: 'A2',
        difficulty: -0.7,
        type: 'multiple-choice',
        passage: `Dear Mr. Roberts,\n\nI am writing to tell you about a problem with my new laptop. I bought it from your shop on Monday. When I try to turn it on, the screen stays black. I have tried charging it overnight, but it still doesn't work. Could you please help me? I would like to exchange it or get my money back.\n\nThank you,\nEmma Clarke`,
        question: 'What does Emma want?',
        options: ['To buy a new laptop', 'To repair the laptop herself', 'To exchange the laptop or get a refund', 'To thank Mr. Roberts'],
        correct: 2,
        skill: 'reading'
    },
    // ===== B1 Level (b: -0.5 to 0.5) =====
    {
        id: 'r-b1-01',
        level: 'B1',
        difficulty: -0.3,
        type: 'multiple-choice',
        passage: `Working from home has become increasingly popular in recent years. Many employees appreciate the flexibility it offers, such as avoiding long commutes and being able to manage their own schedules. However, some people find it difficult to stay focused without the structure of an office environment. Companies have had to adapt by introducing virtual meetings and online collaboration tools to keep teams connected.`,
        question: 'What is one challenge of working from home mentioned in the text?',
        options: ['The internet is too slow', 'It is hard to concentrate without office structure', 'Companies do not allow it', 'There are no virtual meetings'],
        correct: 1,
        skill: 'reading'
    },
    {
        id: 'r-b1-02',
        level: 'B1',
        difficulty: 0.0,
        type: 'multiple-choice',
        passage: `Sleep is essential for good health, yet millions of people around the world do not get enough of it. Research shows that adults need between seven and nine hours of sleep per night. Lack of sleep can lead to problems such as difficulty concentrating, a weakened immune system, and increased stress levels. Experts recommend establishing a regular bedtime routine and avoiding screens before bed to improve sleep quality.`,
        question: 'According to the text, what should people avoid before bed?',
        options: ['Drinking water', 'Reading books', 'Using screens', 'Exercising'],
        correct: 2,
        skill: 'reading'
    },
    {
        id: 'r-b1-03',
        level: 'B1',
        difficulty: 0.3,
        type: 'cloze',
        passage: `Learning a new language can be ___ but also very rewarding. Many people ___ that practicing every day, even for just 15 minutes, is more ___ than studying for long periods once a week. It is also important to ___ yourself to the language through films, music, and conversations. Making mistakes is a natural ___ of the learning process.`,
        blanks: [
            { position: 0, options: ['challenging', 'easy', 'boring'], correct: 0 },
            { position: 1, options: ['disagree', 'believe', 'forget'], correct: 1 },
            { position: 2, options: ['effective', 'difficult', 'expensive'], correct: 0 },
            { position: 3, options: ['remove', 'expose', 'hide'], correct: 1 },
            { position: 4, options: ['part', 'problem', 'rule'], correct: 0 },
        ],
        skill: 'reading'
    },
    // ===== B2 Level (b: 0.5 to 1.5) =====
    {
        id: 'r-b2-01',
        level: 'B2',
        difficulty: 0.7,
        type: 'multiple-choice',
        passage: `The concept of "fast fashion" refers to the rapid production of inexpensive clothing to meet the latest trends. While this model has made fashion more accessible, it has also been criticised for its environmental impact. The fashion industry is responsible for approximately 10% of global carbon emissions, and the average consumer now buys 60% more clothing than they did 15 years ago. Sustainable fashion advocates argue that consumers should invest in fewer, higher-quality garments and support brands that prioritise ethical manufacturing practices.`,
        question: 'What is the main criticism of fast fashion according to the text?',
        options: ['It is too expensive', 'It does not follow trends', 'It harms the environment', 'It produces low-quality clothes only'],
        correct: 2,
        skill: 'reading'
    },
    {
        id: 'r-b2-02',
        level: 'B2',
        difficulty: 1.0,
        type: 'multiple-choice',
        passage: `Artificial intelligence is transforming the way we live and work. From personalised recommendations on streaming platforms to autonomous vehicles, AI applications are becoming ubiquitous. However, the rise of AI has also raised significant ethical concerns. Critics point to issues such as algorithmic bias, where AI systems perpetuate existing inequalities, and the potential displacement of human workers. Proponents, on the other hand, argue that AI will create new types of jobs and enhance human capabilities rather than replace them. The debate highlights the need for robust regulations and transparent development practices.`,
        question: 'What do AI proponents believe?',
        options: ['AI will eliminate all jobs', 'AI should not be regulated', 'AI will create new opportunities and enhance human abilities', 'AI has no ethical concerns'],
        correct: 2,
        skill: 'reading'
    },
    {
        id: 'r-b2-03',
        level: 'B2',
        difficulty: 1.3,
        type: 'categorization',
        passage: `Read the following statements about energy sources and classify them as either "Renewable" or "Non-Renewable".`,
        categories: ['Renewable', 'Non-Renewable'],
        items: [
            { text: 'Solar panels convert sunlight into electricity.', correct: 0 },
            { text: 'Coal is burned in power stations to generate power.', correct: 1 },
            { text: 'Wind turbines harness kinetic energy from air currents.', correct: 0 },
            { text: 'Natural gas is extracted by drilling deep underground.', correct: 1 },
            { text: 'Hydroelectric dams use flowing water to produce energy.', correct: 0 },
            { text: 'Petroleum is refined into fuel for vehicles and industry.', correct: 1 },
        ],
        skill: 'reading'
    },
    // ===== C1 Level (b: 1.5 to 2.5) =====
    {
        id: 'r-c1-01',
        level: 'C1',
        difficulty: 1.7,
        type: 'multiple-choice',
        passage: `The relationship between language and thought has long been a subject of intense philosophical and linguistic debate. The Sapir-Whorf hypothesis, in its strong form, posits that the language we speak determines the way we perceive and conceptualise the world — a view known as linguistic determinism. While this extreme position has largely been discredited, a weaker version — linguistic relativity — maintains that language influences, though does not dictate, certain cognitive processes. Recent empirical studies have lent support to this nuanced view, demonstrating, for instance, that speakers of languages with distinct colour terminology perceive colour boundaries differently from those whose languages lack such distinctions.`,
        question: 'Which statement best reflects the current academic position on the Sapir-Whorf hypothesis?',
        options: [
            'Language completely determines thought, as the strong hypothesis claims.',
            'Language has no influence on thought whatsoever.',
            'A moderate version suggesting language influences but does not determine thought is the most supported.',
            'The hypothesis has been entirely abandoned by modern linguistics.'
        ],
        correct: 2,
        skill: 'reading'
    },
    {
        id: 'r-c1-02',
        level: 'C1',
        difficulty: 2.0,
        type: 'multiple-choice',
        passage: `The phenomenon of "urban heat islands" — whereby metropolitan areas experience significantly higher temperatures than their surrounding rural counterparts — has become a pressing concern in the context of climate change. This temperature differential, which can reach as high as 12°C during evening hours, is attributable to several factors: the prevalence of heat-absorbing materials such as asphalt and concrete, reduced vegetation cover, anthropogenic heat generation from vehicles and industrial processes, and altered wind patterns caused by tall buildings. Mitigation strategies include the implementation of green roofs, the expansion of urban tree canopy coverage, the adoption of reflective building materials, and the redesign of urban spaces to facilitate natural ventilation.`,
        question: 'What is NOT mentioned as a contributing factor to urban heat islands?',
        options: [
            'Dark, heat-absorbing construction materials',
            'Insufficient green spaces in cities',
            'Rising sea levels around coastal cities',
            'Heat produced by vehicles and industry'
        ],
        correct: 2,
        skill: 'reading'
    },
    // ===== C2 Level (b: 2.0 to 3.0) =====
    {
        id: 'r-c2-01',
        level: 'C2',
        difficulty: 2.5,
        type: 'multiple-choice',
        passage: `The epistemological underpinnings of post-structuralist thought challenge the very notion of objective knowledge. Derrida's concept of "différance" — a neologism that conflates the French words for "differing" and "deferring" — suggests that meaning is never fully present in language but is perpetually deferred through an infinite chain of signifiers. This radical indeterminacy of meaning has profound implications for literary criticism, philosophy, and the social sciences, as it undermines the possibility of arriving at definitive interpretations or universal truths. Critics of post-structuralism, however, contend that such thoroughgoing relativism is self-defeating, arguing that the assertion "there is no objective truth" is itself a claim to objective truth. This paradox remains at the heart of contemporary debates in epistemology and the philosophy of language.`,
        question: 'What paradox do critics identify in post-structuralist theory?',
        options: [
            'That language changes too slowly to study effectively.',
            'That denying objective truth is itself a truth claim, making the position self-referentially inconsistent.',
            'That Derrida never published his most important work.',
            'That literary criticism is impossible without structuralism.'
        ],
        correct: 1,
        skill: 'reading'
    },
    {
        id: 'r-c2-02',
        level: 'C2',
        difficulty: 2.8,
        type: 'multiple-choice',
        passage: `The emergence of quantum computing represents a paradigmatic shift in computational theory that transcends the limitations inherent in classical Turing machines. Whereas conventional computers manipulate binary bits — discrete units existing in states of either 0 or 1 — quantum computers exploit the principles of superposition and entanglement to operate on quantum bits, or qubits, which can exist in a probabilistic combination of both states simultaneously. This exponential scaling of information processing capacity has the potential to render certain classes of currently intractable problems — such as integer factorisation of large semiprimes, the simulation of complex molecular interactions, and the optimisation of vast combinatorial spaces — computationally feasible. Nevertheless, formidable engineering challenges remain, including the maintenance of quantum coherence at scale and the development of fault-tolerant error correction protocols.`,
        question: 'According to the passage, what distinguishes qubits from classical bits?',
        options: [
            'Qubits are larger and require more storage space.',
            'Qubits can exist in a probabilistic superposition of 0 and 1 simultaneously.',
            'Qubits are slower but more reliable than classical bits.',
            'Qubits only function at room temperature.'
        ],
        correct: 1,
        skill: 'reading'
    },
];

// Filter items by level or difficulty range
export function getItemsByLevel(level) {
    return readingItems.filter(item => item.level === level);
}

export function getItemsByDifficultyRange(min, max) {
    return readingItems.filter(item => item.difficulty >= min && item.difficulty <= max);
}

export function getItemsForStage(module) {
    const ranges = {
        'Pre-A1': [-3.5, -2.5],
        'A1': [-2.5, -1.5],
        'A2': [-1.5, -0.5],
        'B1': [-0.5, 0.5],
        'B1-low': [-0.5, 0.0],
        'B1-high': [0.0, 0.5],
        'B2': [0.5, 1.5],
        'B2-low': [0.5, 1.0],
        'B2-high': [1.0, 1.5],
        'C1': [1.5, 2.5],
        'C2': [2.0, 3.5],
    };
    const [min, max] = ranges[module] || [-0.5, 0.5];
    return getItemsByDifficultyRange(min, max);
}
