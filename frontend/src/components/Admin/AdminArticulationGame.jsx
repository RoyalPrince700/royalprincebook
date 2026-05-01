import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';

const segments = [
  { id: 'progress', label: 'Progress', helper: 'Your speaking growth' },
  { id: 'vocabulary', label: 'Precision Lab', helper: 'Choose exact field words' },
  { id: 'conciseness', label: 'Concise Rewrite', helper: 'Say more with fewer words' },
  { id: 'speech', label: 'Speech Builder', helper: 'Write confident addresses' },
  { id: 'presentation', label: 'Presentation Sim', helper: 'Pitch data and strategy' },
  { id: 'pronunciation', label: 'Delivery Drill', helper: 'Practice clear speech' }
];

const defaultProgress = {
  vocabulary: 0,
  conciseness: 0,
  speech: 0,
  presentation: 0,
  pronunciation: 0
};

const defaultSegmentScores = {
  vocabulary: 0,
  conciseness: 0,
  speech: 0,
  presentation: 0,
  pronunciation: 0
};

const defaultAcademy = {
  progress: defaultProgress,
  segmentScores: defaultSegmentScores,
  score: 0,
  streak: 0,
  level: 'Articulate Novice',
  completedSessions: 0,
  achievements: [],
  recentActivity: []
};

const precisionTerms = [
  {
    word: 'Conversion',
    weak: 'People are doing something on the site.',
    strong: 'The percentage of visitors who complete a target action, such as buying or unlocking a book.',
    sentence: 'Our audiobook campaign improved conversion because the message matched parents who need accessible learning support.',
    prompt: 'Use this when reporting how traffic becomes revenue or book access.'
  },
  {
    word: 'Optimization',
    weak: 'Making things nicer.',
    strong: 'Improving a process, page, or campaign so it performs better with less waste.',
    sentence: 'Checkout optimization reduced friction and helped more readers complete verified payments.',
    prompt: 'Use this when explaining how you improve digital products.'
  },
  {
    word: 'Accessibility',
    weak: 'Something for disabled people only.',
    strong: 'Designing content so learners with different needs can use it in formats like print, audio, e-book, animation, and Braille.',
    sentence: 'Accessibility is our growth advantage because inclusive formats widen our educational impact.',
    prompt: 'Use this when presenting the company mission.'
  },
  {
    word: 'Stakeholder',
    weak: 'Anybody around the business.',
    strong: 'A person or group affected by, or able to influence, our publishing outcomes.',
    sentence: 'We brief stakeholders with clear metrics, practical recommendations, and evidence of learner impact.',
    prompt: 'Use this when speaking to schools, partners, ministries, or distributors.'
  },
  {
    word: 'Retention',
    weak: 'People came back somehow.',
    strong: 'The rate at which users continue engaging with our products after their first visit or purchase.',
    sentence: 'Retention improved when we paired useful book recommendations with simpler access to purchased titles.',
    prompt: 'Use this when reporting long-term product health.'
  },
  {
    word: 'VICAP',
    weak: 'The company values.',
    strong: 'Accessible Publishers values: Vision, Innovation, Creativity, Accessibility, and Professionalism.',
    sentence: 'Our VICAP values turn publishing from a catalog business into a mission for inclusive education.',
    prompt: 'Use this when connecting strategy to company identity.'
  }
];

const conciseChallenges = [
  {
    title: 'Digital Format Update',
    original: 'We would like to use this medium to inform our valued stakeholders that our team is currently making serious efforts to improve the availability of our books in several accessible digital and alternative formats so that learners with different needs can benefit from them.',
    ideal: 'We are expanding books into accessible digital formats so more learners can benefit.',
    keywords: ['expanding', 'accessible', 'digital', 'learners']
  },
  {
    title: 'Meeting Report',
    original: 'Based on the conversations that took place during the meeting with the school representatives, it is important for us to note that they showed interest in audio books, e-books, and animated learning resources, but they need pricing clarity before making a final commitment.',
    ideal: 'School representatives want audio, e-book, and animated resources, but need clear pricing before committing.',
    keywords: ['school', 'audio', 'e-book', 'animated', 'pricing']
  },
  {
    title: 'Growth Recommendation',
    original: 'In my opinion, I strongly believe that if we are able to improve the speed of the website and make the checkout process easier for users, there is a very good possibility that more visitors will complete purchases and become paying readers.',
    ideal: 'Improving site speed and checkout can convert more visitors into paying readers.',
    keywords: ['speed', 'checkout', 'convert', 'paying']
  }
];

const speechBriefs = [
  {
    title: 'Stakeholder Welcome',
    prompt: 'Write a short welcome address for school leaders visiting Accessible Publishers. Mention VICAP, accessible formats, and learner impact.',
    mustInclude: ['VICAP', 'accessible', 'learners'],
    sample: 'Distinguished school leaders, welcome to Accessible Publishers. Guided by VICAP, we create print, digital, audio, animation, and Braille resources that help every learner access quality education.'
  },
  {
    title: 'Growth Report Opener',
    prompt: 'Open a quarterly growth report. Mention one metric, one reason it matters, and one next action.',
    mustInclude: ['growth', 'metric', 'next'],
    sample: 'This quarter, our digital engagement improved by 32%. The metric matters because it shows rising demand for accessible formats. Next, we should simplify discovery and checkout.'
  },
  {
    title: 'Partner Pitch',
    prompt: 'Pitch a partnership with a state education agency. Be clear, respectful, and specific about accessible publishing value.',
    mustInclude: ['partner', 'accessible', 'education'],
    sample: 'We invite your agency to partner with us in expanding accessible education. Together, we can deliver print, audio, e-book, animation, and Braille resources to more learners.'
  }
];

const presentationScenarios = [
  {
    title: 'Digital Product Review',
    prompt: 'Present this finding: mobile visitors are increasing, but checkout completion is low. Give one insight, one risk, and one recommendation.',
    keywords: ['mobile', 'checkout', 'recommend']
  },
  {
    title: 'Accessible Formats Pitch',
    prompt: 'Convince a partner to support audio books and Braille editions. Connect the pitch to impact, inclusion, and measurable outcomes.',
    keywords: ['audio', 'Braille', 'impact']
  }
];

const pronunciationDrills = [
  {
    phrase: 'Accessible publishing expands learning opportunities for every child.',
    focus: 'Open your mouth on "accessible" and pause after "publishing".'
  },
  {
    phrase: 'Our conversion metrics show stronger demand for digital formats.',
    focus: 'Stress "conversion metrics" and keep the sentence steady.'
  },
  {
    phrase: 'VICAP guides our vision, innovation, creativity, accessibility, and professionalism.',
    focus: 'Slow down through the list. Do not rush the values.'
  },
  {
    phrase: 'We recommend checkout optimization to reduce friction and improve verified purchases.',
    focus: 'Pronounce "optimization" clearly and land the final recommendation.'
  }
];

const fillerWords = ['actually', 'basically', 'just', 'very', 'really', 'in order to', 'due to the fact'];

const getOverallProgress = (progress) => {
  const values = Object.values(progress);
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
};

const getLevelForScore = (score) => {
  if (score >= 420) return 'Royal Orator';
  if (score >= 280) return 'Confident Orator';
  if (score >= 160) return 'Eloquent Presenter';
  if (score >= 70) return 'Clear Communicator';
  return 'Articulate Novice';
};

const countMatches = (text, keywords) => {
  const lowerText = text.toLowerCase();
  return keywords.filter((keyword) => lowerText.includes(keyword.toLowerCase())).length;
};

const mergeAcademyState = (incoming = {}) => ({
  ...defaultAcademy,
  ...incoming,
  progress: { ...defaultProgress, ...(incoming.progress || {}) },
  segmentScores: { ...defaultSegmentScores, ...(incoming.segmentScores || {}) },
  achievements: incoming.achievements || [],
  recentActivity: incoming.recentActivity || []
});

const AdminArticulationGame = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const [academy, setAcademy] = useState(defaultAcademy);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [precisionIndex, setPrecisionIndex] = useState(0);
  const [selectedDefinition, setSelectedDefinition] = useState('');
  const [precisionFeedback, setPrecisionFeedback] = useState('');
  const [conciseIndex, setConciseIndex] = useState(0);
  const [conciseDraft, setConciseDraft] = useState('');
  const [conciseFeedback, setConciseFeedback] = useState('');
  const [speechIndex, setSpeechIndex] = useState(0);
  const [speechDraft, setSpeechDraft] = useState('');
  const [speechFeedback, setSpeechFeedback] = useState('');
  const [presentationIndex, setPresentationIndex] = useState(0);
  const [presentationDraft, setPresentationDraft] = useState('');
  const [presentationFeedback, setPresentationFeedback] = useState('');
  const [drillIndex, setDrillIndex] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(3);
  const [deliveryFeedback, setDeliveryFeedback] = useState('');

  const overallProgress = useMemo(() => getOverallProgress(academy.progress), [academy.progress]);
  const currentTerm = precisionTerms[precisionIndex];
  const currentConcise = conciseChallenges[conciseIndex];
  const currentSpeech = speechBriefs[speechIndex];
  const currentPresentation = presentationScenarios[presentationIndex];
  const currentDrill = pronunciationDrills[drillIndex];

  const precisionOptions = useMemo(() => {
    const other = precisionTerms[(precisionIndex + 2) % precisionTerms.length];
    return [currentTerm.strong, currentTerm.weak, other.strong].sort(() => Math.random() - 0.5);
  }, [currentTerm, precisionIndex]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/admin/game-progress');
        setAcademy(mergeAcademyState(response.data));
      } catch (loadError) {
        console.error('Failed to load game progress:', loadError);
        const savedProgress = localStorage.getItem('growthOfficerProgress');
        if (savedProgress) {
          setAcademy(mergeAcademyState(JSON.parse(savedProgress)));
        }
        setError('Progress could not be loaded from the server. You can still practice, but save may fail until the backend is reachable.');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.86;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      return;
    }

    alert('Text-to-speech is not supported in this browser. Read the line aloud slowly.');
  };

  const persistAcademy = useCallback(async (nextAcademy) => {
    try {
      setSaving(true);
      localStorage.setItem('growthOfficerProgress', JSON.stringify(nextAcademy));
      const response = await axios.put('/admin/game-progress', nextAcademy);
      setAcademy(mergeAcademyState(response.data));
      setError('');
    } catch (saveError) {
      console.error('Failed to save game progress:', saveError);
      setError('Practice recorded locally, but the server save failed. Please try again when the backend is online.');
    } finally {
      setSaving(false);
    }
  }, []);

  const completeSegment = useCallback((segment, points, progressGain, title, feedback) => {
    setAcademy((previous) => {
      const nextScore = previous.score + points;
      const nextProgress = {
        ...previous.progress,
        [segment]: Math.min(100, (previous.progress[segment] || 0) + progressGain)
      };
      const nextSegmentScores = {
        ...previous.segmentScores,
        [segment]: (previous.segmentScores[segment] || 0) + points
      };
      const achievements = new Set(previous.achievements || []);
      if (getOverallProgress(nextProgress) >= 50) achievements.add('Halfway to confident delivery');
      if (nextScore >= 160) achievements.add('Presentation-ready speaker');
      if (nextProgress.conciseness >= 70) achievements.add('Concise communicator');
      if (nextProgress.pronunciation >= 70) achievements.add('Clear delivery streak');

      const nextAcademy = {
        ...previous,
        progress: nextProgress,
        segmentScores: nextSegmentScores,
        score: nextScore,
        level: getLevelForScore(nextScore),
        streak: previous.streak + 1,
        completedSessions: previous.completedSessions + 1,
        achievements: [...achievements],
        recentActivity: [
          {
            segment,
            title,
            points,
            feedback,
            createdAt: new Date().toISOString()
          },
          ...(previous.recentActivity || [])
        ].slice(0, 8)
      };

      persistAcademy(nextAcademy);
      return nextAcademy;
    });
  }, [persistAcademy]);

  const resetProgress = async () => {
    const resetAcademy = {
      ...defaultAcademy,
      recentActivity: [{
        segment: 'vocabulary',
        title: 'Progress reset',
        points: 0,
        feedback: 'A fresh articulation practice record was started.',
        createdAt: new Date().toISOString()
      }]
    };
    await persistAcademy(resetAcademy);
  };

  const handlePrecisionAnswer = (definition) => {
    const isCorrect = definition === currentTerm.strong;
    const points = isCorrect ? 14 : 5;
    const feedback = isCorrect
      ? `Good precision. Use "${currentTerm.word}" when you need a specific professional term, not a vague phrase.`
      : `Close. The precise meaning of "${currentTerm.word}" is: ${currentTerm.strong}`;

    setSelectedDefinition(definition);
    setPrecisionFeedback(feedback);
    completeSegment('vocabulary', points, isCorrect ? 13 : 6, currentTerm.word, feedback);
    setTimeout(() => {
      setSelectedDefinition('');
      setPrecisionFeedback('');
      setPrecisionIndex((index) => (index + 1) % precisionTerms.length);
    }, 2200);
  };

  const evaluateConciseness = () => {
    if (!conciseDraft.trim()) {
      setConciseFeedback('Write a concise version before requesting feedback.');
      return;
    }

    const wordCount = conciseDraft.trim().split(/\s+/).length;
    const keywordMatches = countMatches(conciseDraft, currentConcise.keywords);
    const fillerCount = fillerWords.filter((word) => conciseDraft.toLowerCase().includes(word)).length;
    const points = Math.max(6, Math.min(24, (keywordMatches * 4) + (wordCount <= 28 ? 10 : 4) - (fillerCount * 2)));
    const feedback = wordCount <= 28 && keywordMatches >= 3
      ? 'Strong rewrite. It is short, field-specific, and easy to say aloud.'
      : `Make it tighter. Aim for under 28 words and keep these signals: ${currentConcise.keywords.join(', ')}.`;

    setConciseFeedback(feedback);
    completeSegment('conciseness', points, points >= 18 ? 16 : 9, currentConcise.title, feedback);
    setTimeout(() => {
      setConciseDraft('');
      setConciseFeedback('');
      setConciseIndex((index) => (index + 1) % conciseChallenges.length);
    }, 3500);
  };

  const evaluateSpeech = () => {
    if (!speechDraft.trim()) {
      setSpeechFeedback('Write your address first. Keep it clear enough to deliver aloud.');
      return;
    }

    const wordCount = speechDraft.trim().split(/\s+/).length;
    const requiredMatches = countMatches(speechDraft, currentSpeech.mustInclude);
    const hasGreeting = /welcome|good morning|distinguished|thank you/i.test(speechDraft);
    const conciseEnough = wordCount >= 35 && wordCount <= 95;
    const points = Math.min(30, 8 + (requiredMatches * 5) + (hasGreeting ? 4 : 0) + (conciseEnough ? 8 : 2));
    const feedback = points >= 24
      ? 'Excellent speaking draft. It has context, field language, and a confident delivery shape.'
      : 'Improve the speech by adding a clear opening, company-specific language, and one memorable sentence.';

    setSpeechFeedback(feedback);
    completeSegment('speech', points, points >= 24 ? 18 : 10, currentSpeech.title, feedback);
    setTimeout(() => {
      setSpeechDraft('');
      setSpeechFeedback('');
      setSpeechIndex((index) => (index + 1) % speechBriefs.length);
    }, 4200);
  };

  const evaluatePresentation = () => {
    if (!presentationDraft.trim()) {
      setPresentationFeedback('Write your insight, risk, and recommendation before submitting.');
      return;
    }

    const wordCount = presentationDraft.trim().split(/\s+/).length;
    const keywordMatches = countMatches(presentationDraft, currentPresentation.keywords);
    const hasRecommendation = /recommend|should|next|therefore|propose/i.test(presentationDraft);
    const hasStructure = /insight|risk|recommendation|first|second|third/i.test(presentationDraft);
    const points = Math.min(32, 8 + (keywordMatches * 5) + (hasRecommendation ? 6 : 0) + (hasStructure ? 5 : 0) + (wordCount <= 110 ? 3 : 0));
    const feedback = points >= 25
      ? 'Strong presentation answer. You connected evidence to a decision, which is how leaders speak.'
      : 'Tighten the answer into: insight, risk, recommendation. Use data words and end with a clear next step.';

    setPresentationFeedback(feedback);
    completeSegment('presentation', points, points >= 25 ? 18 : 10, currentPresentation.title, feedback);
    setTimeout(() => {
      setPresentationDraft('');
      setPresentationFeedback('');
      setPresentationIndex((index) => (index + 1) % presentationScenarios.length);
    }, 4200);
  };

  const completeDeliveryDrill = () => {
    const points = deliveryRating * 5;
    const feedback = deliveryRating >= 4
      ? 'Good delivery discipline. Keep practicing with pauses, breath control, and deliberate emphasis.'
      : 'Repeat the line more slowly. Prioritize clarity before speed.';

    setDeliveryFeedback(feedback);
    completeSegment('pronunciation', points, deliveryRating >= 4 ? 16 : 9, 'Delivery drill', feedback);
    setTimeout(() => {
      setDeliveryFeedback('');
      setDeliveryRating(3);
      setDrillIndex((index) => (index + 1) % pronunciationDrills.length);
    }, 3000);
  };

  if (loading) {
    return (
      <AdminLayout
        eyebrow="Growth Officer Academy"
        title="Loading your articulation coach."
        description="Preparing your speaking drills, saved progress, and field-specific practice segments."
      >
        <div className="rounded-4xl border border-white/70 bg-white/80 p-8 text-sm text-slate-600">
          Loading speaking practice...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      eyebrow="Growth Officer Academy"
      title="Speak with precision, clarity, and authority."
      description="This is not just a game. It is a speaking practice system for your Growth Officer work: precise publishing vocabulary, concise statements, stakeholder speeches, data-backed presentations, and clear delivery drills."
      stats={[
        { label: 'Current Level', value: academy.level, helper: `${academy.score} pts across ${academy.completedSessions} sessions` },
        { label: 'Overall Progress', value: `${overallProgress}%`, helper: 'Average speaking mastery' },
        { label: 'Practice Streak', value: academy.streak, helper: 'Completed drills recorded' },
        { label: 'Saved Progress', value: saving ? 'Saving' : 'Backend', helper: 'Stored on your admin account' }
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
      {error ? (
        <div className="rounded-4xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      <section className="rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:rounded-4xl sm:p-6 lg:p-8">
        <div className="grid grid-cols-2 gap-2 rounded-3xl border border-slate-200 bg-slate-50/80 p-2 sm:grid-cols-3 xl:grid-cols-6">
          {segments.map((segment) => (
            <button
              key={segment.id}
              onClick={() => setActiveTab(segment.id)}
              className={`rounded-2xl border px-3 py-3 text-left transition active:scale-95 ${
                activeTab === segment.id
                  ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                  : 'border-transparent bg-white/70 text-slate-600 hover:text-slate-950'
              }`}
            >
              <span className="block text-xs font-semibold">{segment.label}</span>
              <span className={`mt-1 block text-[11px] leading-snug ${activeTab === segment.id ? 'text-white/70' : 'text-slate-400'}`}>
                {segment.helper}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === 'progress' ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Your Speaking Dashboard</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Train for real meetings, not random points.</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Each segment trains a real communication skill: choosing exact terms, removing weak words, opening speeches, making data-backed recommendations, and delivering sentences clearly.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {Object.entries(academy.progress).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{key}</p>
                        <p className="text-sm font-semibold text-slate-950">{value}%</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-slate-950" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recent Practice</p>
                <div className="mt-4 space-y-3">
                  {academy.recentActivity.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                      No drills completed yet. Start with Precision Lab or Concise Rewrite.
                    </p>
                  ) : academy.recentActivity.map((activity, index) => (
                    <div key={`${activity.title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{activity.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{activity.segment}</p>
                        </div>
                        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">+{activity.points}</span>
                      </div>
                      {activity.feedback ? <p className="mt-3 text-sm leading-relaxed text-slate-600">{activity.feedback}</p> : null}
                    </div>
                  ))}
                </div>
                {academy.achievements.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Achievements</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {academy.achievements.map((achievement) => (
                        <span key={achievement} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeTab === 'vocabulary' ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Precision Word</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{currentTerm.word}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">{currentTerm.prompt}</p>
                <div className="mt-5 rounded-2xl border border-blue-100 bg-white p-4 text-sm leading-relaxed text-slate-700">
                  {currentTerm.sentence}
                </div>
                <button
                  onClick={() => speak(`${currentTerm.word}. ${currentTerm.sentence}`)}
                  className="mt-4 w-full rounded-3xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Hear and repeat aloud
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Choose the precise definition</p>
                <div className="mt-4 space-y-3">
                  {precisionOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handlePrecisionAnswer(option)}
                      disabled={Boolean(selectedDefinition)}
                      className={`w-full rounded-2xl border p-4 text-left text-sm leading-relaxed transition hover:shadow-sm disabled:cursor-not-allowed ${
                        selectedDefinition === option
                          ? option === currentTerm.strong ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {precisionFeedback ? (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    {precisionFeedback}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeTab === 'conciseness' ? (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Concise Rewrite</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{currentConcise.title}</h3>
              </div>
              <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 text-sm leading-relaxed text-slate-700 sm:p-6">
                "{currentConcise.original}"
              </div>
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Your version, ideally under 28 words</label>
                  <textarea
                    value={conciseDraft}
                    onChange={(event) => setConciseDraft(event.target.value)}
                    className="mt-3 h-36 w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-slate-400 sm:p-5"
                    placeholder="Rewrite this as a clear sentence you can say in a meeting..."
                  />
                  <button
                    onClick={evaluateConciseness}
                    className="mt-3 w-full rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Evaluate concise statement
                  </button>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
                  <p className="font-semibold text-slate-950">Model answer</p>
                  <p className="mt-2">{currentConcise.ideal}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Keep these words</p>
                  <p className="mt-2">{currentConcise.keywords.join(', ')}</p>
                </div>
              </div>
              {conciseFeedback ? <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-800">{conciseFeedback}</div> : null}
            </div>
          ) : null}

          {activeTab === 'speech' ? (
            <div className="space-y-5">
              <div className="rounded-3xl border border-purple-100 bg-purple-50/70 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">Speech Builder</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{currentSpeech.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{currentSpeech.prompt}</p>
              </div>
              <textarea
                value={speechDraft}
                onChange={(event) => setSpeechDraft(event.target.value)}
                className="h-56 w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-slate-400 sm:p-5"
                placeholder="Write a speech you can deliver aloud in 45-60 seconds..."
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <button onClick={evaluateSpeech} className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Score speech
                </button>
                <button onClick={() => speak(speechDraft || currentSpeech.sample)} className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Hear draft
                </button>
                <button onClick={() => setSpeechDraft(currentSpeech.sample)} className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Use sample
                </button>
              </div>
              {speechFeedback ? <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-800">{speechFeedback}</div> : null}
            </div>
          ) : null}

          {activeTab === 'presentation' ? (
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Presentation Simulator</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{currentPresentation.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{currentPresentation.prompt}</p>
              </div>
              <textarea
                value={presentationDraft}
                onChange={(event) => setPresentationDraft(event.target.value)}
                className="h-52 w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-slate-400 sm:p-5"
                placeholder="Answer with: insight, risk, recommendation..."
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={evaluatePresentation} className="flex-1 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Score presentation
                </button>
                <button onClick={() => speak(presentationDraft || currentPresentation.prompt)} className="flex-1 rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Practice aloud
                </button>
              </div>
              {presentationFeedback ? <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-800">{presentationFeedback}</div> : null}
            </div>
          ) : null}

          {activeTab === 'pronunciation' ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Delivery Drill</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-950">{currentDrill.phrase}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">{currentDrill.focus}</p>
                <button
                  onClick={() => speak(currentDrill.phrase)}
                  className="mt-5 w-full rounded-3xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Hear model delivery
                </button>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Rate your delivery</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={deliveryRating}
                  onChange={(event) => setDeliveryRating(Number(event.target.value))}
                  className="mt-5 w-full"
                />
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>Needs work</span>
                  <span className="font-semibold text-slate-950">{deliveryRating}/5</span>
                  <span>Clear</span>
                </div>
                <button
                  onClick={completeDeliveryDrill}
                  className="mt-5 w-full rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Save delivery drill
                </button>
                {deliveryFeedback ? <p className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">{deliveryFeedback}</p> : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminArticulationGame;
