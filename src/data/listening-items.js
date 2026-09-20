// ========================================
// EnglishPro — Listening Item Bank
// Professional TTS via Google Cloud Text-to-Speech Neural2
// ========================================

// Google Cloud TTS API configuration
// API key is loaded at runtime from window config (set in index.html or admin settings)
// Never hardcode API keys in source code
function getAPIKey() {
    return window.__EP_CONFIG__?.gcpTtsKey
        || localStorage.getItem('ep_gcp_tts_key')
        || '';
}
const GCP_TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

// Premium Neural2 voice pool — natural-sounding native English speakers
const VOICE_POOL = {
    'en-US-female': { languageCode: 'en-US', name: 'en-US-Neural2-F', ssmlGender: 'FEMALE' },
    'en-US-male': { languageCode: 'en-US', name: 'en-US-Neural2-D', ssmlGender: 'MALE' },
    'en-GB-female': { languageCode: 'en-GB', name: 'en-GB-Neural2-A', ssmlGender: 'FEMALE' },
    'en-GB-male': { languageCode: 'en-GB', name: 'en-GB-Neural2-B', ssmlGender: 'MALE' },
    'en-AU-female': { languageCode: 'en-AU', name: 'en-AU-Neural2-A', ssmlGender: 'FEMALE' },
    'en-AU-male': { languageCode: 'en-AU', name: 'en-AU-Neural2-B', ssmlGender: 'MALE' },
};

// Audio cache to avoid repeated API calls
const audioCache = new Map();

export const listeningItems = [
    // ===== A1 Level =====
    {
        id: 'l-a1-01',
        level: 'A1',
        difficulty: -2.2,
        type: 'multiple-choice',
        transcript: "Hello. My name is John. I'm a teacher. I live in New York. I have two children. I like reading books.",
        voice: 'en-US-male',
        speakingRate: 0.85,
        question: "What is John's job?",
        options: ['Doctor', 'Teacher', 'Engineer', 'Driver'],
        correct: 1,
        skill: 'listening'
    },
    {
        id: 'l-a1-02',
        level: 'A1',
        difficulty: -1.9,
        type: 'multiple-choice',
        transcript: "Excuse me, where is the train station? Go straight ahead, and turn left at the traffic lights. The station is on the right. Thank you very much.",
        voice: 'en-GB-female',
        speakingRate: 0.85,
        question: 'Where should the person turn?',
        options: ['Right at the traffic lights', 'Left at the traffic lights', 'Right at the station', 'Left at the corner'],
        correct: 1,
        skill: 'listening'
    },
    {
        id: 'l-a1-03',
        level: 'A1',
        difficulty: -1.7,
        type: 'multiple-choice',
        transcript: "Good morning. Can I have a coffee, please? Of course. Would you like milk and sugar? Just milk, please. No sugar. That's one pound fifty, please. Here you are. Thank you. Have a nice day!",
        voice: 'en-GB-male',
        speakingRate: 0.85,
        question: "How does the person take their coffee?",
        options: ['Black, no sugar', 'With milk and sugar', 'With milk, no sugar', 'With sugar, no milk'],
        correct: 2,
        skill: 'listening'
    },
    // ===== A2 Level =====
    {
        id: 'l-a2-01',
        level: 'A2',
        difficulty: -1.2,
        type: 'multiple-choice',
        transcript: "Good morning. Welcome to the City Museum. We're open every day from nine in the morning to five in the afternoon. Tickets are eight pounds for adults and four pounds for children under twelve. We have a special exhibition about ancient Egypt this month. It's on the second floor. Enjoy your visit!",
        voice: 'en-GB-female',
        speakingRate: 0.9,
        question: "How much does a child's ticket cost?",
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
        voice: 'en-US-female',
        speakingRate: 0.9,
        question: 'How much was the jacket?',
        options: ['Twenty-five euros', 'Thirty euros', 'Thirty-five euros', 'Forty-five euros'],
        correct: 2,
        skill: 'listening'
    },
    {
        id: 'l-a2-03',
        level: 'A2',
        difficulty: -0.6,
        type: 'multiple-choice',
        transcript: "The train to Manchester leaves from platform seven at ten forty-five. Please note that the eleven fifteen service to Birmingham has been cancelled due to engineering works. Passengers for Birmingham should take the eleven thirty service from platform two instead. We apologise for any inconvenience.",
        voice: 'en-GB-male',
        speakingRate: 0.9,
        question: "What happened to the eleven fifteen service to Birmingham?",
        options: ['It was delayed by thirty minutes', 'It was cancelled', 'It was moved to platform seven', 'It left early'],
        correct: 1,
        skill: 'listening'
    },
    // ===== B1 Level =====
    {
        id: 'l-b1-01',
        level: 'B1',
        difficulty: -0.2,
        type: 'multiple-choice',
        transcript: "Today I'd like to talk about the benefits of regular exercise. Research has shown that people who exercise at least three times a week have lower stress levels and better concentration. You don't need to join an expensive gym. Simple activities like walking, cycling, or even gardening can make a significant difference. The key is consistency. Even twenty minutes a day can improve your physical and mental health.",
        voice: 'en-US-male',
        speakingRate: 0.95,
        question: 'According to the speaker, what is the key to getting health benefits from exercise?',
        options: ['Joining an expensive gym', 'Exercising for two hours daily', 'Being consistent', 'Only doing intense workouts'],
        correct: 2,
        skill: 'listening'
    },
    {
        id: 'l-b1-02',
        level: 'B1',
        difficulty: 0.0,
        type: 'multiple-choice',
        transcript: "Have you heard about the new community garden project? The local council is planning to convert the empty parking lot on Oak Street into a shared garden space. Residents can apply for their own plot to grow vegetables, herbs, or flowers. There will also be a communal area with benches and fruit trees. The project aims to bring neighbours together and promote sustainable living. Applications open next Monday on the council website.",
        voice: 'en-GB-female',
        speakingRate: 0.95,
        question: 'Where will the community garden be located?',
        options: ['In the park', 'On a rooftop', 'On an empty parking lot', 'Behind the school'],
        correct: 2,
        skill: 'listening'
    },
    {
        id: 'l-b1-03',
        level: 'B1',
        difficulty: 0.3,
        type: 'multiple-choice',
        transcript: "Good afternoon, everyone. I'm Detective Inspector Harris, and I'm here to give you an update on the investigation into last week's break-in at the Henderson Library. We believe the incident occurred between midnight and three a.m. on Thursday. The suspects entered through a ground-floor window that had been left slightly open. Several rare first-edition books were taken, with an estimated total value of around forty thousand pounds. We're asking anyone who was in the area at that time to come forward.",
        voice: 'en-GB-male',
        speakingRate: 0.95,
        question: "How did the suspects enter the building?",
        options: ['Through the main door', 'Through an open window', 'Through the roof', 'Through the basement'],
        correct: 1,
        skill: 'listening'
    },
    // ===== B2 Level =====
    {
        id: 'l-b2-01',
        level: 'B2',
        difficulty: 0.8,
        type: 'multiple-choice',
        transcript: "The interview you're about to hear is with Doctor Sarah Mitchell, a marine biologist who has spent the last fifteen years studying coral reef ecosystems. Doctor Mitchell's research has revealed that coral bleaching events are occurring with increasing frequency, largely due to rising ocean temperatures. Her team has recently discovered that certain species of coral demonstrate remarkable resilience, adapting to warmer conditions through a process they've termed thermal acclimatisation. This finding has significant implications for conservation strategies.",
        voice: 'en-GB-female',
        speakingRate: 1.0,
        question: "What significant discovery has Doctor Mitchell's team made?",
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
        voice: 'en-US-male',
        speakingRate: 1.0,
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
    {
        id: 'l-b2-03',
        level: 'B2',
        difficulty: 1.0,
        type: 'multiple-choice',
        transcript: "You're listening to a lecture on environmental psychology. Studies consistently demonstrate that exposure to natural environments has measurable effects on cognitive function and emotional well-being. Participants who spent just twenty minutes walking in a forested area showed a fourteen percent decrease in cortisol levels compared to those who walked in an urban setting. Furthermore, attention restoration theory suggests that natural settings engage involuntary attention, allowing the directed attention mechanisms that we use for focused tasks to rest and recover. This has led several corporations to redesign their office spaces to incorporate biophilic design elements.",
        voice: 'en-AU-female',
        speakingRate: 1.0,
        question: "According to the lecture, why do natural settings help with cognitive recovery?",
        options: [
            'They increase cortisol levels which boosts alertness.',
            'They engage involuntary attention, allowing focused attention to rest.',
            'They require intense concentration to navigate.',
            'They reduce all forms of attention equally.'
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
        transcript: "The notion that creativity is an innate talent, possessed by a select few, is a pervasive cultural myth that recent neuroscientific research has systematically dismantled. Studies employing functional magnetic resonance imaging have demonstrated that creative thinking activates widespread neural networks rather than being localised in a single brain region. Moreover, longitudinal research suggests that creative capacity can be substantially enhanced through deliberate practice, exposure to diverse experiences, and the cultivation of what psychologists term openness to experience. This has profound implications for educational systems, which have traditionally prioritised convergent thinking at the expense of divergent, creative thought processes.",
        voice: 'en-GB-male',
        speakingRate: 1.0,
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
    {
        id: 'l-c1-02',
        level: 'C1',
        difficulty: 2.0,
        type: 'multiple-choice',
        transcript: "Welcome to this seminar on behavioural economics. Today we'll be examining the concept of loss aversion, first formalised by Kahneman and Tversky in their nineteen seventy-nine prospect theory. Their research demonstrated that the psychological impact of losing a given amount is approximately twice as powerful as the pleasure derived from gaining the same amount. This asymmetry has far-reaching implications for decision-making in contexts ranging from investment strategies to public health campaigns. For instance, framing a message in terms of potential losses rather than potential gains has been shown to be significantly more effective in motivating behavioural change, a finding that has been extensively exploited in marketing and policy design.",
        voice: 'en-US-female',
        speakingRate: 1.0,
        question: "According to the lecture, how does the impact of losing compare to gaining the same amount?",
        options: [
            'They have approximately equal psychological impact.',
            'Gaining is perceived as twice as powerful as losing.',
            'Losing is perceived as approximately twice as powerful as gaining.',
            'The relationship depends entirely on the individual.'
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
        transcript: "The philosophical implications of the so-called hard problem of consciousness continue to resist satisfactory resolution. David Chalmers' formulation distinguishes between the easy problems, explaining cognitive functions such as sensory discrimination, the integration of information, and the deliberate control of behaviour, and the hard problem: accounting for why and how physical processes in the brain give rise to subjective experience, or qualia. Materialist reductionists maintain that consciousness will ultimately be explained in purely neurobiological terms, whilst property dualists like Chalmers himself argue that consciousness constitutes a fundamental feature of reality that cannot be reduced to physical processes. This debate has far-reaching ramifications for artificial intelligence, particularly regarding whether machines could ever be genuinely conscious.",
        voice: 'en-GB-male',
        speakingRate: 1.0,
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
    {
        id: 'l-c2-02',
        level: 'C2',
        difficulty: 2.8,
        type: 'multiple-choice',
        transcript: "In recent decades, the field of epigenetics has fundamentally challenged the neo-Darwinian orthodoxy that acquired characteristics cannot be inherited. Epigenetic modifications, which include DNA methylation and histone acetylation, can alter gene expression without changing the underlying nucleotide sequence, and crucially, some of these modifications have been shown to be transmissible across generations. A landmark study by Dias and Ressler at Emory University demonstrated that mice trained to associate a specific odour with an aversive stimulus produced offspring that exhibited heightened sensitivity to that same odour, despite having had no direct exposure to it. This transgenerational epigenetic inheritance has reignited interest in Lamarckian concepts, though it should be noted that the mechanisms involved are fundamentally distinct from Lamarck's original formulation.",
        voice: 'en-GB-female',
        speakingRate: 1.0,
        question: "What aspect of neo-Darwinian orthodoxy does epigenetics challenge?",
        options: [
            'That natural selection drives evolution.',
            'That DNA contains the genetic code.',
            'That acquired characteristics cannot be inherited.',
            'That species change over time.'
        ],
        correct: 2,
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
 * Speak text using Google Cloud Text-to-Speech Neural2 API.
 * Falls back to enhanced Web Speech Synthesis if API is unavailable.
 */
export async function speakText(text, voiceKey = 'en-US-male', speakingRate = 1.0) {
    // Generate a cache key
    const cacheKey = `${voiceKey}_${speakingRate}_${text.substring(0, 80)}`;

    // Check cache first
    if (audioCache.has(cacheKey)) {
        return playAudioBuffer(audioCache.get(cacheKey));
    }

    try {
        // Attempt Google Cloud TTS Neural2
        const audioContent = await synthesizeWithGoogleCloud(text, voiceKey, speakingRate);
        if (audioContent) {
            audioCache.set(cacheKey, audioContent);
            return playAudioBuffer(audioContent);
        }
    } catch (err) {
        console.warn('Google Cloud TTS failed, falling back to enhanced Web Speech:', err.message);
    }

    // Fallback: Enhanced Web Speech Synthesis with best available voice
    return speakWithWebSpeech(text, voiceKey, speakingRate);
}

/**
 * Google Cloud TTS Neural2 synthesis.
 * Returns base64-encoded audio content.
 */
async function synthesizeWithGoogleCloud(text, voiceKey, speakingRate) {
    const voiceConfig = VOICE_POOL[voiceKey] || VOICE_POOL['en-US-male'];

    // Use SSML for natural prosody
    const ssml = `<speak>
    <prosody rate="${Math.round(speakingRate * 100)}%" pitch="+0st">
      ${escapeSSML(text)}
    </prosody>
  </speak>`;

    const apiKey = getAPIKey();
    if (!apiKey) {
        throw new Error('Google Cloud TTS API key not configured');
    }

    const response = await fetch(`${GCP_TTS_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input: { ssml },
            voice: voiceConfig,
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: speakingRate,
                pitch: 0,
                volumeGainDb: 0,
                sampleRateHertz: 24000,
                effectsProfileId: ['headphone-class-device'],
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Google TTS API error: ${response.status}`);
    }

    const data = await response.json();
    return data.audioContent; // base64
}

/**
 * Play base64-encoded audio content.
 */
function playAudioBuffer(base64Audio) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = resolve;
        audio.onerror = reject;
        audio.play().catch(reject);
    });
}

/**
 * Escape special characters for SSML.
 */
function escapeSSML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Enhanced Web Speech Synthesis fallback.
 * Prioritizes high-quality native English voices.
 */
function speakWithWebSpeech(text, voiceKey, speakingRate) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('Speech synthesis not supported'));
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speakingRate;
        utterance.pitch = 1.0;

        // Get the best available English voice
        const voices = window.speechSynthesis.getVoices();
        const targetLang = voiceKey.startsWith('en-GB') ? 'en-GB'
            : voiceKey.startsWith('en-AU') ? 'en-AU' : 'en-US';

        // Priority order: Neural > Enhanced > Default
        const prioritized = voices
            .filter(v => v.lang.startsWith('en'))
            .sort((a, b) => {
                const scoreA = voiceQualityScore(a, targetLang);
                const scoreB = voiceQualityScore(b, targetLang);
                return scoreB - scoreA;
            });

        if (prioritized.length > 0) {
            utterance.voice = prioritized[0];
        }

        utterance.onend = resolve;
        utterance.onerror = (e) => {
            if (e.error === 'interrupted' || e.error === 'cancelled') {
                resolve(); // Not a real error
            } else {
                reject(e);
            }
        };

        window.speechSynthesis.speak(utterance);
    });
}

/**
 * Score voice quality for sorting. Higher = better.
 */
function voiceQualityScore(voice, targetLang) {
    let score = 0;
    const name = voice.name.toLowerCase();

    // Prefer matching language
    if (voice.lang === targetLang) score += 10;
    else if (voice.lang.startsWith('en')) score += 5;

    // Prefer Neural / Natural / Premium voices
    if (name.includes('neural') || name.includes('natural')) score += 20;
    if (name.includes('enhanced') || name.includes('premium')) score += 15;
    if (name.includes('google') || name.includes('microsoft')) score += 8;

    // Avoid robotic system voices
    if (name.includes('espeak') || name.includes('mbrola')) score -= 20;

    return score;
}
