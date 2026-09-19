// ========================================
// EnglishPro — Speaking Analyzer
// ========================================

/**
 * Calculates Words Per Minute from audio duration and word count.
 * Optimal range for fluent non-native: 110-140 WPM
 */
export function calculateWPM(wordCount, durationSeconds) {
    if (durationSeconds <= 0) return 0;
    return Math.round((wordCount / durationSeconds) * 60);
}

/**
 * Estimates hesitation ratio from pauses and fillers.
 * < 10% = high fluency (B2+)
 * 10-20% = moderate fluency (B1)
 * > 20% = developing fluency (A1-A2)
 */
export function estimateHesitationRatio(totalDuration, speechDuration) {
    if (totalDuration <= 0) return 0;
    const pauseDuration = totalDuration - speechDuration;
    return Math.round((pauseDuration / totalDuration) * 100);
}

/**
 * Generates a simulated speaking score based on audio metrics.
 * In production, use ASR + pronunciation models.
 */
export function gradeSpeaking(metrics) {
    const { wpm, hesitationRatio, durationSeconds, promptLevel } = metrics;

    const criteria = {
        fluencyAndCoherence: gradeFluency(wpm, hesitationRatio, durationSeconds),
        lexicalResource: 55 + Math.random() * 20, // Simulated — needs ASR
        grammaticalRange: 50 + Math.random() * 25, // Simulated — needs ASR
        pronunciation: 50 + Math.random() * 25, // Simulated — needs speech models
    };

    const totalScore = Math.round(
        criteria.fluencyAndCoherence * 0.30 +
        criteria.lexicalResource * 0.25 +
        criteria.grammaticalRange * 0.25 +
        criteria.pronunciation * 0.20
    );

    return {
        totalScore,
        cefrLevel: scoreToCEFR(totalScore),
        criteria: {
            fluencyAndCoherence: Math.round(criteria.fluencyAndCoherence),
            lexicalResource: Math.round(criteria.lexicalResource),
            grammaticalRange: Math.round(criteria.grammaticalRange),
            pronunciation: Math.round(criteria.pronunciation),
        },
        wpm,
        hesitationRatio,
        feedback: generateSpeakingFeedback(criteria, wpm, hesitationRatio),
    };
}

function gradeFluency(wpm, hesitationRatio, duration) {
    let score = 30;

    // WPM scoring
    if (wpm >= 110 && wpm <= 160) score += 30;
    else if (wpm >= 80 && wpm <= 180) score += 20;
    else if (wpm >= 50) score += 10;

    // Hesitation scoring
    if (hesitationRatio < 10) score += 25;
    else if (hesitationRatio < 20) score += 15;
    else if (hesitationRatio < 35) score += 8;

    // Duration (actually spoke for a reasonable time)
    if (duration >= 30) score += 10;
    if (duration >= 60) score += 5;

    return Math.min(100, score);
}

function scoreToCEFR(score) {
    if (score <= 20) return 'Pre-A1';
    if (score <= 30) return 'A1';
    if (score <= 40) return 'A2';
    if (score <= 55) return 'B1';
    if (score <= 70) return 'B2';
    if (score <= 85) return 'C1';
    return 'C2';
}

function generateSpeakingFeedback(criteria, wpm, hesitationRatio) {
    const fb = [];

    if (wpm < 80) {
        fb.push('💡 Your speaking pace is below average. Practice reading aloud to increase fluency.');
    } else if (wpm >= 110 && wpm <= 150) {
        fb.push('✅ Your speaking pace is natural and comfortable for a listener.');
    } else if (wpm > 160) {
        fb.push('💡 You speak quite fast. Slowing down slightly can improve clarity.');
    }

    if (hesitationRatio > 20) {
        fb.push('💡 Try to reduce pauses and filler words. Practice speaking on topics for 2 minutes without stopping.');
    } else if (hesitationRatio < 10) {
        fb.push('✅ Excellent fluency with minimal hesitation.');
    }

    if (criteria.fluencyAndCoherence >= 60) {
        fb.push('✅ Good overall coherence in your speech.');
    }

    return fb;
}
