// ========================================
// EnglishPro — IRT / Rasch Psychometric Engine
// ========================================

/**
 * Calculates the probability of a correct response using the Rasch model.
 * P(θ) = 1 / (1 + e^(-(θ - b)))
 * @param {number} theta - Ability parameter
 * @param {number} b - Item difficulty parameter
 * @returns {number} Probability [0, 1]
 */
export function calculateProbability(theta, b) {
    return 1 / (1 + Math.exp(-(theta - b)));
}

/**
 * Calculates the Fisher Information for an item at given theta.
 * I(θ) = P(θ) * (1 - P(θ))
 */
export function fisherInformation(theta, b) {
    const p = calculateProbability(theta, b);
    return p * (1 - p);
}

/**
 * Estimates theta using Maximum Likelihood Estimation (MLE) via Newton-Raphson.
 * @param {Array} responses - Array of {correct: boolean, difficulty: number, weight: number}
 * @param {number} [initialTheta=0] - Starting estimate
 * @param {number} [maxIter=50] - Maximum iterations
 * @param {number} [convergence=0.001] - Convergence threshold
 * @returns {number} Estimated theta
 */
export function estimateTheta(responses, initialTheta = 0, maxIter = 50, convergence = 0.001) {
    if (responses.length === 0) return 0;

    let theta = initialTheta;

    for (let iter = 0; iter < maxIter; iter++) {
        let numerator = 0;
        let denominator = 0;

        for (const r of responses) {
            const p = calculateProbability(theta, r.difficulty);
            const w = r.weight || 1;
            const u = r.correct ? 1 : 0;

            numerator += w * (u - p);
            denominator += w * p * (1 - p);
        }

        if (denominator === 0) break;

        const delta = numerator / denominator;
        theta += delta;

        // Clamp theta to reasonable range
        theta = Math.max(-3.5, Math.min(3.5, theta));

        if (Math.abs(delta) < convergence) break;
    }

    return theta;
}

/**
 * Calculates the standard error of theta estimate.
 * SE(θ) = 1 / sqrt(Σ I(θ, b_i))
 */
export function standardError(theta, responses) {
    if (responses.length === 0) return Infinity;

    let totalInfo = 0;
    for (const r of responses) {
        const w = r.weight || 1;
        totalInfo += w * fisherInformation(theta, r.difficulty);
    }

    return totalInfo > 0 ? 1 / Math.sqrt(totalInfo) : Infinity;
}

/**
 * Anti-guessing weight: reduces weight of suspiciously correct answers.
 * If the probability of a correct answer was very low (< threshold),
 * but the answer was correct, apply a reduced weight.
 * 
 * This implements Lucky Guessing Control.
 * 
 * @param {boolean} correct - Whether the answer was correct
 * @param {number} theta - Current ability estimate
 * @param {number} difficulty - Item difficulty
 * @param {number} [guessThreshold=0.25] - Probability threshold for guess detection
 * @returns {number} Weight [0.3, 1.0]
 */
export function antiGuessWeight(correct, theta, difficulty, guessThreshold = 0.25) {
    if (!correct) return 1.0; // Incorrect answers always have full weight

    const p = calculateProbability(theta, difficulty);

    if (p < guessThreshold) {
        // High difficulty for current ability, likely guessed
        // Weight proportional to probability
        return Math.max(0.3, p / guessThreshold);
    }

    return 1.0;
}

/**
 * Selects the next item that maximizes information at current theta.
 * @param {number} theta - Current ability estimate
 * @param {Array} availableItems - Items not yet administered
 * @param {number} [targetInfo=null] - Target information level (for balanced exposure)
 * @returns {Object} Selected item
 */
export function selectNextItem(theta, availableItems) {
    if (availableItems.length === 0) return null;

    let bestItem = availableItems[0];
    let bestInfo = -1;

    for (const item of availableItems) {
        const info = fisherInformation(theta, item.difficulty);
        // Add small random jitter to prevent predictable ordering
        const jitteredInfo = info + (Math.random() * 0.01);

        if (jitteredInfo > bestInfo) {
            bestInfo = jitteredInfo;
            bestItem = item;
        }
    }

    return bestItem;
}

/**
 * Determines which stage/module the examinee should be routed to.
 * Implements Computer-Adaptive Multi-Stage Testing (ca-MST).
 * 
 * Stage 1: B1 level (always)
 * Stage 2: A1-A2 or B2-C1 based on Stage 1 performance
 * Stage 3: Final fine-tuning within the determined range
 * 
 * @param {number} theta - Current ability estimate
 * @param {number} currentStage - Current stage (1, 2, or 3)
 * @returns {string} Module identifier (e.g., 'A1-A2', 'B1', 'B2-C1', 'C1-C2')
 */
export function routeToModule(theta, currentStage) {
    if (currentStage === 1) {
        return 'B1'; // Always start with B1
    }

    if (currentStage === 2) {
        if (theta < -1.5) return 'A1';
        if (theta < -0.5) return 'A2';
        if (theta < 0.5) return 'B1';
        if (theta < 1.5) return 'B2';
        return 'C1';
    }

    if (currentStage === 3) {
        if (theta < -2.0) return 'Pre-A1';
        if (theta < -1.5) return 'A1';
        if (theta < -0.5) return 'A2';
        if (theta < 0.0) return 'B1-low';
        if (theta < 0.5) return 'B1-high';
        if (theta < 1.0) return 'B2-low';
        if (theta < 1.5) return 'B2-high';
        if (theta < 2.0) return 'C1';
        return 'C2';
    }

    return 'B1';
}

/**
 * Check if the test should stop based on stopping criteria.
 * @param {Array} responses - Current responses
 * @param {number} theta - Current theta
 * @param {number} minItems - Minimum items required
 * @param {number} maxItems - Maximum items allowed
 * @param {number} seThreshold - SE threshold for stopping (e.g., 0.3)
 * @returns {boolean} Should stop
 */
export function shouldStopTest(responses, theta, minItems, maxItems, seThreshold = 0.32) {
    if (responses.length >= maxItems) return true;
    if (responses.length < minItems) return false;

    const se = standardError(theta, responses);
    return se <= seThreshold;
}
