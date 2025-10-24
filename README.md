# ChemCraft - Interactive Chemistry Learning Platform

ChemCraft is a modern, interactive web application designed to make chemistry learning fun and engaging. Built with Next.js, TypeScript, and Tailwind CSS, it provides students with an immersive experience to explore the periodic table, mix elements, and test their knowledge through interactive quizzes.

## 🚀 Features

### 🧪 Interactive Periodic Table
- **Visual Elements**: All 118 elements with color-coded categories
- **Detailed Information**: Complete element data including atomic properties, electron configurations, and physical properties
- **Search & Filter**: Find elements by name, symbol, or category
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### ⚗️ Element Mixer
- **Chemical Reactions**: Mix elements to create common compounds
- **Real-time Feedback**: Instant results with compound formation
- **Educational Content**: Learn about chemical bonding and reactions
- **Compound Database**: Information about common compounds and their uses

### 📚 Chemistry Quiz System
- **Multiple Question Types**: Multiple choice, true/false, fill-in-the-blank, and numeric
- **Adaptive Difficulty**: Easy to expert levels
- **Category-based**: Organized by chemistry topics
- **Progress Tracking**: Personal statistics and performance metrics
- **Hints & Explanations**: Built-in learning support

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Mobile-first design
- **Accessibility**: WCAG compliant interface

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Persistence**: LocalStorage with Zustand persist

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/chemcraft.git
   cd chemcraft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🚀 Quick Start

### Method 1: Using Start Scripts (Recommended)
- **Windows**: Double-click `start-dev.bat`
- **PowerShell**: Right-click `start-dev.ps1` → "Run with PowerShell"

### Method 2: Manual Terminal
```bash
# Navigate to project directory
cd "C:\Users\swapn\Desktop\Projects\Chemcraft\chemcraft"

# Start development server
npm run dev
```

### Method 3: VS Code
- Open `chemcraft.code-workspace` in VS Code
- Use Ctrl+Shift+P → "Tasks: Run Task" → "Start Dev Server"

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run dev:turbo` - Start with Turbo mode (faster)
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - TypeScript checking
- `npm run clean` - Clean build files
- `npm run reinstall` - Clean reinstall

3. **Start development:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
chemcraft/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── periodic/          # Periodic table section
│   │   ├── mixer/             # Element mixer section
│   │   └── quiz/              # Quiz section
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PeriodicTable.tsx
│   │   ├── ElementCard.tsx
│   │   └── QuizCard.tsx
│   ├── stores/               # Zustand state management
│   │   ├── elementStore.ts
│   │   ├── quizStore.ts
│   │   └── themeStore.ts
│   ├── lib/                  # Utility functions
│   │   ├── elementUtils.ts
│   │   ├── compoundUtils.ts
│   │   └── quizUtils.ts
│   ├── types/                # TypeScript definitions
│   │   ├── element.ts
│   │   ├── compound.ts
│   │   └── quiz.ts
│   ├── constants/            # Static data
│   │   ├── elements.ts
│   │   └── quizData.ts
│   └── styles/               # Global styles
│       └── globals.css
├── public/                   # Static assets
│   └── data/
│       └── periodic-table.json
└── package.json
```

## 🎯 Key Features Explained

### Periodic Table
- **Interactive Elements**: Click any element to view detailed information
- **Category Filtering**: Filter by element categories (metals, nonmetals, etc.)
- **Search Functionality**: Find elements quickly by name or symbol
- **Visual Representation**: Color-coded elements with hover effects

### Element Mixer
- **Compound Formation**: Combine elements to create known compounds
- **Chemical Reactions**: Learn about synthesis reactions
- **Success/Failure Feedback**: Educational messages for failed combinations
- **Compound Database**: Detailed information about created compounds

### Quiz System
- **Question Types**: 
  - Multiple Choice
  - True/False
  - Fill in the Blank
  - Numeric Input
- **Difficulty Levels**: Easy, Medium, Hard, Expert
- **Categories**: Atomic Structure, Bonding, Reactions, etc.
- **Progress Tracking**: Score history and statistics

## 🎨 Design Philosophy

ChemCraft follows modern design principles:

- **User-Centered**: Intuitive navigation and clear information hierarchy
- **Responsive**: Mobile-first approach with progressive enhancement
- **Accessible**: WCAG guidelines compliance
- **Performance**: Optimized for fast loading and smooth interactions
- **Consistent**: Unified design language across all components

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🌟 Future Enhancements

- **3D Molecular Viewer**: Interactive 3D representations of molecules
- **Advanced Calculations**: Stoichiometry and equation balancing tools
- **User Accounts**: Save progress and compete with friends
- **Lesson Plans**: Structured learning paths for different skill levels
- **API Integration**: Real-time chemical data and research updates

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chemical Data**: Based on IUPAC standards and scientific literature
- **Design Inspiration**: Modern chemistry textbooks and educational platforms
- **Community**: Thanks to all contributors and chemistry educators

## 📧 Contact

- **Email**: contact@chemcraft.com
- **Website**: https://chemcraft.com
- **GitHub**: https://github.com/yourusername/chemcraft

---

Made with ❤️ for chemistry students and educators worldwide.
