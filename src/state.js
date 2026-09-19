// ========================================
// EnglishPro — Global State Management
// ========================================

const state = {
    user: {
        name: '',
        email: '',
        id: null,
    },
    exam: {
        type: null,        // 'quick', 'standard', 'full', 'modular'
        skill: null,       // For modular: 'reading', 'listening', 'writing', 'speaking', 'grammar'
        status: 'idle',    // 'idle', 'system-check', 'in-progress', 'completed'
        currentSection: null,
        currentStage: 1,
        currentItem: 0,
        totalItems: 0,
        timeStarted: null,
        timeLimit: null,
        responses: [],
        sections: {},
    },
    results: {
        theta: 0,
        score: 0,
        cefrLevel: '',
        cefrRange: '',
        standardError: 0,
        skillScores: {
            reading: null,
            listening: null,
            writing: null,
            speaking: null,
        },
        coherenceWarning: false,
        completedAt: null,
    },
    certificate: {
        hash: null,
        pdfUrl: null,
    },
    settings: {
        language: 'en',
        soundEnabled: true,
    }
};

const listeners = new Map();

export function getState() {
    return state;
}

export function setState(path, value) {
    const keys = path.split('.');
    let obj = state;
    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    notifyListeners(path);
}

export function subscribe(path, callback) {
    if (!listeners.has(path)) {
        listeners.set(path, new Set());
    }
    listeners.get(path).add(callback);
    return () => listeners.get(path).delete(callback);
}

function notifyListeners(path) {
    // Notify exact matches and parent paths
    for (const [listenerPath, callbacks] of listeners) {
        if (path.startsWith(listenerPath) || listenerPath.startsWith(path)) {
            callbacks.forEach(cb => cb(getState()));
        }
    }
}

export function resetExam() {
    setState('exam', {
        type: null,
        skill: null,
        status: 'idle',
        currentSection: null,
        currentStage: 1,
        currentItem: 0,
        totalItems: 0,
        timeStarted: null,
        timeLimit: null,
        responses: [],
        sections: {},
    });
    setState('results', {
        theta: 0,
        score: 0,
        cefrLevel: '',
        cefrRange: '',
        standardError: 0,
        skillScores: { reading: null, listening: null, writing: null, speaking: null },
        coherenceWarning: false,
        completedAt: null,
    });
}

export function addResponse(response) {
    state.exam.responses.push(response);
    notifyListeners('exam.responses');
}

// Generate unique certificate hash
export function generateCertHash() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 8);
    const hash = `EP-${timestamp}-${random}`.toUpperCase();
    setState('certificate.hash', hash);
    return hash;
}
