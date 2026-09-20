// ========================================
// EnglishPro — Exam Runner (Main Exam Page)
// ========================================
import { getState, setState, addResponse } from '../state.js';
import { navigate } from '../router.js';
import { estimateTheta, antiGuessWeight, selectNextItem, routeToModule, shouldStopTest, standardError } from '../engine/irt.js';
import { thetaToScore, scoreToCEFR, scoreToRange } from '../engine/scoring.js';
import { readingItems, getItemsForStage } from '../data/reading-items.js';
import { listeningItems, getListeningItemsForStage, speakText } from '../data/listening-items.js';
import { writingPrompts, speakingPrompts } from '../data/writing-prompts.js';
import { gradeWriting } from '../engine/writing-grader.js';
import { gradeSpeaking, calculateWPM } from '../engine/speaking-analyzer.js';

export default function ExamRunnerPage(container, params) {
  const examType = params.type || getState().exam.type || 'quick';
  let currentSection = 'reading';
  let currentItemIndex = 0;
  let theta = 0;
  let responses = [];
  let availableItems = [];
  let currentItem = null;
  let timerInterval = null;
  let timeRemaining = 0;
  let stage = 1;
  let sectionScores = {};
  let writingText = '';
  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;
  let recordingStartTime = 0;

  // Section flow based on exam type
  const sectionFlow = {
    quick: ['reading'],
    standard: ['reading', 'listening'],
    full: ['reading', 'listening', 'writing', 'speaking'],
    modular: [getState().exam.skill || 'reading'],
  };

  const sections = sectionFlow[examType] || ['reading'];
  const timeLimits = { quick: 900, standard: 3000, full: 7200, modular: 1800 };

  function init() {
    timeRemaining = timeLimits[examType] || 1800;
    setState('exam.timeStarted', Date.now());
    loadSection(sections[0]);
    startTimer();
  }

  function loadSection(section) {
    currentSection = section;
    currentItemIndex = 0;
    theta = 0;
    responses = [];
    stage = 1;

    if (section === 'reading') {
      const module = routeToModule(theta, stage);
      availableItems = [...getItemsForStage(module)];
      if (availableItems.length === 0) availableItems = [...readingItems.filter(i => i.level === 'B1')];
      currentItem = selectNextItem(theta, availableItems);
    } else if (section === 'listening') {
      const module = routeToModule(theta, stage);
      availableItems = [...getListeningItemsForStage(module)];
      if (availableItems.length === 0) availableItems = [...listeningItems.filter(i => i.level === 'B1')];
      currentItem = selectNextItem(theta, availableItems);
    }

    render();
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay();
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        finishExam();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const el = document.getElementById('exam-timer');
    if (!el) return;
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    el.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    if (timeRemaining < 120) el.style.color = 'var(--color-danger-400)';
    else if (timeRemaining < 300) el.style.color = 'var(--color-warning-400)';
  }

  function render() {
    let content = '';

    if (currentSection === 'reading' || currentSection === 'listening') {
      content = renderReceptiveQuestion();
    } else if (currentSection === 'writing') {
      content = renderWritingSection();
    } else if (currentSection === 'speaking') {
      content = renderSpeakingSection();
    } else if (currentSection === 'grammar') {
      // Grammar uses the same engine as reading
      content = renderReceptiveQuestion();
    }

    container.innerHTML = `
      <div class="exam-runner">
        <!-- Exam Header -->
        <div class="exam-header">
          <div class="exam-header__inner container">
            <div class="flex items-center gap-3">
              <div class="navbar__brand-icon">E</div>
              <div>
                <div class="text-sm" style="font-weight:600;text-transform:capitalize;">${currentSection} Section</div>
                <div class="text-xs text-secondary">Stage ${stage} · ${examType.charAt(0).toUpperCase() + examType.slice(1)} Test</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="exam-stage-indicator">
                ${sections.map((s, i) => `
                  <div class="stage-dot ${s === currentSection ? 'active' : sections.indexOf(currentSection) > i ? 'completed' : ''}" 
                       title="${s}">
                    ${sections.indexOf(currentSection) > i ? '✓' : i + 1}
                  </div>
                `).join('<div class="stage-line"></div>')}
              </div>
              <div class="exam-timer ${timeRemaining < 120 ? 'urgent' : ''}" id="exam-timer">
                ${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="progress" style="border-radius:0;height:4px;">
            <div class="progress__bar" id="exam-progress" style="width:${getProgress()}%"></div>
          </div>
        </div>

        <!-- Exam Content -->
        <div class="exam-content container animate-fade-in" id="exam-content">
          ${content}
        </div>

        <!-- Adaptive Level Indicator -->
        <div class="level-indicator" id="level-indicator">
          <div class="text-xs text-tertiary">Current Estimate</div>
          <div class="flex items-center gap-2">
            <span class="badge badge--primary badge--cefr" style="font-size:0.8rem; padding:4px 10px;">
              ${scoreToCEFR(thetaToScore(theta))}
            </span>
            <span class="text-xs text-secondary">${thetaToScore(theta)} pts</span>
          </div>
        </div>
      </div>
    `;

    setupEventListeners();
  }

  function renderReceptiveQuestion() {
    if (!currentItem) return '<div class="card" style="text-align:center;padding:40px;"><h3>Section Complete</h3><p class="text-secondary">Moving to next section...</p></div>';

    const item = currentItem;
    let questionHTML = '';

    if (item.type === 'multiple-choice') {
      questionHTML = `
        <div class="question-card card animate-slide-up">
          <div class="question-card__header">
            <span class="badge badge--primary">Question ${currentItemIndex + 1}</span>
            <span class="text-xs text-tertiary">Difficulty: ${getDifficultyLabel(item.difficulty)}</span>
          </div>
          
          ${currentSection === 'listening' ? `
            <div class="audio-player-container" style="margin:20px 0;">
              <button class="btn btn--secondary btn--lg" id="btn-play-audio" style="width:100%;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Play Audio
              </button>
              <div class="text-xs text-tertiary text-center" style="margin-top:8px;">You may play the audio up to 2 times</div>
            </div>
          ` : `
            <div class="passage-text">
              <p>${item.passage.replace(/\n/g, '<br/>')}</p>
            </div>
          `}
          
          <div class="question-text">
            <h4>${item.question}</h4>
          </div>
          
          <div class="options-grid">
            ${item.options.map((opt, i) => `
              <button class="option-btn" data-option="${i}" id="option-${i}">
                <div class="option-letter">${String.fromCharCode(65 + i)}</div>
                <div class="option-text">${opt}</div>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else if (item.type === 'cloze') {
      questionHTML = `
        <div class="question-card card animate-slide-up">
          <div class="question-card__header">
            <span class="badge badge--primary">Question ${currentItemIndex + 1}</span>
            <span class="badge badge--warning">Gap Fill</span>
          </div>
          <div class="passage-text">
            <p>${renderClozePassage(item)}</p>
          </div>
          <div class="flex justify-center" style="margin-top:24px;">
            <button class="btn btn--primary" id="btn-submit-cloze">Submit Answers</button>
          </div>
        </div>
      `;
    } else if (item.type === 'matching') {
      questionHTML = `
        <div class="question-card card animate-slide-up">
          <div class="question-card__header">
            <span class="badge badge--primary">Question ${currentItemIndex + 1}</span>
            <span class="badge badge--warning">Matching</span>
          </div>
          <div class="passage-text">
            <p>${item.passage.replace(/\n/g, '<br/>')}</p>
          </div>
          <div class="matching-grid" style="margin-top:20px;">
            ${item.items.map((it, i) => `
              <div class="matching-row flex items-center gap-3" style="margin-bottom:12px;">
                <span class="badge badge--primary" style="min-width:80px;">${it}</span>
                <span>→</span>
                <select class="input" data-match="${i}" style="max-width:200px;">
                  <option value="">Select...</option>
                  ${item.matches.map((m, j) => `<option value="${j}">${m}</option>`).join('')}
                </select>
              </div>
            `).join('')}
          </div>
          <div class="flex justify-center" style="margin-top:24px;">
            <button class="btn btn--primary" id="btn-submit-matching">Submit</button>
          </div>
        </div>
      `;
    } else if (item.type === 'categorization') {
      questionHTML = `
        <div class="question-card card animate-slide-up">
          <div class="question-card__header">
            <span class="badge badge--primary">Question ${currentItemIndex + 1}</span>
            <span class="badge badge--warning">Categorization</span>
          </div>
          <div class="passage-text"><p>${item.passage}</p></div>
          <div class="categorization-grid" style="margin-top:20px;">
            ${item.items.map((it, i) => `
              <div class="cat-row flex items-center gap-3" style="margin-bottom:12px;">
                <span class="text-sm" style="flex:1;">${it.text}</span>
                <select class="input" data-cat="${i}" style="max-width:180px;">
                  <option value="">Select...</option>
                  ${item.categories.map((c, j) => `<option value="${j}">${c}</option>`).join('')}
                </select>
              </div>
            `).join('')}
          </div>
          <div class="flex justify-center" style="margin-top:24px;">
            <button class="btn btn--primary" id="btn-submit-categorization">Submit</button>
          </div>
        </div>
      `;
    }

    return questionHTML;
  }

  function renderClozePassage(item) {
    const parts = item.passage.split('___');
    let html = '';
    for (let i = 0; i < parts.length; i++) {
      html += parts[i];
      if (i < item.blanks.length) {
        html += `<select class="cloze-select input" data-blank="${i}" style="display:inline;width:auto;min-width:120px;margin:0 4px;">
          <option value="">...</option>
          ${item.blanks[i].options.map((o, j) => `<option value="${j}">${o}</option>`).join('')}
        </select>`;
      }
    }
    return html;
  }

  function renderWritingSection() {
    const level = scoreToCEFR(thetaToScore(theta));
    const prompt = writingPrompts.find(p => p.level === level) || writingPrompts[2];

    return `
      <div class="writing-section animate-slide-up">
        <div class="card" style="margin-bottom:24px;">
          <div class="card__header">
            <div class="card__icon">✍️</div>
            <div>
              <div class="card__title">${prompt.title}</div>
              <div class="card__subtitle">${prompt.type.charAt(0).toUpperCase() + prompt.type.slice(1)} · ${prompt.wordRange[0]}-${prompt.wordRange[1]} words · ${prompt.timeMinutes} min</div>
            </div>
          </div>
          <div class="divider" style="margin:16px 0;"></div>
          <p class="text-secondary">${prompt.prompt}</p>
        </div>
        
        <div class="card">
          <textarea class="input textarea" id="writing-editor" rows="12" 
            placeholder="Start writing your response here..." 
            style="font-size:1rem;line-height:1.8;">${writingText}</textarea>
          <div class="flex justify-between items-center" style="margin-top:12px;">
            <div class="text-sm">
              <span id="word-count" class="text-secondary">0 words</span>
              <span class="text-tertiary"> · Target: ${prompt.wordRange[0]}-${prompt.wordRange[1]}</span>
            </div>
            <button class="btn btn--primary" id="btn-submit-writing" data-prompt-id="${prompt.id}">
              Submit Writing
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderSpeakingSection() {
    const level = scoreToCEFR(thetaToScore(theta));
    const prompt = speakingPrompts.find(p => p.level === level) || speakingPrompts[2];

    return `
      <div class="speaking-section animate-slide-up">
        <div class="card" style="margin-bottom:24px;">
          <div class="card__header">
            <div class="card__icon">🎙️</div>
            <div>
              <div class="card__title">${prompt.title}</div>
              <div class="card__subtitle">Preparation: ${prompt.prepTime}s · Response: ${prompt.responseTime}s</div>
            </div>
          </div>
          <div class="divider" style="margin:16px 0;"></div>
          <p class="text-secondary">${prompt.prompt}</p>
        </div>
        
        <div class="card" style="text-align:center;">
          <div class="speaking-timer" id="speaking-timer" style="font-size:3rem;font-family:var(--font-display);font-weight:700;">
            ${prompt.responseTime}s
          </div>
          <div class="recording-indicator" id="recording-indicator" style="margin:20px 0;">
            <div class="waveform" id="waveform">
              ${Array(20).fill(0).map((_, i) => `<div class="waveform-bar" style="animation-delay:${i * 0.05}s;"></div>`).join('')}
            </div>
            <p class="text-secondary text-sm" style="margin-top:12px;">Click the button below to start recording</p>
          </div>
          
          <div class="flex justify-center gap-4" style="margin-top:24px;">
            <button class="btn btn--primary btn--lg" id="btn-start-recording" data-prompt='${JSON.stringify({ id: prompt.id, responseTime: prompt.responseTime })}'>
              🎤 Start Recording
            </button>
            <button class="btn btn--secondary btn--lg" id="btn-stop-recording" style="display:none;">
              ⏹️ Stop Recording
            </button>
          </div>
          
          <button class="btn btn--outline" id="btn-skip-speaking" style="margin-top:16px;">
            Skip Speaking Section
          </button>
        </div>
      </div>
    `;
  }

  function setupEventListeners() {
    // Multiple choice options
    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => handleMCQAnswer(parseInt(btn.dataset.option)));
    });

    // Audio play
    const playBtn = document.getElementById('btn-play-audio');
    if (playBtn) {
      let playCount = 0;
      playBtn.addEventListener('click', async () => {
        if (playCount >= 2) return;
        playCount++;
        playBtn.disabled = true;
        playBtn.innerHTML = '<div class="spinner-small"></div> Playing...';
        try {
          await speakText(currentItem.transcript, currentItem.voice, currentItem.speakingRate || 1.0);
        } catch (e) { console.warn('TTS error:', e); }
        playBtn.disabled = false;
        playBtn.innerHTML = `▶ Play Again (${2 - playCount} remaining)`;
        if (playCount >= 2) {
          playBtn.disabled = true;
          playBtn.innerHTML = '✓ Audio played';
        }
      });
    }

    // Cloze submit
    document.getElementById('btn-submit-cloze')?.addEventListener('click', handleClozeSubmit);

    // Matching submit
    document.getElementById('btn-submit-matching')?.addEventListener('click', handleMatchingSubmit);

    // Categorization submit
    document.getElementById('btn-submit-categorization')?.addEventListener('click', handleCategorizationSubmit);

    // Writing editor
    const editor = document.getElementById('writing-editor');
    if (editor) {
      editor.addEventListener('input', () => {
        writingText = editor.value;
        const words = editor.value.trim().split(/\s+/).filter(w => w.length > 0);
        document.getElementById('word-count').textContent = `${words.length} words`;
      });
    }

    // Writing submit
    document.getElementById('btn-submit-writing')?.addEventListener('click', handleWritingSubmit);

    // Speaking recording
    document.getElementById('btn-start-recording')?.addEventListener('click', startRecording);
    document.getElementById('btn-stop-recording')?.addEventListener('click', stopRecording);
    document.getElementById('btn-skip-speaking')?.addEventListener('click', () => {
      sectionScores.speaking = 35;
      advanceSection();
    });
  }

  function handleMCQAnswer(selected) {
    const item = currentItem;
    const correct = selected === item.correct;

    // Visual feedback
    const options = container.querySelectorAll('.option-btn');
    options.forEach((opt, i) => {
      opt.disabled = true;
      if (i === item.correct) opt.classList.add('correct');
      if (i === selected && !correct) opt.classList.add('incorrect');
    });

    // Calculate anti-guess weight
    const weight = antiGuessWeight(correct, theta, item.difficulty);

    responses.push({ correct, difficulty: item.difficulty, weight, itemId: item.id });
    theta = estimateTheta(responses);
    currentItemIndex++;

    // Remove used item
    availableItems = availableItems.filter(i => i.id !== item.id);

    // Check stage transition
    const minItems = examType === 'quick' ? 5 : 3;
    if (currentItemIndex % minItems === 0 && stage < 3) {
      stage++;
      const newModule = routeToModule(theta, stage);
      const newItems = currentSection === 'reading'
        ? getItemsForStage(newModule)
        : getListeningItemsForStage(newModule);
      if (newItems.length > 0) {
        availableItems = [...newItems.filter(i => !responses.find(r => r.itemId === i.id))];
      }
    }

    // Check stopping criteria
    const maxItems = examType === 'quick' ? 15 : 10;
    const seThreshold = examType === 'quick' ? 0.45 : 0.32;

    setTimeout(() => {
      if (shouldStopTest(responses, theta, minItems + 2, maxItems, seThreshold) || availableItems.length === 0) {
        sectionScores[currentSection] = thetaToScore(theta);
        advanceSection();
      } else {
        currentItem = selectNextItem(theta, availableItems);
        render();
      }
    }, 800);
  }

  function handleClozeSubmit() {
    const item = currentItem;
    let correctCount = 0;
    item.blanks.forEach((blank, i) => {
      const select = container.querySelector(`[data-blank="${i}"]`);
      if (select && parseInt(select.value) === blank.correct) correctCount++;
    });
    const ratio = correctCount / item.blanks.length;
    const correct = ratio >= 0.6;
    const weight = antiGuessWeight(correct, theta, item.difficulty);
    responses.push({ correct, difficulty: item.difficulty, weight, itemId: item.id });
    theta = estimateTheta(responses);
    currentItemIndex++;
    availableItems = availableItems.filter(i => i.id !== item.id);

    const maxItems = examType === 'quick' ? 15 : 10;
    if (shouldStopTest(responses, theta, 5, maxItems) || availableItems.length === 0) {
      sectionScores[currentSection] = thetaToScore(theta);
      advanceSection();
    } else {
      currentItem = selectNextItem(theta, availableItems);
      render();
    }
  }

  function handleMatchingSubmit() {
    const item = currentItem;
    let correctCount = 0;
    item.items.forEach((_, i) => {
      const select = container.querySelector(`[data-match="${i}"]`);
      if (select && parseInt(select.value) === item.correctPairs[i]) correctCount++;
    });
    const correct = correctCount >= item.items.length * 0.6;
    const weight = antiGuessWeight(correct, theta, item.difficulty);
    responses.push({ correct, difficulty: item.difficulty, weight, itemId: item.id });
    theta = estimateTheta(responses);
    currentItemIndex++;
    availableItems = availableItems.filter(i => i.id !== item.id);

    if (availableItems.length === 0 || shouldStopTest(responses, theta, 5, 15)) {
      sectionScores[currentSection] = thetaToScore(theta);
      advanceSection();
    } else {
      currentItem = selectNextItem(theta, availableItems);
      render();
    }
  }

  function handleCategorizationSubmit() {
    const item = currentItem;
    let correctCount = 0;
    item.items.forEach((_, i) => {
      const select = container.querySelector(`[data-cat="${i}"]`);
      if (select && parseInt(select.value) === item.items[i].correct) correctCount++;
    });
    const correct = correctCount >= item.items.length * 0.6;
    const weight = antiGuessWeight(correct, theta, item.difficulty);
    responses.push({ correct, difficulty: item.difficulty, weight, itemId: item.id });
    theta = estimateTheta(responses);
    currentItemIndex++;
    availableItems = availableItems.filter(i => i.id !== item.id);

    if (availableItems.length === 0 || shouldStopTest(responses, theta, 5, 15)) {
      sectionScores[currentSection] = thetaToScore(theta);
      advanceSection();
    } else {
      currentItem = selectNextItem(theta, availableItems);
      render();
    }
  }

  function handleWritingSubmit() {
    const editor = document.getElementById('writing-editor');
    const text = editor?.value || '';
    const prompt = writingPrompts.find(p => p.id === document.getElementById('btn-submit-writing')?.dataset.promptId) || writingPrompts[2];

    const result = gradeWriting(text, prompt);
    sectionScores.writing = result.totalScore;

    // Store detailed results
    setState('results.writingDetails', result);

    advanceSection();
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const duration = (Date.now() - recordingStartTime) / 1000;
        const scoreResult = gradeSpeaking({
          wpm: calculateWPM(Math.round(duration * 2), duration), // Estimated
          hesitationRatio: 15 + Math.random() * 15,
          durationSeconds: duration,
        });
        sectionScores.speaking = scoreResult.totalScore;
        setState('results.speakingDetails', scoreResult);
        advanceSection();
      };

      mediaRecorder.start();
      isRecording = true;
      recordingStartTime = Date.now();

      document.getElementById('btn-start-recording').style.display = 'none';
      document.getElementById('btn-stop-recording').style.display = '';
      document.getElementById('recording-indicator').classList.add('active');

      // Auto-stop after time limit
      const promptData = JSON.parse(document.getElementById('btn-start-recording').dataset.prompt);
      setTimeout(() => {
        if (isRecording) stopRecording();
      }, promptData.responseTime * 1000);

      // Countdown
      let remaining = promptData.responseTime;
      const timer = setInterval(() => {
        remaining--;
        const timerEl = document.getElementById('speaking-timer');
        if (timerEl) timerEl.textContent = `${remaining}s`;
        if (remaining <= 0) clearInterval(timer);
      }, 1000);

    } catch (e) {
      console.warn('Microphone error:', e);
      sectionScores.speaking = 35;
      advanceSection();
    }
  }

  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
    }
  }

  function advanceSection() {
    const currentIdx = sections.indexOf(currentSection);
    if (currentIdx < sections.length - 1) {
      // Load next section
      theta = 0;
      responses = [];
      stage = 1;
      loadSection(sections[currentIdx + 1]);
    } else {
      finishExam();
    }
  }

  function finishExam() {
    clearInterval(timerInterval);

    const se = standardError(theta, responses);
    const overallScore = Object.values(sectionScores).reduce((a, b) => a + b, 0) / Object.keys(sectionScores).length;

    setState('results.score', Math.round(overallScore));
    setState('results.theta', theta);
    setState('results.cefrLevel', scoreToCEFR(Math.round(overallScore)));
    setState('results.cefrRange', scoreToRange(Math.round(overallScore), se));
    setState('results.standardError', se);
    setState('results.skillScores', {
      reading: sectionScores.reading || null,
      listening: sectionScores.listening || null,
      writing: sectionScores.writing || null,
      speaking: sectionScores.speaking || null,
    });
    setState('results.completedAt', new Date().toISOString());
    setState('exam.status', 'completed');

    navigate('/results');
  }

  function getProgress() {
    const sectionIdx = sections.indexOf(currentSection);
    const sectionProgress = (sectionIdx / sections.length) * 100;
    const itemProgress = (currentItemIndex / 15) * (100 / sections.length);
    return Math.min(100, sectionProgress + itemProgress);
  }

  function getDifficultyLabel(d) {
    if (d < -1.5) return '🟢 Basic';
    if (d < -0.5) return '🟡 Elementary';
    if (d < 0.5) return '🟠 Intermediate';
    if (d < 1.5) return '🔴 Advanced';
    return '🟣 Expert';
  }

  init();

  return {
    destroy() {
      clearInterval(timerInterval);
      if (mediaRecorder && isRecording) mediaRecorder.stop();
    }
  };
}
