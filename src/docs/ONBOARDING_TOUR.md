# Onboarding Tour System

This document describes the comprehensive onboarding tour system implemented for the Save It money mastery application.

## Overview

The onboarding tour system provides an interactive guided experience for new users, showcasing all the key features of the application. It includes:

- **Welcome Modal**: First-time user detection and tour invitation
- **Interactive Overlay**: Dark background with spotlight focus
- **Step-by-step Guidance**: Comprehensive tour covering all app features
- **Page-specific Tours**: Customized tours for different sections
- **Persistence**: Remembers tour completion status
- **Analytics**: Tracks tour engagement and completion

## Architecture

### Core Components

1. **TourProvider** (`src/contexts/tour-context.tsx`)
   - Central state management for tour functionality
   - Handles tour lifecycle (start, stop, reset)
   - Manages tour persistence and first-time user detection
   - Provides tour context to all components

2. **Tour Steps** (`src/lib/tour-steps.ts`)
   - Modular tour step definitions
   - Page-specific tour configurations
   - Dashboard, Accounts, Budgets, and Analytics tours

3. **Tour Components**
   - `TourTrigger`: Manual tour start/reset buttons
   - `PageTour`: Auto-triggers page-specific tours
   - `TourAnalytics`: Tracks tour engagement

### Tour Features

#### Dashboard Tour
- **Welcome & Navigation**: Introduction to the app and navigation
- **Dashboard Overview**: Key financial metrics explanation
- **Debt Tracking**: Debt management features
- **Savings Goals**: Goal setting and tracking
- **Budget Tracking**: Spending limit management
- **Transaction History**: Recent activity overview
- **Personalization**: Theme and currency settings
- **Completion**: Next steps and encouragement

#### Page-Specific Tours
- **Accounts Tour**: Account management and balance tracking
- **Budgets Tour**: Budget creation and monitoring
- **Analytics Tour**: Financial insights and metrics

## Implementation Details

### Tour Data Attributes

Components are marked with `data-tour` attributes for tour targeting:

```tsx
<div data-tour="dashboard-overview">
  <h1>Save It</h1>
  <p>Take control of your financial future...</p>
</div>
```

### Tour Steps Structure

```tsx
{
  target: "[data-tour='dashboard-overview']",
  content: (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Dashboard Overview</h3>
      <p className="text-sm text-muted-foreground">
        Your dashboard shows your key financial metrics...
      </p>
    </div>
  ),
  placement: "bottom",
}
```

### State Management

The tour system uses React Context for state management:

```tsx
interface TourContextType {
  isRunning: boolean
  stepIndex: number
  startTour: (steps?: Step[]) => void
  stopTour: () => void
  resetTour: () => void
  isFirstTime: boolean
  showWelcomeModal: boolean
  setShowWelcomeModal: (show: boolean) => void
  currentSteps: Step[]
}
```

### Persistence

Tour completion is tracked using localStorage:

```tsx
const TOUR_STORAGE_KEY = "saveit-tour-completed"
const WELCOME_STORAGE_KEY = "saveit-welcome-shown"
```

### Analytics

Tour engagement is tracked for insights:

```tsx
// Track tour start
console.log("Tour started:", {
  stepCount: currentSteps.length,
  timestamp: new Date().toISOString(),
})

// Track step changes
console.log("Tour step changed:", {
  stepIndex,
  totalSteps: currentSteps.length,
  progress: ((stepIndex + 1) / currentSteps.length) * 100,
})
```

## Usage

### Automatic Tour Trigger

The tour automatically triggers for first-time users:

1. **Welcome Modal**: Shows on first visit
2. **Page Tours**: Auto-start on specific pages for new users
3. **Manual Trigger**: Tour button in navigation

### Manual Tour Control

Users can manually control the tour:

```tsx
const { startTour, stopTour, resetTour } = useTour()

// Start tour with specific steps
startTour(accountsTourSteps)

// Stop current tour
stopTour()

// Reset tour (show welcome modal again)
resetTour()
```

### Customizing Tours

To add new tour steps:

1. **Add data attributes** to target elements:
   ```tsx
   <div data-tour="new-feature">
     <h2>New Feature</h2>
   </div>
   ```

2. **Create tour steps** in `src/lib/tour-steps.ts`:
   ```tsx
   export const newFeatureTourSteps: Step[] = [
     {
       target: "[data-tour='new-feature']",
       content: (
         <div className="space-y-3">
           <h3 className="text-lg font-semibold">New Feature</h3>
           <p className="text-sm text-muted-foreground">
             This is how the new feature works...
           </p>
         </div>
       ),
       placement: "bottom",
     },
   ]
   ```

3. **Update tour context** to include new steps:
   ```tsx
   import { newFeatureTourSteps } from "@/lib/tour-steps"
   ```

## Styling

The tour uses custom styling that matches the app's design system:

```tsx
styles={{
  options: {
    primaryColor: "hsl(var(--primary))",
    textColor: "hsl(var(--foreground))",
    backgroundColor: "hsl(var(--background))",
    overlayColor: "rgba(0, 0, 0, 0.8)",
    arrowColor: "hsl(var(--background))",
  },
  tooltip: {
    borderRadius: 8,
    padding: 20,
  },
  // ... more styling options
}}
```

## Accessibility

The tour system includes accessibility features:

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Maintains focus during tour
- **Skip Options**: Users can skip or exit at any time

## Best Practices

### Tour Design
- **Keep it concise**: Each step should be brief and focused
- **Progressive disclosure**: Start with overview, then details
- **Visual hierarchy**: Use clear headings and bullet points
- **Actionable content**: Include next steps and calls-to-action

### Performance
- **Lazy loading**: Tour steps are loaded only when needed
- **Efficient rendering**: Minimal re-renders during tour
- **Memory management**: Proper cleanup of event listeners

### User Experience
- **Non-intrusive**: Users can skip or exit anytime
- **Resumable**: Tour state is preserved during navigation
- **Contextual**: Different tours for different pages
- **Encouraging**: Positive messaging and clear benefits

## Troubleshooting

### Common Issues

1. **Tour not starting**: Check localStorage for completion status
2. **Steps not targeting**: Verify data-tour attributes are correct
3. **Styling issues**: Check CSS custom properties are available
4. **Performance**: Ensure tour steps are not too heavy

### Debug Mode

Enable debug logging:

```tsx
// In tour context
console.log("Tour state:", { isRunning, stepIndex, currentSteps })
```

## Future Enhancements

### Planned Features
- **Tour Analytics Dashboard**: Detailed engagement metrics
- **A/B Testing**: Different tour variations
- **Personalized Tours**: Based on user behavior
- **Video Integration**: Embedded tutorial videos
- **Multi-language Support**: Localized tour content

### Integration Opportunities
- **User Onboarding**: Connect with user registration flow
- **Feature Announcements**: Highlight new features
- **Help System**: Contextual help and documentation
- **Gamification**: Tour completion rewards and badges

## Conclusion

The onboarding tour system provides a comprehensive, user-friendly way to introduce new users to the Save It application. It balances automation with user control, ensuring a positive first experience while respecting user preferences and accessibility needs.

The modular architecture makes it easy to maintain and extend, while the analytics integration provides valuable insights into user engagement and tour effectiveness.
