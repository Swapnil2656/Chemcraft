# ChemCraft AI Coding Agent Instructions

## Project Overview
ChemCraft is an interactive chemistry education platform built with **Next.js 14 App Router**, TypeScript, Tailwind CSS, and Zustand for state management. The app features a complete periodic table, element mixer, quiz system, and 3D chemical animations.

## Architecture & Tech Stack
- **Framework**: Next.js 14 with App Router (`/src/app/`)
- **State Management**: Zustand with persistence (`/src/stores/`)
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Clerk integration for user management
- **3D Graphics**: Three.js with React Three Fiber for chemical backgrounds
- **Performance**: Dynamic imports, code splitting, optimized bundle

## Key Patterns & Conventions

### 1. Component Architecture
- **Client Components**: Use `'use client'` directive for interactive components
- **Dynamic Imports**: Heavy components loaded lazily (e.g., `PeriodicTable`, `ChemicalBackground`)
- **Error Boundaries**: Wrap components with `ErrorBoundary` for graceful failures
- **Prop Interfaces**: Strictly typed props with optional parameters and defaults

```tsx
// Example: PeriodicTable component pattern
interface PeriodicTableProps {
  onElementClick?: (element: Element) => void;
  selectedElementForReactivity?: Element | null;
  showReactivityHighlighting?: boolean;
}
```

### 2. State Management Pattern
Use Zustand stores with persistence for global state. All stores follow this pattern:
- Store in `/src/stores/` with typed interfaces
- Use `persist` middleware for localStorage integration
- Include computed getters (e.g., `getFilteredElements`, `getElementBySymbol`)
- Partition persistence to only save relevant state

```typescript
// Pattern from elementStore.ts
export const useElementStore = create<ElementState>()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    {
      name: 'element-store',
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
);
```

### 3. Route Structure & Pages
- **App Router**: All pages in `/src/app/` directory
- **Authentication Gates**: Protected routes check `isSignedIn` status
- **Loading States**: Show loading UI for unauthenticated/loading states
- **Dynamic Pages**: Use Clerk's catch-all routes for auth (`[[...sign-in]]`)

### 4. Data Architecture
- **Static Data**: Element data in `/src/constants/elements.ts` 
- **Dynamic Data**: JSON files in `/public/data/` for large datasets
- **AI-Generated Content**: Compound database uses smart generation algorithms
- **Type Safety**: All data strictly typed via `/src/types/`

### 5. Performance Optimizations
- **Bundle Splitting**: Dynamic imports for heavy modules (`loadCompoundLookup`, `loadChemCraftAI`)
- **React Optimization**: `useCallback`, `useMemo` for expensive operations
- **Image Optimization**: Next.js Image component with proper sizing
- **Error Recovery**: Comprehensive error handling with fallback states

## Development Workflows

### Starting Development
```bash
# Use provided scripts (Windows-specific)
start-dev.bat           # Double-click method
start-dev.ps1          # PowerShell method

# Or manually
cd "C:\Users\swapn\Desktop\Projects\Chemcraft\chemcraft"
npm run dev            # Standard development
npm run dev:turbo      # Turbo mode for faster builds
```

### Code Quality Commands
```bash
npm run lint           # ESLint checking
npm run lint:fix       # Auto-fix issues
npm run type-check     # TypeScript validation
npm run clean          # Clean build files
npm run reinstall      # Clean reinstall dependencies
```

### Testing & Quality Patterns

#### Input Validation Testing
```typescript
// Always validate before operations - pattern from quizUtils.ts
const validation = validateQuizInputs(elements, difficulty);
if (!validation.isValid) {
  console.error('Validation failed:', validation.error);
  return null;
}
```

#### Safe Operation Patterns
```typescript
// Defensive programming with fallbacks - from quizUtils.ts
export const generateQuizQuestionSafe = (elements, difficulty) => {
  try {
    return generateQuizQuestion(elements, difficulty);
  } catch (error) {
    console.error('Quiz generation failed:', error);
    // Return minimal fallback question
    return createFallbackQuestion(elements[0]);
  }
};
```

#### Performance Testing
- **Bundle Analysis**: Use `npm run build` and check .next/static/ sizes
- **Component Performance**: Use React DevTools Profiler for re-render analysis
- **Memory Leaks**: Monitor Three.js cleanup in ChemicalBackground component
- **Loading Performance**: Test dynamic imports with network throttling

#### Chemistry Logic Testing
```typescript
// Test element data integrity
const validateElementData = (elements) => {
  return elements.every(el => 
    el.id && el.name && el.symbol && 
    typeof el.atomicNumber === 'number' &&
    el.atomicNumber >= 1 && el.atomicNumber <= 118
  );
};
```

## Component Patterns

### Element Interaction Components
Elements are the core data type. Always handle null/undefined states:
```tsx
// Safe element access pattern
const element = useElementStore(state => state.getElementById(id));
if (!element) return <div>Element not found</div>;
```

### Quiz System Integration
Quiz components must validate inputs and handle errors gracefully:
```tsx
// From quizUtils.ts - always validate before generation
const validation = validateQuizInputs(elements, difficulty);
if (!validation.isValid) {
  // Handle error appropriately
}
```

### Chemical Compound Logic
The compound system uses AI prediction with comprehensive fallbacks:
```tsx
// Pattern for compound generation from compoundGenerator.ts
const aiPrediction = await chemCraftAI.predictCompound(elements);

// Multi-tier fallback system:
const compound = {
  name: aiPrediction.name || `${elementNames} compound`,
  formula: aiPrediction.formula || elementsWithCounts.map(e => 
    `${e.symbol}${e.count > 1 ? e.count : ''}`).join(''),
  confidence: aiPrediction.confidence,
  source: aiPrediction.source,
  rule_applied: aiPrediction.rule_applied
};
```

### Compound Database Generation
The system generates 550+ compounds across categories:
- **Binary Compounds**: Oxides (50), Halides (60), Hydrides (25), Sulfides (30)
- **Ternary Compounds**: Hydroxides (25), Acids (30), Nitrates (25), Sulfates (25)
- **Complex Compounds**: Coordination compounds (20), Organics (40), Intermetallics (25)
- **Special Cases**: Noble gas compounds (10), Synthetic compounds (15)

```typescript
// Auto-generation pattern from compoundGenerator.ts
const compound: CompoundTemplate = {
  id: `CPD_${String(this.compoundId++).padStart(3, '0')}`,
  formula: this.calculateFormula(metal, oxidationState),
  properties: this.predictProperties(elements),
  safety: this.assessSafety(elements),
  data_quality: { confidence: 0.85, source: 'ai_generated' }
};
```

## Integration Points

### Clerk Authentication
- Check `isSignedIn` and `isLoaded` before rendering protected content
- Use `SignInButton` component for unauthenticated states  
- Handle loading states appropriately

### Three.js 3D Components & Animation Patterns

#### Component Setup Pattern
```tsx
// ChemicalBackground.tsx pattern
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ErrorBoundary } from 'react-error-boundary';

const ChemicalBackground = () => (
  <ErrorBoundary fallback={<div />}>
    <Suspense fallback={null}>
      <Canvas
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        camera={{ position: [0, 0, 5], fov: 60 }}
      >
        <FloatingAtoms />
        <ParticleSystem />
      </Canvas>
    </Suspense>
  </ErrorBoundary>
);
```

#### Animation Performance Patterns
```tsx
// useFrame optimization pattern
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const FloatingAtom = () => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    // Limit updates to 60fps max
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  return <mesh ref={meshRef}>/* geometry */</mesh>;
};
```

#### WebGL Fallback Handling
```tsx
// WebGL detection and fallback
const [webglSupported, setWebglSupported] = useState(true);

useEffect(() => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    setWebglSupported(false);
    console.warn('WebGL not supported, using CSS fallback');
  }
}, []);

// Render static background if WebGL unavailable
if (!webglSupported) {
  return <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />;
}
```

#### Memory Management for 3D
```tsx
// Cleanup pattern for Three.js resources
useEffect(() => {
  return () => {
    // Dispose geometries and materials
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  };
}, []);
```

### Service Worker (PWA)
- Caches key routes: `/`, `/periodic`, `/mixer`, `/quiz`, `/favorites`
- Handles offline functionality
- Auto-registers in layout.tsx

## Common Debugging Steps & Scenarios

### Build & Development Issues
1. **"npm error Missing script: 'dev'"**: Use `start-dev.bat` or ensure you're in correct directory
2. **Build Issues**: Run `npm run clean` then `npm run dev`
3. **SWC Dependencies Warning**: Already handled by package.json configuration
4. **Port 3000 in use**: Use `netstat -ano | findstr :3000` then `taskkill /PID <PID_NUMBER> /F`
5. **Node modules corruption**: Run `npm run reinstall` (custom script for clean reinstall)

### TypeScript & Code Quality
6. **TypeScript Errors**: Check `npm run type-check` for full error list
7. **Linting Issues**: Run `npm run lint:fix` for auto-fixes
8. **Hydration Errors**: Ensure client components use `'use client'` directive

### State & Authentication Issues  
9. **State Issues**: Check Zustand DevTools in browser, verify persistence partitioning
10. **Authentication Issues**: Verify Clerk environment variables, check `isLoaded` before `isSignedIn`
11. **Quiz Generation Failures**: Use `validateQuizInputs()` before `generateQuizQuestion()`

### Performance & 3D Issues
12. **Performance Issues**: Use React DevTools Profiler, check dynamic import loading
13. **3D Background Not Loading**: Verify WebGL support, check console for Three.js errors
14. **Custom Cursor Missing**: Ensure `cursor: none` on body, check z-index conflicts

### Chemistry-Specific Debugging
15. **Element Mixer Failures**: Check compound generation fallbacks, verify element data integrity
16. **Periodic Table Misalignment**: Verify `getElementPosition()` function, check CSS grid
17. **Quiz Questions Invalid**: Ensure minimum 4 elements, validate element structure

## File Import Conventions
- Use absolute imports with `@/` prefix
- Dynamic imports for heavy modules
- Lazy load non-critical components
- Type imports for type-only references

## Design System
- **Colors**: Uses Tailwind with custom slate/blue/purple gradients
- **Animations**: Consistent `transition-all duration-300 ease-in-out`
- **Responsive**: Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- **Accessibility**: Focus states, ARIA labels, semantic HTML
- **Glass Morphism**: `backdrop-blur-md` with semi-transparent backgrounds

## Data Validation Patterns
Always validate inputs, especially for:
- Element arrays (minimum 4 elements for quiz generation)
- User inputs in forms
- API responses
- State transitions

When working with this codebase, prioritize user experience, performance, and educational value. The chemistry education context means accuracy and clear explanations are crucial.