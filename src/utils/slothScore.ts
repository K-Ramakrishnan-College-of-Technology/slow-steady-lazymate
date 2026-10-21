import { SlothMetrics } from '../types';

export interface SlothScoreCalculation {
  totalMinutesSaved: number;
  readingMinutesSaved: number;
  typingMinutesSaved: number;
  organizationMinutesSaved: number;
  readingSpeedWpm: number;
  typingSpeedWpm: number;
  energyConservedPercent: number;
  slothRating: string;
  slothMotto: string;
}

export function calculateSlothSavings(metrics: SlothMetrics): SlothScoreCalculation {
  const readingSpeedWpm = 220; // Average adult reading speed: 200-240 wpm
  const typingSpeedWpm = 40;   // Average keyboard typing & drafting speed: 38-42 wpm

  // Estimated reading time saved by condensing text
  const readingMinutesSaved = Math.max(0, Math.round((metrics.wordsSummarized / readingSpeedWpm) * 10) / 10);

  // Estimated drafting & typing time saved
  const typingMinutesSaved = Math.max(0, Math.round((metrics.wordsGenerated / typingSpeedWpm) * 10) / 10);

  // Cognitive planning overhead saved: ~6 minutes per task plan batch + ~8 minutes per organized note
  const organizationMinutesSaved = Math.round(
    (metrics.tasksPlanned * 6 + metrics.notesStructured * 8) * 10
  ) / 10;

  const totalMinutesSaved = Math.round((readingMinutesSaved + typingMinutesSaved + organizationMinutesSaved) * 10) / 10;

  // Percentage of energy conserved relative to an 8-hour workday benchmark
  // Capped realistically between 0% and 95%
  const energyConservedPercent = Math.min(
    95,
    Math.max(5, Math.round((totalMinutesSaved / 180) * 100))
  );

  let slothRating = 'Awakening Sloth';
  let slothMotto = 'Taking the first slow, calm stretch of the morning.';

  if (totalMinutesSaved >= 60) {
    slothRating = 'Master Canopy Zen';
    slothMotto = 'Maximum tranquility achieved. Zero needless movement.';
  } else if (totalMinutesSaved >= 30) {
    slothRating = 'Steady Branch Lounger';
    slothMotto = 'Working smart and leisurely enjoying an extra cup of warm tea.';
  } else if (totalMinutesSaved >= 10) {
    slothRating = 'Gentle Climber';
    slothMotto = 'Pruning repetitive tasks one steady step at a time.';
  }

  return {
    totalMinutesSaved,
    readingMinutesSaved,
    typingMinutesSaved,
    organizationMinutesSaved,
    readingSpeedWpm,
    typingSpeedWpm,
    energyConservedPercent,
    slothRating,
    slothMotto,
  };
}
