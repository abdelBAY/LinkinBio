import type { ThemeStyle, ThemeColor, ThemeRecommendation } from "@shared/schema";

const themeStyles: Record<ThemeStyle, {
  colors: ThemeColor[];
  backgrounds: string[];
  glassEffect: boolean;
}> = {
  professional: {
    colors: ['blue', 'purple'],
    backgrounds: ['gradient1', 'gradient4'],
    glassEffect: true,
  },
  modern: {
    colors: ['purple', 'pink'],
    backgrounds: ['gradient2', 'gradient3'],
    glassEffect: true,
  },
  playful: {
    colors: ['orange', 'pink'],
    backgrounds: ['gradient3'],
    glassEffect: false,
  },
  minimal: {
    colors: ['blue', 'green'],
    backgrounds: ['gradient1'],
    glassEffect: false,
  },
  bold: {
    colors: ['purple', 'orange'],
    backgrounds: ['gradient4'],
    glassEffect: true,
  },
};

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateThemeRecommendation(preferences: ThemeStyle[]): ThemeRecommendation {
  // Select a random preferred style
  const style = getRandomItem(preferences);
  const styleConfig = themeStyles[style];
  
  return {
    style,
    color: getRandomItem(styleConfig.colors),
    background: getRandomItem(styleConfig.backgrounds),
    glassEffect: styleConfig.glassEffect,
  };
}

export function getThemeDescription(theme: ThemeRecommendation): string {
  const descriptions: Record<ThemeStyle, string> = {
    professional: "A clean and trustworthy look perfect for business profiles",
    modern: "A contemporary design that stands out while maintaining elegance",
    playful: "A fun and engaging theme that shows personality",
    minimal: "A simple and focused design that puts your content first",
    bold: "A striking appearance that makes a strong impression",
  };

  return descriptions[theme.style];
}
