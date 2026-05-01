import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../../contexts/AuthContext';

const AdminGame = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('progress');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState('Articulate Novice');
  const [progress, setProgress] = useState({
    vocabulary: 0,
    conciseness: 0,
    speech: 0,
    totalScore: 0
  });

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('growthOfficerProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed.progress || progress);
      setScore(parsed.score || 0);
      setStreak(parsed.streak || 0);
      setLevel(parsed.level || 'Articulate Novice');
    }
  }, []);

  // Save progress
  const saveProgress = useCallback((newProgress, newScore, newStreak, newLevel) => {
    const data = {
      progress: newProgress,
      score: newScore,
      streak: newStreak,
      level: newLevel,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('growthOfficerProgress', JSON.stringify(data));
    setProgress(newProgress);
    setScore(newScore);
    setStreak(newStreak);
    setLevel(newLevel);
  }, []);

  // Company-themed vocabulary terms (relevant to growth, publishing, data, accessibility)
  const vocabularyTerms = [
    {
      word: 'Metrics',
      definition: 'Quantitative measurements used to track performance, growth, and success of digital products and publishing initiatives at Accessible Publishers Ltd.',
      example: 'Our key metrics show a 45% increase in e-book downloads this quarter.'
    },
    {
      word: 'KPIs',
      definition: 'Key Performance Indicators - specific metrics that measure progress toward strategic goals like expanding accessible formats (audio, Braille, animations).',
      example: 'We track KPIs such as user engagement rate and conversion from print to digital.'
    },
    {
      word: 'Optimization',
      definition: 'The process of improving efficiency, accessibility, and user experience in our publishing pipeline and digital products.',
      example: 'Content optimization ensures our materials reach students with diverse needs across Nigeria.'
    },
    {
      word: 'VICAP',
      definition: 'Core values at Accessible Publishers: Vision, Innovation, Creativity, Accessibility, Professionalism - guiding our growth strategies.',
      example: 'Our VICAP values drive us to innovate accessible educational materials for all learners.'
    },
    {
      word: 'Stakeholder',
      definition: 'Partners, ministries of education, schools, booksellers, and readers whose needs we address through eloquent presentations and reports.',
      example: 'Effective communication with stakeholders helps secure recommendations for our titles.'
    },
    {
      word: 'Articulation',
      definition: 'Clear, precise expression of ideas - essential for representing the MD and winning partners through confident speech.',
      example: 'Strong articulation transforms complex data into compelling growth narratives.'
    },
    {
      word: 'Accessibility',
      definition: 'Making publications available in multiple formats (print, e-book, audio, Braille, animations) to ensure inclusive education.',
      example: 'Our commitment to accessibility sets us apart in the Nigerian publishing industry.'
    }
  ];

  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [vocabScore, setVocabScore] = useState(0);
  const [showVocabFeedback, setShowVocabFeedback] = useState(false);

  // Conciseness exercises
  const concisenessExercises = [
    {
      original: 'We would like to take this opportunity to inform all our valued stakeholders and partners that we have observed a significant improvement in the overall performance metrics associated with our recently launched digital transformation initiative which aims to make all of our educational publications available in various accessible formats including but not limited to electronic books, audio recordings, animated content and Braille versions.',
      targetShort: 'Our digital initiative has improved metrics, expanding accessible formats (e-books, audio, animations, Braille) for all stakeholders.',
      keywords: ['digital', 'metrics', 'accessible', 'formats', 'e-books', 'audio', 'Braille']
    },
    {
      original: 'In light of the fact that the Managing Director is unable to attend the upcoming industry conference due to prior commitments, it has been determined that I will be representing our esteemed organization and I would like to request your assistance in helping me prepare a comprehensive presentation that effectively communicates our vision for the future of publishing in Africa with particular emphasis on technological innovation and inclusive education.',
      targetShort: 'As the MD cannot attend the conference, I will represent Accessible Publishers. Please help prepare a presentation on our vision for innovative, inclusive African publishing.',
      keywords: ['represent', 'MD', 'conference', 'presentation', 'vision', 'innovation', 'inclusive']
    }
  ];

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userShortened, setUserShortened] = useState('');
  const [concisenessFeedback, setConcisenessFeedback] = useState('');
  const [concisenessScore, setConcisenessScore] = useState(0);

  // Speech prompts
  const speechPrompts = [
    {
      type: 'Welcome Address',
      prompt: 'Write a short, confident welcome address for a stakeholder meeting at Accessible Publishers Ltd, highlighting our VICAP values and commitment to accessible education.',
      example: 'Distinguished stakeholders, welcome to Accessible Publishers. Guided by our VICAP values, we pioneer accessible educational materials across print, digital, and inclusive formats to empower every learner in Nigeria and beyond.'
    },
    {
      type: 'Growth Report Pitch',
      prompt: 'Craft a compelling 30-second pitch on our Q2 growth metrics and optimization strategies for digital products.',
      example: 'Our Q2 metrics reveal 52% growth in audio book adoption. Through strategic optimization and VICAP-driven innovation, we\'ve expanded accessibility, positioning Accessible Publishers as Africa\'s leader in inclusive publishing.'
    }
  ];

  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [userSpeech, setUserSpeech] = useState('');
  const [speechFeedback, setSpeechFeedback] = useState('');
  const [speechScore, setSpeechScore] = useState(0);

  // Text-to-Speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported in your browser. Practice reading aloud!');
    }
  };

  // Vocabulary quiz logic
  const handleVocabAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowVocabFeedback(true);
    
    const isCorrect = answer === 'correct'; // Simplified - in real would match definition or MCQ
    const points = isCorrect ? 10 : 0;
    const newVocabScore = vocabScore + points;
    setVocabScore(newVocabScore);

    setTimeout(() => {
      setShowVocabFeedback(false);
      setSelectedAnswer('');
      const nextIndex = (currentVocabIndex + 1) % vocabularyTerms.length;
      setCurrentVocabIndex(nextIndex);
      
      const newProgress = { ...progress, vocabulary: Math.min(100, progress.vocabulary + (isCorrect ? 15 : 5)) };
      const newTotalScore = score + points;
      const newStreakVal = isCorrect ? streak + 1 : Math.max(0, streak - 1);
      let newLvl = level;
      
      if (newTotalScore > 150) newLvl = 'Confident Orator';
      else if (newTotalScore > 80) newLvl = 'Eloquent Presenter';
      
      saveProgress(newProgress, newTotalScore, newStreakVal, newLvl);
    }, 1500);
  };

  // Simplified MCQ for vocab - better UX
  const getVocabOptions = (term) => {
    const correct = term.definition.substring(0, 60) + '...';
    const wrong1 = 'A general term for any kind of measurement in business.';
    const wrong2 = 'A type of book format used only in traditional printing.';
    return [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);
  };

  const checkConciseness = () => {
    if (!userShortened.trim()) {
      setConcisenessFeedback('Please enter a shortened version.');
      return;
    }

    const exercise = concisenessExercises[currentExerciseIndex];
    const userText = userShortened.toLowerCase();
    let points = 0;
    let feedbackText = '';

    // Simple scoring based on length reduction and keywords
    const originalLength = exercise.original.length;
    const userLength = userShortened.length;
    const reduction = Math.max(0, Math.floor(((originalLength - userLength) / originalLength) * 100));
    
    const keywordMatches = exercise.keywords.filter(kw => userText.includes(kw.toLowerCase())).length;
    points = Math.min(20, Math.floor(reduction / 3) + keywordMatches * 5);
    
    if (points > 15) {
      feedbackText = 'Excellent! Clear, concise, and professional. Great articulation practice.';
    } else if (points > 8) {
      feedbackText = 'Good effort. Try to be even more direct while keeping key publishing metrics and vision.';
    } else {
      feedbackText = 'Focus on brevity. Remove filler words. Remember: represent the MD with impact and confidence.';
    }

    setConcisenessFeedback(feedbackText);
    const newConcisenessScore = concisenessScore + points;
    setConcisenessScore(newConcisenessScore);

    const newProgress = { 
      ...progress, 
      conciseness: Math.min(100, progress.conciseness + Math.floor(points / 2)) 
    };
    const newTotal = score + points;
    const newStreakVal = streak + 1;
    let newLvl = level;
    if (newTotal > 150) newLvl = 'Confident Orator';
    else if (newTotal > 80) newLvl = 'Eloquent Presenter';

    saveProgress(newProgress, newTotal, newStreakVal, newLvl);

    setTimeout(() => {
      setUserShortened('');
      setConcisenessFeedback('');
      const nextIdx = (currentExerciseIndex + 1) % concisenessExercises.length;
      setCurrentExerciseIndex(nextIdx);
    }, 3000);
  };

  const checkSpeech = () => {
    if (!userSpeech.trim()) {
      setSpeechFeedback('Please write your speech or address.');
      return;
    }

    const prompt = speechPrompts[currentSpeechIndex];
    let points = 15; // Base
    let feedbackText = 'Strong work! Your writing demonstrates growing confidence and professional articulation suitable for representing Accessible Publishers. ';

    const wordCount = userSpeech.trim().split(/\s+/).length;
    if (wordCount < 40) {
      feedbackText += 'Consider adding more specific metrics and VICAP references for greater impact.';
      points = 10;
    } else if (wordCount > 120) {
      feedbackText += 'Excellent depth, but practice shortening for confident delivery (aim for 60-90 words).';
      points = 18;
    } else {
      feedbackText += 'Perfect balance of clarity, persuasion, and professionalism. Practice delivering it aloud using the speak button.';
      points = 25;
    }

    setSpeechFeedback(feedbackText);
    const newSpeechScore = speechScore + points;
    setSpeechScore(newSpeechScore);

    const newProgress = { 
      ...progress, 
      speech: Math.min(100, progress.speech + 20),
      totalScore: Math.min(100, (progress.vocabulary + progress.conciseness + progress.speech) / 3)
    };
    
    const newTotalScore = score + points;
    const newStreakVal = streak + 1;
    let newLvl = 'Confident Orator';
    if (newTotalScore < 60) newLvl = 'Eloquent Presenter';
    else if (newTotalScore < 30) newLvl = 'Articulate Novice';

    saveProgress(newProgress, newTotalScore, newStreakVal, newLvl);

    setTimeout(() => {
      setUserSpeech('');
      setSpeechFeedback('');
      const nextIdx = (currentSpeechIndex + 1) % speechPrompts.length;
      setCurrentSpeechIndex(nextIdx);
    }, 4000);
  };

  const resetProgress = () => {
    const resetData = {
      vocabulary: 0,
      conciseness: 0,
      speech: 0,
      totalScore: 0
    };
    saveProgress(resetData, 0, 0, 'Articulate Novice');
    setVocabScore(0);
    setConcisenessScore(0);
    setSpeechScore(0);
    setCurrentVocabIndex(0);
    setCurrentExerciseIndex(0);
    setCurrentSpeechIndex(0);
    localStorage.removeItem('growthOfficerProgress');
  };

  const tabs = [
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'vocabulary', label: 'Vocabulary', icon: '📚' },
    { id: 'conciseness', label: 'Conciseness', icon: '✂️' },
    { id: 'speech', label: 'Speech Practice', icon: '🎤' }
  ];

  return (
    <AdminLayout
      eyebrow="Growth Officer Academy"
      title="Master Articulation & Professional Speech"
      description="Build the confidence to represent the MD, deliver compelling data-driven presentations, win stakeholders, and grow Accessible Publishers' digital products. Practice vocabulary, conciseness, and speech writing tailored to publishing, metrics, optimization, and VICAP values. Only admins access this training ground."
      stats={[
        { 
          label: 'Current Level', 
          value: level, 
          helper: `${score} pts • ${streak} day streak` 
        },
        { 
          label: 'Mastery', 
          value: `${Math.round((progress.vocabulary + progress.conciseness + progress.speech) / 3)}%`, 
          helper: 'Overall English proficiency' 
        },
        { 
          label: 'Sessions', 
          value: '12', 
          helper: 'Practice sessions completed' 
        },
        { 
          label: 'Company Impact', 
          value: 'High', 
          helper: 'Ready to represent MD' 
        }
      ]}
      actions={
        <button
          onClick={resetProgress}
          className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50"
        >
          Reset Progress
        </button>
      }
    >
      <div className="rounded-4xl border border-white/70 bg-white/80 p-5 sm:p-6 lg:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        {/* Tabs - Mobile optimized horizontal scroll */}
        <div className="flex border-b border-slate-200 mb-6 sm:mb-8 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-semibold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap shrink-0 snap-start active:scale-95 min-w-0 ${
                activeTab === tab.id 
                  ? 'border-slate-950 text-slate-950' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="text-xl shrink-0">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs font-medium">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-8">
            <div className="text-center px-2">
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-emerald-400 to-blue-600 flex items-center justify-center text-5xl mb-6 shadow-inner">
                👑
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-slate-950 mb-3">Welcome, Growth Officer</h3>
              <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed px-2">
                Your journey to becoming the MD's trusted representative begins here. 
                Practice daily to speak with the eloquence of kings and presidents.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 rounded-3xl bg-emerald-50 px-5 py-2.5 text-emerald-700 text-xs sm:text-sm font-medium mx-auto">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Accessible Publishers Ltd • Ibadan
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-5 sm:p-6">
                <div className="text-emerald-600 text-xs font-semibold tracking-widest">VOCABULARY</div>
                <div className="text-4xl sm:text-5xl font-semibold text-emerald-700 mt-3">{progress.vocabulary}%</div>
                <div className="h-2 bg-emerald-200 rounded-full mt-4">
                  <div className="h-2 bg-emerald-600 rounded-full" style={{width: `${progress.vocabulary}%`}}></div>
                </div>
                <p className="text-xs text-emerald-600/70 mt-4 leading-tight">Business terms, metrics, publishing jargon</p>
              </div>
              
              <div className="rounded-3xl border border-amber-100 bg-amber-50/80 p-5 sm:p-6">
                <div className="text-amber-600 text-xs font-semibold tracking-widest">CONCISENESS</div>
                <div className="text-4xl sm:text-5xl font-semibold text-amber-700 mt-3">{progress.conciseness}%</div>
                <div className="h-2 bg-amber-200 rounded-full mt-4">
                  <div className="h-2 bg-amber-600 rounded-full" style={{width: `${progress.conciseness}%`}}></div>
                </div>
                <p className="text-xs text-amber-600/70 mt-4 leading-tight">Shorten reports, emails, presentations</p>
              </div>
              
              <div className="rounded-3xl border border-blue-100 bg-blue-50/80 p-5 sm:p-6">
                <div className="text-blue-600 text-xs font-semibold tracking-widest">SPEECH</div>
                <div className="text-4xl sm:text-5xl font-semibold text-blue-700 mt-3">{progress.speech}%</div>
                <div className="h-2 bg-blue-200 rounded-full mt-4">
                  <div className="h-2 bg-blue-600 rounded-full" style={{width: `${progress.speech}%`}}></div>
                </div>
                <p className="text-xs text-blue-600/70 mt-4 leading-tight">Welcome addresses, pitches, Q&amp;A</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
              <h4 className="font-semibold mb-6 flex items-center gap-3">
                <span className="text-xl">🏆</span> YOUR GROWTH JOURNEY
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-3 border-b">
                  <span>Current Streak</span>
                  <span className="font-mono font-semibold text-emerald-600">{streak} days 🔥</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span>Total Points Earned</span>
                  <span className="font-mono font-semibold">{score} pts</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span>Current Level</span>
                  <span className="px-4 py-1 bg-slate-900 text-white text-xs rounded-full font-medium">{level}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span>Next Milestone</span>
                  <span className="text-slate-500">Confident Orator (200 pts)</span>
                </div>
              </div>
              <p className="mt-8 text-xs text-slate-500 italic border-l-2 border-slate-300 pl-4">
                "The growth of our company depends not only on great books, but on leaders who can articulate our vision with power and clarity." 
                <br />— Growth Officer Training, Accessible Publishers Ltd
              </p>
            </div>
          </div>
        )}

        {/* Vocabulary Tab */}
        {activeTab === 'vocabulary' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">Vocabulary Mastery</h3>
              <p className="text-slate-600 text-sm sm:text-base">Complete the sentence with the most precise professional term. Then speak it aloud.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <div className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-3xl font-medium">Score: {vocabScore}</div>
                <button 
                  onClick={() => speak(vocabularyTerms[currentVocabIndex].definition)} 
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition px-5 py-2 rounded-3xl border border-slate-200 active:bg-slate-50"
                >
                  🔊 Hear Definition
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
              <div className="text-xs uppercase tracking-[0.125em] text-slate-500 mb-3">TERM #{currentVocabIndex + 1} • FILL IN THE BLANK</div>
              <div className="text-3xl sm:text-4xl font-semibold text-slate-950 mb-6 tracking-tight">
                {vocabularyTerms[currentVocabIndex].word}
              </div>
              <div className="text-slate-600 mb-8 leading-relaxed text-sm sm:text-[15px]">
                {vocabularyTerms[currentVocabIndex].example}
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase font-semibold tracking-widest text-slate-400 mb-4">Choose the best definition (then speak the full sentence aloud):</p>
                {getVocabOptions(vocabularyTerms[currentVocabIndex]).map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVocabAnswer(option.includes('measurements') || option.includes('definition') || option.includes('Quantitative') ? 'correct' : 'wrong')}
                    className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all text-sm hover:shadow-md active:scale-[0.985] ${
                      selectedAnswer && showVocabFeedback 
                        ? (option.includes('measurements') || option.includes('definition') || option.includes('Quantitative') ? 'border-emerald-500 bg-emerald-50' : 'border-red-200 bg-red-50 opacity-70')
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showVocabFeedback && (
                <div className={`mt-6 p-4 rounded-2xl text-sm ${selectedAnswer.includes('correct') ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-orange-50 border border-orange-200 text-orange-700'}`}>
                  {selectedAnswer.includes('correct') 
                    ? '✅ Excellent! This term is central to growth reporting and stakeholder communications at Accessible Publishers.' 
                    : '💡 Review the example. These terms help you speak confidently about our digital transformation and accessible publishing mission.'}
                </div>
              )}
            </div>

            <div className="mt-6 text-xs text-slate-500 flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-200"></div>
              TIP: Practice saying each term aloud with the speak button. Confidence comes from repetition.
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
          </div>
        )}

        {/* Conciseness Tab */}
        {activeTab === 'conciseness' && (
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-3">Conciseness Training</h3>
              <p className="text-slate-600 max-w-2xl">Transform long-winded reports and communications into powerful, succinct statements. Essential for presentations, emails to partners, and representing the MD effectively.</p>
              <div className="mt-4 inline-flex px-5 py-2 bg-amber-50 text-amber-700 rounded-3xl text-sm items-center gap-2">
                <span>Exercise {currentExerciseIndex + 1} of {concisenessExercises.length}</span>
                <span className="text-xs px-2 py-0.5 bg-amber-200 rounded">SCORE: {concisenessScore}</span>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-8 mb-8">
              <div className="uppercase text-[10px] font-mono tracking-[1px] text-amber-600 mb-3">ORIGINAL (VERBOSE)</div>
              <div className="text-slate-700 leading-relaxed text-[15px] italic border-l-4 border-amber-300 pl-6">
                "{concisenessExercises[currentExerciseIndex].original}"
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold tracking-widest text-slate-500 mb-3">
                YOUR CONCISE VERSION (professional, persuasive, under 50 words)
              </label>
              <textarea
                value={userShortened}
                onChange={(e) => setUserShortened(e.target.value)}
                className="w-full h-32 p-6 rounded-3xl border border-slate-200 focus:border-slate-400 focus:ring-1 bg-white resize-y text-slate-700 text-[15px] leading-relaxed"
                placeholder="Rewrite this professionally and concisely..."
              />
              <button
                onClick={checkConciseness}
                className="mt-4 w-full bg-slate-950 hover:bg-black text-white py-4 rounded-3xl font-semibold transition text-sm tracking-wider"
              >
                EVALUATE &amp; GET FEEDBACK
              </button>
            </div>

            {concisenessFeedback && (
              <div className="mt-6 p-6 rounded-3xl bg-white border border-emerald-100 text-slate-700">
                {concisenessFeedback}
                <div className="mt-4 text-xs text-emerald-600">💡 Pro tip: Use active voice and specific metrics when possible.</div>
              </div>
            )}
          </div>
        )}

        {/* Speech Practice Tab */}
        {activeTab === 'speech' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Speech &amp; Address Practice</h3>
              <p className="text-slate-600">Write, refine, and practice delivering powerful addresses. Build the skill to win partners and represent leadership with confidence.</p>
            </div>

            <div className="rounded-3xl bg-white border p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="uppercase text-xs font-semibold tracking-widest text-purple-500">PROMPT {currentSpeechIndex + 1}</div>
                  <div className="text-xl font-semibold text-slate-900 mt-1">
                    {speechPrompts[currentSpeechIndex].type}
                  </div>
                </div>
                <button 
                  onClick={() => speak(speechPrompts[currentSpeechIndex].example)}
                  className="flex items-center gap-2 text-xs border border-slate-300 hover:bg-slate-50 px-5 py-2 rounded-3xl transition"
                >
                  🔊 Listen to Example
                </button>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm text-slate-600 mb-8">
                {speechPrompts[currentSpeechIndex].prompt}
              </div>

              <textarea
                value={userSpeech}
                onChange={(e) => setUserSpeech(e.target.value)}
                className="w-full h-52 p-6 rounded-3xl border border-slate-200 focus-within:border-slate-400 bg-white text-slate-800 placeholder:text-slate-400 text-[15px]"
                placeholder="Write your speech here... Aim for clarity, confidence, and impact. Reference our mission, metrics, and VICAP values."
              />

              <div className="flex gap-4 mt-6">
                <button
                  onClick={checkSpeech}
                  className="flex-1 bg-slate-900 text-white py-4 rounded-3xl font-semibold hover:bg-slate-800 transition"
                >
                  SUBMIT FOR FEEDBACK
                </button>
                <button
                  onClick={() => speak(userSpeech || speechPrompts[currentSpeechIndex].example)}
                  disabled={!userSpeech && !speechPrompts[currentSpeechIndex].example}
                  className="flex-1 border border-slate-300 hover:bg-slate-50 py-4 rounded-3xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  🎤 PRACTICE DELIVERY (TTS)
                </button>
              </div>
            </div>

            {speechFeedback && (
              <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-8 text-emerald-800">
                <div className="font-semibold mb-4 flex items-center gap-2">
                  <span>📝 FEEDBACK FROM THE ROYAL COURT</span>
                </div>
                <p className="leading-relaxed">{speechFeedback}</p>
                <div className="mt-6 pt-6 border-t border-emerald-100 text-xs opacity-75">
                  Score awarded: +{Math.round(speechScore / 3)} • Practice aloud multiple times. Record yourself to eliminate filler words like "um" and project confidence like a president.
                </div>
              </div>
            )}

            <div className="text-xs bg-white/70 border border-slate-100 p-6 rounded-3xl text-slate-500">
              <strong>Pro Delivery Tips:</strong> Stand tall. Breathe. Pause for emphasis after key metrics. Use hand gestures. Speak at 120-150 words per minute. Your voice is your most powerful tool for growing the company.
            </div>
          </div>
        )}
      </div>

      {/* Footer motivation */}
      <div className="mt-12 text-center text-xs text-slate-400">
        Built for the Growth Officer of Accessible Publishers Limited • Practice makes perfect representation • From Ibadan to Africa and beyond
      </div>
    </AdminLayout>
  );
};

export default AdminGame;
