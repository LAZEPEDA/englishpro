// ========================================
// EnglishPro — Writing Grader (Client-side simulation)
// ========================================

/**
 * Analyzes writing and returns a CEFR-aligned score.
 * This is a client-side simulation. In production, use a fine-tuned LLM.
 */
export function gradeWriting(text, prompt) {
    if (!text || text.trim().length === 0) {
        return { totalScore: 0, cefrLevel: 'Pre-A1', criteria: {}, feedback: 'No text submitted.' };
    }

    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCount = words.length;
    const sentenceCount = Math.max(1, sentences.length);
    const avgSentenceLength = wordCount / sentenceCount;

    // Vocabulary diversity (Type-Token Ratio)
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z']/g, '')));
    const ttr = uniqueWords.size / Math.max(1, wordCount);

    // Academic/advanced word count (words > 7 chars as proxy)
    const advancedWords = words.filter(w => w.length > 7).length;
    const advancedRatio = advancedWords / Math.max(1, wordCount);

    // Connector detection
    const connectors = ['however', 'moreover', 'furthermore', 'nevertheless', 'consequently',
        'therefore', 'although', 'despite', 'whereas', 'meanwhile', 'additionally',
        'in addition', 'on the other hand', 'as a result', 'in contrast', 'for instance',
        'in conclusion', 'to summarize', 'firstly', 'secondly', 'finally'];
    const lowerText = text.toLowerCase();
    const connectorCount = connectors.filter(c => lowerText.includes(c)).length;

    // Paragraph structure
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const hasParagraphs = paragraphs.length >= 2;

    // Grammar patterns (basic checks)
    const grammarErrors = [];
    const errorPatterns = [
        { regex: /\bi\s+[a-z]/g, msg: 'Lowercase "i" instead of "I"' },
        { regex: /\s{2,}/g, msg: 'Multiple spaces' },
        { regex: /[a-z]\.[A-Z]/g, msg: 'Missing space after period' },
    ];
    for (const p of errorPatterns) {
        const matches = text.match(p.regex);
        if (matches) grammarErrors.push({ ...p, count: matches.length });
    }

    // Score each criterion (0-100)
    const criteria = {
        taskAchievement: calculateTaskScore(wordCount, prompt),
        coherence: calculateCoherenceScore(connectorCount, hasParagraphs, sentenceCount),
        lexicalResource: calculateLexicalScore(ttr, advancedRatio, wordCount),
        grammaticalRange: calculateGrammarScore(avgSentenceLength, grammarErrors.length, wordCount),
    };

    const totalScore = Math.round(
        criteria.taskAchievement * 0.25 +
        criteria.coherence * 0.25 +
        criteria.lexicalResource * 0.25 +
        criteria.grammaticalRange * 0.25
    );

    const feedback = generateWritingFeedback(criteria, wordCount, prompt, connectorCount, ttr);

    return {
        totalScore,
        cefrLevel: scoreToCEFRLocal(totalScore),
        criteria,
        wordCount,
        sentenceCount,
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
        ttr: Math.round(ttr * 100) / 100,
        advancedWordRatio: Math.round(advancedRatio * 100) / 100,
        connectorCount,
        paragraphCount: paragraphs.length,
        feedback,
    };
}

function calculateTaskScore(wordCount, prompt) {
    if (!prompt) return 50;
    const [min, max] = prompt.wordRange || [50, 200];
    if (wordCount < min * 0.5) return 20;
    if (wordCount < min) return 40;
    if (wordCount <= max) return 80;
    if (wordCount <= max * 1.3) return 70;
    return 55; // Too long
}

function calculateCoherenceScore(connectors, hasParagraphs, sentences) {
    let score = 30;
    score += Math.min(30, connectors * 8);
    if (hasParagraphs) score += 20;
    if (sentences >= 3) score += 10;
    if (sentences >= 6) score += 10;
    return Math.min(100, score);
}

function calculateLexicalScore(ttr, advancedRatio, wordCount) {
    let score = 20;
    if (ttr > 0.5) score += 20;
    if (ttr > 0.65) score += 15;
    if (ttr > 0.75) score += 10;
    score += Math.min(25, advancedRatio * 200);
    if (wordCount > 100) score += 10;
    return Math.min(100, score);
}

function calculateGrammarScore(avgLen, errorCount, wordCount) {
    let score = 60;
    if (avgLen > 8 && avgLen < 25) score += 15;
    if (avgLen > 12 && avgLen < 22) score += 10;
    score -= Math.min(30, errorCount * 5);
    if (wordCount > 50) score += 5;
    return Math.max(10, Math.min(100, score));
}

function scoreToCEFRLocal(score) {
    if (score <= 20) return 'Pre-A1';
    if (score <= 30) return 'A1';
    if (score <= 40) return 'A2';
    if (score <= 55) return 'B1';
    if (score <= 70) return 'B2';
    if (score <= 85) return 'C1';
    return 'C2';
}

function generateWritingFeedback(criteria, wordCount, prompt, connectors, ttr) {
    const fb = [];

    if (criteria.taskAchievement < 50) {
        fb.push('⚠️ Your response may not fully address the task requirements. Check the word count and topic coverage.');
    } else if (criteria.taskAchievement >= 70) {
        fb.push('✅ Good task achievement — your response addresses the main requirements.');
    }

    if (connectors < 2) {
        fb.push('💡 Try using more linking words (however, moreover, consequently) to improve text flow.');
    } else {
        fb.push('✅ Good use of cohesive devices to connect your ideas.');
    }

    if (ttr < 0.5) {
        fb.push('💡 Your vocabulary range is limited. Try to avoid repeating the same words — use synonyms and varied expressions.');
    } else if (ttr > 0.7) {
        fb.push('✅ Excellent vocabulary diversity — you use a wide range of words effectively.');
    }

    if (criteria.grammaticalRange < 50) {
        fb.push('💡 Review basic grammar rules, especially subject-verb agreement and sentence structure.');
    } else if (criteria.grammaticalRange >= 70) {
        fb.push('✅ Good grammatical control with varied sentence structures.');
    }

    return fb;
}
