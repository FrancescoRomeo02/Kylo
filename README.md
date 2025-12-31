# Kylo - Nutrition Tracking App 🍎

Kylo is a modern, elegant nutrition tracking application built with React Native and Expo. Designed for athletes and fitness enthusiasts, it provides comprehensive macro tracking, personalized diet planning, and an intuitive food logging experience.

## Features ✨

- **🔐 Authentication**: Secure user authentication powered by Supabase Auth
- **📊 Macro Tracking**: Real-time tracking of calories, proteins, carbs, and fats
- **🎯 Custom Diet Plans**: Personalized diet targets with preset options (Balanced, High Protein, Keto, Low Carb)
- **📅 Daily Nutrition View**: Visual progress tracking with macro circles and calorie goals
- **🍽️ Meal Management**: Organize foods by meal type (Breakfast, Lunch, Dinner, Snacks)
- **🔍 Food Search**: Quick food search and multi-select for easy logging
- **🎨 Dark Mode**: Beautiful dark theme with purple accent colors
- **💾 Data Persistence**: All data securely stored in Supabase

## Tech Stack 🛠️

- **Framework**: [Expo](https://expo.dev) / React Native
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Backend**: [Supabase](https://supabase.com) (PostgreSQL + Auth)
- **State Management**: Zustand
- **UI Components**: Custom components with Expo icons
- **Styling**: React Native StyleSheet with consistent theme system

## Project Structure 📁

```
kylo/
├── app/                    # File-based routing
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── searchFood.tsx     # Food search modal
├── components/
│   ├── pages/             # Page-level components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api/               # API layer (Supabase queries)
│   ├── supabase.ts        # Supabase client
│   └── types.ts           # TypeScript type definitions
├── store/                 # Zustand state management
├── constants/             # Theme and constants
└── hooks/                 # Custom React hooks
```

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (for mobile testing) or iOS Simulator / Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kylo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Database Schema 🗄️

### Tables

- **profiles**: User profile information
- **diet_targets**: Personalized diet goals and macro targets
- **food_logs**: Individual food entries with nutritional data

## Development Scripts 📝

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run reset-project` - Reset to blank slate

## Code Quality ✅

This project follows best practices:
- ✅ TypeScript strict mode enabled
- ✅ Consistent error handling across API layer
- ✅ Proper type safety (no `any` types)
- ✅ Performance optimizations (memoization, proper keys)
- ✅ Error boundaries for crash protection
- ✅ Centralized theme system

## Environment Variables 🔑

Required environment variables (see `.env.example`):
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

> **Note**: Never commit `.env` file to version control. It's already in `.gitignore`.

## Contributing 🤝

This project is under active development. Contributions, issues, and feature requests are welcome!

## License 📄

[Add your license here]

## Contact 📧

[Add contact information]

---

Built with ❤️ using Expo and React Native

