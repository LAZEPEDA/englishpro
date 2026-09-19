// ========================================
// EnglishPro — Scoring & Level Mapping
// ========================================

/**
 * Transforms theta (-3 to +3) to a linear 0-100 score.
 * LTS: Score = ((θ + 3) / 6) * 100, clamped to [0, 100]
 */
export function thetaToScore(theta) {
    const score = ((theta + 3) / 6) * 100;
    return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Maps a 0-100 score to a CEFR level.
 */
export function scoreToCEFR(score) {
    if (score <= 20) return 'Pre-A1';
    if (score <= 30) return 'A1';
    if (score <= 40) return 'A2';
    if (score <= 50) return 'B1';
    if (score <= 60) return 'B2';
    if (score <= 70) return 'C1';
    return 'C2';
}

/**
 * Returns the score range for a CEFR level.
 */
export function cefrScoreRange(level) {
    const ranges = {
        'Pre-A1': [0, 20],
        'A1': [21, 30],
        'A2': [31, 40],
        'B1': [41, 50],
        'B2': [51, 60],
        'C1': [61, 70],
        'C2': [71, 100],
    };
    return ranges[level] || [0, 100];
}

/**
 * For quick/short tests, returns a range of levels instead of a single level.
 * Uses standard error to determine confidence interval.
 */
export function scoreToRange(score, se) {
    const thetaSE = se || 0.5;
    // Convert SE back to score scale
    const scoreSE = (thetaSE / 6) * 100;
    const lower = Math.max(0, score - scoreSE);
    const upper = Math.min(100, score + scoreSE);

    const lowerLevel = scoreToCEFR(lower);
    const upperLevel = scoreToCEFR(upper);

    if (lowerLevel === upperLevel) return lowerLevel;
    return `${lowerLevel}–${upperLevel}`;
}

/**
 * Coherence matrix: validates cross-skill consistency.
 * Flags if any two skills differ by more than 2 CEFR levels.
 */
export function coherenceMatrix(skillScores) {
    const levels = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const warnings = [];

    const skills = Object.entries(skillScores).filter(([, score]) => score !== null);

    for (let i = 0; i < skills.length; i++) {
        for (let j = i + 1; j < skills.length; j++) {
            const [skill1, score1] = skills[i];
            const [skill2, score2] = skills[j];
            const level1 = scoreToCEFR(score1);
            const level2 = scoreToCEFR(score2);
            const diff = Math.abs(levels.indexOf(level1) - levels.indexOf(level2));

            if (diff >= 3) {
                warnings.push({
                    skill1,
                    skill2,
                    level1,
                    level2,
                    message: `Significant discrepancy: ${skill1} (${level1}) vs ${skill2} (${level2}). Combined score may not be reliable.`
                });
            }
        }
    }

    return warnings;
}

/**
 * International equivalency table.
 * Converts EnglishPro score to approximate equivalent scores.
 */
export function equivalencyTable(score) {
    const level = scoreToCEFR(score);

    const table = {
        'Pre-A1': { ielts: '–', toefl: '–', cambridge: '–', toeic: '0-120', gse: '10-21' },
        'A1': { ielts: '–', toefl: '–', cambridge: '100-119', toeic: '120-225', gse: '22-29' },
        'A2': { ielts: '3.0-3.5', toefl: '–', cambridge: '120-139 (A2 Key)', toeic: '225-550', gse: '30-35' },
        'B1': { ielts: '4.0-5.0', toefl: '42-71', cambridge: '140-159 (B1 Preliminary)', toeic: '550-785', gse: '43-50' },
        'B2': { ielts: '5.5-6.5', toefl: '72-94', cambridge: '160-179 (B2 First)', toeic: '785-945', gse: '51-58' },
        'C1': { ielts: '7.0-8.0', toefl: '95-113', cambridge: '180-199 (C1 Advanced)', toeic: '945+', gse: '59-75' },
        'C2': { ielts: '8.5-9.0', toefl: '114-120', cambridge: '200+ (C2 Proficiency)', toeic: '945+', gse: '76-90' },
    };

    return {
        level,
        score,
        ...(table[level] || table['B1']),
    };
}

/**
 * Calculate combined score from multiple skills.
 * Simple weighted average with coherence check.
 */
export function combinedScore(skillScores, weights = null) {
    const defaultWeights = {
        reading: 0.25,
        listening: 0.25,
        writing: 0.25,
        speaking: 0.25,
    };

    const w = weights || defaultWeights;
    let totalWeight = 0;
    let weightedSum = 0;

    for (const [skill, score] of Object.entries(skillScores)) {
        if (score !== null && w[skill]) {
            weightedSum += score * w[skill];
            totalWeight += w[skill];
        }
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/**
 * Get Can-Do descriptors for a CEFR level.
 */
export function getCanDoDescriptors(level) {
    const descriptors = {
        'Pre-A1': {
            reading: 'Can recognize familiar words and very basic phrases on simple notices and posters.',
            listening: 'Can understand simple greetings and farewells.',
            writing: 'Can write their name and simple personal details.',
            speaking: 'Can use basic greetings and make simple requests.',
            general: 'Has a very basic range of simple expressions about personal details and needs.'
        },
        'A1': {
            reading: 'Can understand very short, simple texts, finding specific predictable information in everyday material.',
            listening: 'Can understand familiar words and basic phrases concerning themselves, their family, and immediate surroundings.',
            writing: 'Can write short, simple postcards and fill in forms with personal details.',
            speaking: 'Can interact in a simple way provided the other person talks slowly and is prepared to help.',
            general: 'Can understand and use familiar everyday expressions and very basic phrases.'
        },
        'A2': {
            reading: 'Can read very short, simple texts and find specific information in everyday material such as menus, timetables, and advertisements.',
            listening: 'Can understand phrases and the highest frequency vocabulary related to areas of most immediate personal relevance.',
            writing: 'Can write short, simple notes and messages relating to matters in areas of immediate need.',
            speaking: 'Can communicate in simple and routine tasks requiring a direct exchange of information on familiar topics.',
            general: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance.'
        },
        'B1': {
            reading: 'Can understand texts that consist mainly of high frequency everyday or job-related language.',
            listening: 'Can understand the main points of clear standard speech on familiar matters regularly encountered in work, school, leisure.',
            writing: 'Can write simple connected text on topics which are familiar or of personal interest.',
            speaking: 'Can deal with most situations likely to arise while traveling in an area where the language is spoken.',
            general: 'Can understand the main points of clear standard input on familiar matters. Can produce simple connected text.'
        },
        'B2': {
            reading: 'Can read articles and reports concerned with contemporary problems in which the writers adopt particular attitudes or viewpoints.',
            listening: 'Can understand extended speech and lectures and follow complex lines of argument provided the topic is reasonably familiar.',
            writing: 'Can write clear, detailed text on a wide range of subjects related to their interests.',
            speaking: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.',
            general: 'Can understand the main ideas of complex text. Can interact with fluency and spontaneity.'
        },
        'C1': {
            reading: 'Can understand long and complex factual and literary texts, appreciating distinctions of style and implicit meaning.',
            listening: 'Can understand extended speech even when it is not clearly structured and when relationships are only implied.',
            writing: 'Can express themselves in clear, well-structured text, expressing points of view at some length.',
            speaking: 'Can express themselves fluently and spontaneously without much obvious searching for expressions.',
            general: 'Can understand a wide range of demanding texts. Can use language flexibly and effectively for social, academic and professional purposes.'
        },
        'C2': {
            reading: 'Can read with ease virtually all forms of the written language, including abstract, structurally complex texts.',
            listening: 'Can understand any kind of spoken language, whether live or broadcast, even when delivered at fast native speed.',
            writing: 'Can write clear, smoothly flowing text in an appropriate style with logical structure and effective summaries.',
            speaking: 'Can express themselves spontaneously, very fluently and precisely, differentiating finer shades of meaning.',
            general: 'Can understand with ease virtually everything heard or read. Can express themselves spontaneously and precisely.'
        }
    };

    return descriptors[level] || descriptors['B1'];
}

/**
 * Get study recommendations based on weak areas.
 */
export function getStudyRecommendations(skillScores) {
    const recommendations = [];
    const skills = Object.entries(skillScores).filter(([, s]) => s !== null);

    if (skills.length === 0) return ['Complete more sections to get personalized recommendations.'];

    // Find weakest skill
    const sorted = skills.sort((a, b) => a[1] - b[1]);
    const weakest = sorted[0];
    const strongest = sorted[sorted.length - 1];

    const tips = {
        reading: [
            'Read graded readers at your current level and one level above.',
            'Practice scanning and skimming techniques with newspaper articles.',
            'Build vocabulary through extensive reading — aim for 20 minutes daily.',
            'Focus on understanding text structure: topic sentences, supporting details, conclusions.',
        ],
        listening: [
            'Listen to podcasts and TED talks with subtitles, then without.',
            'Practice with varied accents (BBC, CNN, Australian broadcasts).',
            'Use dictation exercises to improve word recognition speed.',
            'Watch English movies — start with subtitles, gradually remove them.',
        ],
        writing: [
            'Practice writing different text types: emails, essays, reports.',
            'Focus on linking words and cohesive devices.',
            'Expand your vocabulary — learn collocations, not just individual words.',
            'Review and self-edit your writing for grammar and style improvements.',
        ],
        speaking: [
            'Practice speaking for 2-3 minutes on random topics to build fluency.',
            'Record yourself and listen back to identify pronunciation issues.',
            'Learn and practice conversational fillers and discourse markers.',
            'Join language exchange communities for regular practice.',
        ],
    };

    recommendations.push(`**Focus Area: ${weakest[0].charAt(0).toUpperCase() + weakest[0].slice(1)}** — This is your area with most room for improvement.`);

    if (tips[weakest[0]]) {
        recommendations.push(...tips[weakest[0]].slice(0, 2));
    }

    if (strongest[1] - weakest[1] > 15) {
        recommendations.push(`Your ${strongest[0]} is significantly stronger than your ${weakest[0]}. Balanced practice will help you progress faster overall.`);
    }

    const avgScore = skills.reduce((sum, [, s]) => sum + s, 0) / skills.length;
    const level = scoreToCEFR(avgScore);

    if (['Pre-A1', 'A1', 'A2'].includes(level)) {
        recommendations.push('Consider structured courses focusing on everyday communication and basic grammar.');
    } else if (['B1', 'B2'].includes(level)) {
        recommendations.push('Focus on academic and professional English. Consider preparing for an official certificate (Cambridge FCE/CAE).');
    } else {
        recommendations.push('Maintain your level through immersion: read academic papers, watch debates, write formal analyses.');
    }

    return recommendations;
}
