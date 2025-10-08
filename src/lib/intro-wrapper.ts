// Safe wrapper for intro.js to prevent SSR issues
import type IntroJs from 'intro.js';

let introJs: typeof IntroJs | null = null;

export const getIntroJs = async () => {
  if (typeof window === 'undefined') return null;

  if (!introJs) {
    const intro = await import('intro.js');
    introJs = intro.default;
  }

  return introJs;
};

export const startIntroTour = async () => {
  const intro = await getIntroJs();
  if (!intro) return;

  try {
    intro().start();
  } catch (error) {
    console.warn('Intro.js failed to start:', error);
  }
};

export const stopIntroTour = async () => {
  const intro = await getIntroJs();
  if (!intro) return;

  try {
    intro().exit();
  } catch (error) {
    console.warn('Intro.js failed to exit:', error);
  }
};
