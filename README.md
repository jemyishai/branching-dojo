# Bridge Shape Dojo

## Overview

Bridge Shape Dojo is an interactive C++ learning platform designed to teach nested loops through visual pattern exercises. Students select from 17 different star patterns and write C++ code to generate them, receiving real-time feedback and guidance. The platform features a modern dual-theme system and modular architecture designed for educational excellence.

## Features

### Educational Tools
- **17 Star Patterns**: Triangles, pyramids, squares, and diamonds with varying complexity
- **Pattern-Specific Hints**: Dynamic, collapsible guidance that adapts to the selected pattern
- **Intelligent Linting**: Real-time C++ syntax checking with educational feedback (toggleable)
- **Visual Feedback**: Side-by-side comparison of student output vs expected pattern
- **Clean Reset**: Simple boilerplate template for fresh coding attempts
- **Progressive Learning**: Hints expand on click to encourage self-directed exploration

### Modern Design System
- **Dual Themes**: "Dojo Classic" (light blue professional) and "Dojo Matrix" (dark neon)
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Graph Paper Background**: Subtle coding-themed visual aesthetic
- **Sticky Header**: Compact-on-scroll header with accessibility features
- **Modern Typography**: Tahoma font family for optimal readability

### Technical Features
- **Custom C++ Interpreter**: Browser-based execution of C++ subset code
- **Modular Architecture**: React-ready component structure
- **100% Client-Side**: No server required, works completely offline
- **State Management**: Centralized reactive state system
- **Theme Persistence**: Automatic theme saving with system preference detection

## Architecture

### Modular Structure
```
├── index.html           # Main application structure & dual-theme toggle
├── styles.css          # Complete theme system with CSS variables
├── cpp-interpreter.js  # C++ execution engine
├── js/
│   ├── main.js         # Application orchestrator & theme management
│   ├── app-state.js    # Reactive state management with pub/sub
│   ├── patterns.js     # 17 pattern definitions & specific hints
│   ├── linter.js       # Educational C++ linting system
│   └── ui-components.js# UI utilities & collapsible components
├── AI_ENHANCEMENT_ROADMAP.md # Future AI integration plans
└── README.md           # This documentation
```

### Theme System
- **Dojo Classic**: Light blue professional theme with graph paper background
- **Dojo Matrix**: Dark neon theme with green accents and Matrix-style effects
- **CSS Variables**: Seamless theme switching without code duplication
- **Smart Detection**: Automatic theme selection based on system preferences
- **Persistence**: Theme choice saved across browser sessions

### Design Principles
- **Typography**: Tahoma font family for optimal code readability
- **Accessibility**: ARIA labels, focus states, and mobile-friendly interactions  
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Mobile-First**: Responsive grid that adapts from mobile to desktop

## Supported C++ Features

The platform supports an educational subset of C++ including:
- Variable declarations (`int`, `char`)
- For loops with multiple syntax variations
- Assignment operations (`=`, `+=`, `++`)
- Console output (`cout`)
- Basic arithmetic and character operations

## Pattern Categories

1. **Triangles**: Left-aligned, right-aligned, hollow, and downward variations
2. **Pyramids**: Centered patterns with solid and hollow options
3. **Squares**: Solid, hollow, and crossed square patterns
4. **Diamonds**: Combined upward and downward pyramid structures

Each pattern includes specific implementation hints and teaching guidance.

## Technical Implementation

### State Management
- Reactive state system with subscription-based updates
- Centralized state management for scalability
- Real-time synchronization between UI components

### Modular Architecture Benefits
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new patterns or features
- **Testable**: Individual modules can be unit tested
- **React-Ready**: Structure supports easy framework migration

### Performance
- Efficient rendering with minimal dependencies
- Optimized for educational use cases
- Safe execution with bounded iteration limits

## Getting Started

1. Open `index.html` in any modern web browser
2. Choose your preferred theme using the toggle button (Classic or Matrix)
3. Select a pattern from the dropdown menu (17 available patterns)
4. View the expected output and click the hint to expand guidance
5. Toggle linting on/off for real-time C++ feedback
6. Write C++ code in the editor with pattern-specific assistance
7. Click "Run" to execute and compare your output with the expected pattern
8. Use "Reset" for a fresh start with clean boilerplate code

### Theme Features
- **Classic Theme**: Professional light blue design for traditional learning
- **Matrix Theme**: Dark neon aesthetic for immersive coding experience
- **Auto-Detection**: Automatically selects theme based on your system preferences
- **Persistence**: Your theme choice is remembered across sessions

The platform requires no installation, build process, or internet connection - simply open the HTML file to begin learning C++ nested loops through interactive pattern creation.