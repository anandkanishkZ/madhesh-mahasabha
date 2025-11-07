# Animation System Documentation

## Overview
This project now includes a comprehensive animation system designed to enhance the user experience while maintaining performance and accessibility standards.

## Animation Categories

### 1. Page Transitions
- **Page Enter**: Smooth fade-in with subtle upward movement
- **Page Exit**: Quick fade-out with upward movement
- **Implementation**: Automatic via `PageWrapper` component

### 2. Scroll-Based Animations
- **Fade In Up/Down/Left/Right**: Content appears as user scrolls
- **Scale In**: Content scales up from 80% to 100%
- **Slide In**: Content slides in from various directions
- **Implementation**: Using Intersection Observer API

### 3. Micro-Interactions
- **Button Hover**: Lift effect with enhanced shadows
- **Button Press**: Subtle scale animation with ripple effect
- **Card Hover**: Lift and glow effects
- **Navigation Items**: Underline animation on hover
- **Logo Hover**: Glow effect

### 4. Loading States
- **Spinner**: Rotating loading indicator
- **Dots**: Wave-like pulsing dots
- **Shimmer**: Skeleton loading with shimmer effect

## Key Features

### Performance Optimizations
1. **GPU Acceleration**: All transforms use `transform` property
2. **Efficient Selectors**: Uses class-based animations
3. **Intersection Observer**: Efficient scroll-based triggers
4. **Reduced Motion Support**: Respects user preferences

### Accessibility
1. **Reduced Motion**: Automatically disables animations for users who prefer reduced motion
2. **Focus States**: Enhanced focus indicators with animations
3. **Screen Reader Friendly**: No animation-only content

### Browser Compatibility
- Modern browsers with CSS3 support
- Graceful degradation for older browsers
- Uses `will-change` for performance hints

## Usage Examples

### Basic Scroll Animation
```tsx
<div className="animate-on-scroll">
  Content that fades in when scrolled into view
</div>
```

### Staggered Children Animation
```tsx
<div className="stagger-children">
  <div>Item 1 (animates first)</div>
  <div>Item 2 (animates second)</div>
  <div>Item 3 (animates third)</div>
</div>
```

### Using AnimatedSection Component
```tsx
<AnimatedSection animation="fade-left" delay={0.3}>
  <YourContent />
</AnimatedSection>
```

### Custom Button with Animations
```tsx
<Button className="hover-lift hover-glow">
  Click Me
</Button>
```

## Animation Classes

### Scroll Animations
- `animate-on-scroll` - Fade in up
- `animate-on-scroll-left` - Fade in from left
- `animate-on-scroll-right` - Fade in from right
- `animate-on-scroll-scale` - Scale in

### Hover Effects
- `hover-lift` - Moves up with shadow
- `hover-glow` - Adds glow effect
- `hover-scale` - Slightly scales up
- `hover-rotate` - Rotates 5 degrees

### Loading States
- `loading-spinner` - Rotating spinner
- `loading-bounce` - Bouncing animation
- `loading-wave` - Wave effect for dots

### Utility Animations
- `animate-float` - Gentle floating motion
- `animate-pulse-soft` - Soft pulsing effect
- `animate-shimmer` - Shimmer loading effect
- `animate-gradient` - Animated gradient background

## Implementation Guidelines

### Do's
- Use animations to guide user attention
- Keep animations subtle and purposeful
- Test with reduced motion preferences
- Use staggered animations for lists
- Implement loading states for better UX

### Don'ts
- Don't overuse animations
- Avoid animations longer than 500ms for micro-interactions
- Don't animate layout properties unnecessarily
- Don't ignore accessibility preferences
- Avoid complex animations on mobile

## Performance Considerations

1. **Transform over Position**: Always use `transform` instead of changing `top`, `left`, etc.
2. **Composite Layers**: Animations trigger GPU acceleration
3. **Animation Duration**: Keep micro-interactions under 300ms
4. **Intersection Observer**: Efficient scroll-based triggering
5. **Cleanup**: Proper cleanup of event listeners and observers

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Basic support (graceful degradation)

## Customization

To customize animations, modify the CSS custom properties in `globals.css`:

```css
:root {
  --animation-duration-fast: 200ms;
  --animation-duration-normal: 300ms;
  --animation-duration-slow: 500ms;
  --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Future Enhancements

1. **Parallax Effects**: For hero sections
2. **GSAP Integration**: For complex animations
3. **Animation Presets**: Pre-configured animation sets
4. **Performance Monitoring**: Animation performance tracking
5. **A/B Testing**: Animation effectiveness testing