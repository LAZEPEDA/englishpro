// ========================================
// EnglishPro — Listening Item Bank
// Uses Web Speech Synthesis for audio generation
// ========================================

export const listeningItems = [
    // ===== A1 Level =====
    {
        id: 'l-a1-01',
        level: 'A1',
        difficulty: -2.2,
        type: 'multiple-choice',
        transcript: "Hello. My name is John. I'm a teacher. I live in New York. I have two children. I like reading books.",
        voice: 'en-US',
        rate: 0.8,
        question: 'What is John\'s job?',
        options: ['Doctor', 'Teacher', 'Engineer', 'Driver'],
        correct: 1,
        skill: 'listening'
    },
    {
        id: 'l-a1-02',
        level: 'A1',
        difficulty: -1.9,
        type: 'multiple-choice',
        transcript: "Excuse me, where is the train station? Go straight ahead and turn left at the traffic lights. The station is on the right. Thank you very much.",
        voice: 'en-GB',
        rate: 0.8,
        question: 'Where should the person turn?',
        options: ['Right at the traffic lights', 'Left at the traffic lights', 'Right at the station', 'Left at the corner'],
        correct: 1,
        skill: 'listening'
    },
    // ===== A2 Level =====
    {
        id: 'l-a2-01',
        level: 'A2',
        difficulty: -1.2,
        type: 'multiple-choice',
        transcript: "Good morning. Welcome to the City Museum. We're open every day from nine in the morning to five in the afternoon. Tickets are eight pounds for adults and four pounds for children under twelve. We have a special exhibition about ancient Egypt this month. It's on the second floor. Enjoy your visit!",
        voice: 'en-GB',
        rate: 0.85,
        question: 'How much does a child\'s ticket cost?',
        options: ['Eight pounds', 'Four pounds', 'Twelve pounds', 'Five pounds'],
        correct: 1,
        skill: 'listening'
    },
    {
        id: 'l-a2-02',
        level: 'A2',
        difficulty: -0.8,
        type: 'multiple-choice',
        transcript: "I went shopping yesterday. First, I went to the supermarket and bought some bread, milk, and fruit. Then I went to the clothes shop because I needed a new jacket for winter. I tried on three jackets but only liked the blue one. It was a bit expensive, thirty-five euros, but it was very warm.",
        voice: 'en-US',
        rate: 0.85,
        question: 'How much was the jacket?',
        options: ['Twenty-five euros', 'Thirty euros', 'Thirty-five euros', 'Forty-five euros'],
        correct: 2,
        skill: 'listening'
    },
    // ===== B1 Level =====
    {
        id: 'l-b1-01',
        level: 'B1',
        difficulty: -0.2,
        type: 'multiple-choice',
        transcript: "Today I'd like to talk about the benefits of regular exercise. Research has shown that people who exercise at least three times a week have lower stress levels and better concentration. You don't need to join an expensive gym. Simple activities like walking, cycling, or even gardening can make a significant difference. The key is consistency. Even twenty minutes a day can improve your physical and mental health.",
        voice: 'en-US',
        rate: 0.9,
        question: 'According to the speaker, what is the key to getting health benefits from exercise?',
        options: ['Joining an expensive gym', 'Exercising for two hours daily', 'Being consistent', 'Only doing intense workouts'],
        correct: 2,
        skill: 'listening'
    },
    {
        id: 'l-b1-02',
        level: 'B1',
        difficulty: 0.2,
        type: 'multiple-choice',
        transcript: "Have you heard about the new community garden project? The local council is planning to convert the empty parking lot on Oak Street into a shared garden space. Residents can apply for their own plot to grow vegetables, herbs, or flowers. There will also be a communal area with benches and fruit trees. The project aims to bring neighbours together and promote sustainable living. Applications open next Monday on the council website.",
        voice: 'en-GB',
        rate: 0.9,
        question: 'Where will the community garden be located?',
        options: ['In the park', 'On a rooftop', 'On an empty parking lot', 'Behind the school'],
        correct: 2,
        skill: 'listening'
    },
    // ===== B2 Level =====
    {
        id: 'l-b2-01',
        level: 'B2',
        difficulty: 0.8,
        type: 'multiple-choice',
        transcript: "The interview you're about to hear is with Dr. Sarah Mitchell, a marine biologist who has spent the last fifteen years studying coral reef ecosystems. Dr. Mitchell's research has revealed that coral bleaching events are occurring with increasing frequency, largely due to rising ocean temperatures. Her team has recently discovered that certain species of coral demonstrate remarkable resilience, adapting to warmer conditions through a process they've termed 'thermal acclimatisation'. This finding has significant implications for conservation strategies.",
        voice: 'en-GB',
        rate: 0.95,
        question: 'What significant discovery has Dr. Mitchell\'s team made?',
        options: [
            'That all coral species are dying rapidly.',
            'That some corals can adapt to warmer temperatures.',
            'That ocean temperatures are decreasing.',
            'That coral bleaching has stopped entirely.'
        ],
        correct: 1,
        skill: 'listening'
    },
    {
        id: 'l-b2-02',
        level: 'B2',
        difficulty: 1.2,
        type: 'multiple-choice',
        transcript: "The sharing economy has fundamentally altered consumer behaviour in the twenty-first century. Platforms like Airbnb and Uber have demonstrated that people are increasingly willing to share assets rather than own them outright. This shift reflects not only economic pragmatism but also changing attitudes towards ownership and sustainability. However, critics argue that these platforms often operate in regulatory grey areas, creating unfair competition for traditional businesses that must comply with stricter regulations. The challenge for lawmakers is to balance innovation with consumer protection.",
        voice: 'en-US',
        rate: 1.0,
        question: 'What concern do critics raise about sharing economy platforms?',
        options: [
            'They are too expensive for consumers.',
            'They operate with fewer regulations than traditional businesses.',
            'They do not use modern technology.',
            'They are not popular enough.'
        ],
        correct: 1,
        skill: 'listening'
    },
    // ===== C1 Level =====
    {
        id: 'l-c1-01',
        level: 'C1',
        difficulty: 1.8,
        type: 'multiple-choice',
        transcript: "The notion that creativity is an innate talent, possessed by a select few, is a pervasive cultural myth that recent neuroscientific research has systematically dismantled. Studies employing functional magnetic resonance imaging have demonstrated that creative thinking activates widespread neural networks rather than being localised in a single brain region. Moreover, longitudinal research suggests that creative capacity can be substantially enhanced through deliberate practice, exposure to diverse experiences, and the cultivation of what psychologists term 'openness to experience'. This has profound implications for educational systems, which have traditionally prioritised convergent thinking at the expense of divergent, creative thought processes.",
        voice: 'en-GB',
        rate: 1.0,
        question: 'What does neuroscientific research suggest about creativity?',
        options: [
            'It is located in one specific part of the brain.',
            'It cannot be improved through practice.',
            'It involves widespread neural networks and can be developed.',
            'It is only present in artistic individuals.'
        ],
        correct: 2,
        skill: 'listening'
    },
    // ===== C2 Level =====
    {
        id: 'l-c2-01',
        level: 'C2',
        difficulty: 2.6,
        type: 'multiple-choice',
        transcript: "The philosophical implications of the so-called 'hard problem of consciousness' continue to resist satisfactory resolution. David Chalmers' formulation distinguishes between the 'easy problems' — explaining cognitive functions such as sensory discrimination, the integration of information, and the deliberate control of behaviour — and the hard problem: accounting for why and how physical processes in the brain give rise to subjective experience, or qualia. Materialist reductionists maintain that consciousness will ultimately be explained in purely neurobiological terms, whilst property dualists like Chalmers himself argue that consciousness constitutes a fundamental feature of reality that cannot be reduced to physical processes. This debate has far-reaching ramifications for artificial intelligence, particularly regarding whether machines could ever be genuinely conscious.",
        voice: 'en-GB',
        rate: 1.0,
        question: 'What is the "hard problem of consciousness" as described in the passage?',
        options: [
            'Understanding how the brain processes visual information.',
            'Explaining why physical brain processes produce subjective experience.',
            'Determining whether animals are conscious.',
            'Building a computer that can think like a human.'
        ],
        correct: 1,
        skill: 'listening'
    },
];

export function getListeningItemsByLevel(level) {
    return listeningItems.filter(item => item.level === level);
}

export function getListeningItemsForStage(module) {
    const ranges = {
        'Pre-A1': [-3.5, -2.5], 'A1': [-2.5, -1.5], 'A2': [-1.5, -0.5],
        'B1': [-0.5, 0.5], 'B1-low': [-0.5, 0.0], 'B1-high': [0.0, 0.5],
        'B2': [0.5, 1.5], 'B2-low': [0.5, 1.0], 'B2-high': [1.0, 1.5],
        'C1': [1.5, 2.5], 'C2': [2.0, 3.5],
    };
    const [min, max] = ranges[module] || [-0.5, 0.5];
    return listeningItems.filter(i => i.difficulty >= min && i.difficulty <= max);
}

/**
 * Speak text using Web Speech Synthesis API
 */
export function speakText(text, voice = 'en-US', rate = 0.9) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('Speech synthesis not supported'));
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1;

        // Try to find matching voice
        const voices = speechSynthesis.getVoices();
        const match = voices.find(v => v.lang.startsWith(voice)) || voices.find(v => v.lang.startsWith('en'));
        if (match) utterance.voice = match;

        utterance.onend = resolve;
        utterance.onerror = reject;

        speechSynthesis.speak(utterance);
    });
}
