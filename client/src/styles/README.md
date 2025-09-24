# CSS Organization - OrionCodex

This directory contains the organized CSS structure for the OrionCodex project, providing clear separation of concerns and better maintainability.

## 📁 File Structure

```
client/src/styles/
├── index.css       # Main entry point - imports all CSS modules
├── globals.css     # CSS Custom Properties (Variables) & Theme System
├── base.css        # Foundation styles, resets, and base element styles
├── components.css  # Reusable component styles and patterns
├── animations.css  # Keyframes, transitions, and animation utilities
├── elevation.css   # Hover/active states and elevation system
└── README.md       # This documentation file
```

## 🎯 Purpose of Each File

### `index.css` - Main Entry Point
- Imports Tailwind CSS directives
- Imports all organized CSS modules
- Serves as the single entry point for all styles

### `globals.css` - CSS Variables & Theme System
- CSS Custom Properties (CSS Variables) for both light and dark themes
- Color system definitions
- Typography settings
- Shadow and spacing variables
- Automatically computed border colors

### `base.css` - Foundation Styles
- Base element styles and resets
- Global HTML/body styles
- Input styling fixes
- Accessibility improvements
- Foundation utilities

### `components.css` - Component Styles
- Reusable component patterns
- Progress bars and indicators
- Card hover effects
- Component-specific utilities

### `animations.css` - Animations & Keyframes
- Fade-in animations (up, left, right)
- Shimmer effects
- Keyframe definitions
- Animation utilities

### `elevation.css` - Elevation System
- Hover and active state management
- Toggle elevation states
- Interactive feedback system
- Complex state handling for UI elements

## 🚀 Usage

### Importing Styles
The main stylesheet is automatically imported in `main.tsx`:

```tsx
import './index.css'  // This now imports the organized structure
```

### Using CSS Variables
All CSS variables are available globally:

```css
.my-component {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
```

### Using Utility Classes
Animation and component utilities are available:

```tsx
<div className="fade-in-up scale-on-hover">
  <div className="progress-bar" />
</div>
```

### Using Elevation System
Interactive states with the elevation system:

```tsx
<button className="hover-elevate active-elevate-2">
  Interactive Button
</button>
```

## 🎨 Theme System

The CSS variables automatically adapt to light/dark mode:

- **Light Mode**: Defined in `:root` selector
- **Dark Mode**: Defined in `.dark` selector
- **Automatic**: Theme switching handled by Tailwind's `darkMode: ["class"]`

## 🔧 Customization

### Adding New Variables
Add new CSS variables to `globals.css`:

```css
:root {
  --my-custom-color: 210 100% 50%;
}

.dark {
  --my-custom-color: 210 100% 70%;
}
```

### Adding New Components
Add component styles to `components.css`:

```css
@layer components {
  .my-component {
    /* Component styles here */
  }
}
```

### Adding New Animations
Add animations to `animations.css`:

```css
@layer utilities {
  .my-animation {
    animation: myKeyframe 1s ease-in-out;
  }
  
  @keyframes myKeyframe {
    /* Keyframe definitions */
  }
}
```

## 📋 Migration Notes

The old `index.css` file has been updated to import this new structure. All existing functionality is preserved while providing better organization.

### Before (Old Structure)
```
client/src/index.css  # Single large file with everything
```

### After (New Structure)
```
client/src/styles/    # Organized directory structure
├── index.css         # Main entry point
├── globals.css       # Variables & theme
├── base.css          # Foundation
├── components.css    # Components
├── animations.css    # Animations
└── elevation.css     # Interactive states
```

## 🎯 Benefits

1. **Better Organization**: Clear separation of concerns
2. **Easier Maintenance**: Find and modify specific types of styles quickly
3. **Better Collaboration**: Team members can work on different style aspects
4. **Scalability**: Easy to add new styles in the appropriate category
5. **Documentation**: Each file has a clear purpose and documentation
6. **Performance**: Better caching and loading strategies possible

## 🔍 Best Practices

1. **Use the right file**: Put styles in the appropriate category file
2. **Follow Tailwind layers**: Use `@layer base`, `@layer components`, `@layer utilities`
3. **Document complex styles**: Add comments for complex CSS
4. **Use CSS variables**: Leverage the theme system for consistency
5. **Test both themes**: Ensure styles work in light and dark mode
