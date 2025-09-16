# SambhidanX - Democracy Education Platform

An interactive constitutional education platform designed to make Nepal's Constitution accessible and engaging for students, teachers, and citizens.

## 🚀 Features

- **Interactive Lessons**: Comprehensive lessons covering constitutional topics
- **Quiz System**: Engaging quizzes to test understanding
- **Progress Tracking**: Track learning progress and achievements
- **Offline Support**: Learn even without internet connection
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Bilingual Support**: Content available in English and Nepali
- **Progressive Web App**: Install as a native app experience

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for state management and caching
- **Wouter** for lightweight routing
- **Radix UI** for accessible components

### Backend
- **Express.js** with TypeScript
- **SQLite** with Drizzle ORM for database
- **JWT** for authentication
- **Helmet** for security
- **Rate limiting** and CORS protection

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Vitest** for testing
- **TypeDoc** for documentation
- **Husky** for git hooks

## 🏗️ Project Structure

```
democracyedu/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── auth/              # Authentication logic
│   ├── db/                # Database configuration
│   └── middleware/        # Express middleware
├── shared/                # Shared types and utilities
├── content/               # Educational content (lessons & quizzes)
└── tests/                 # Test files
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/democracyedu.git
   cd democracyedu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5001`

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier

### Testing
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:ui` - Open test UI

### Database
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate database migrations
- `npm run db:studio` - Open database management UI

### Build & Deploy
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run validate` - Run all checks (typecheck, lint, test, build)

## 📚 Content Management

Educational content is stored in JSON files under `/content/`:

- **Lessons**: `/content/lessons/` - Structured lesson content
- **Quizzes**: `/content/quizzes/` - Interactive quiz questions
- **Manifest**: `/content/manifest.json` - Content registry

### Adding New Content

1. Create lesson JSON file in `/content/lessons/`
2. Create corresponding quiz in `/content/quizzes/`
3. Update `/content/manifest.json`
4. Run tests to validate schema: `npm test`

## 🧪 Testing

The project includes comprehensive tests:

- **Content Validation**: Ensures all lesson and quiz content follows proper schema
- **Component Tests**: React component unit tests
- **API Tests**: Backend endpoint testing

Run tests with: `npm test`

## 🔒 Security Features

- **CORS Protection**: Configured for secure cross-origin requests
- **Rate Limiting**: Prevents abuse of API endpoints
- **Helmet Security**: Comprehensive security headers
- **Input Validation**: All user inputs are validated
- **Authentication**: JWT-based secure authentication

## 🌐 Progressive Web App

SambhidanX works as a PWA with:

- **Offline Functionality**: Continue learning without internet
- **Service Worker**: Background sync and caching
- **App Installation**: Install directly from browser
- **Responsive Design**: Optimized for all screen sizes

## 📈 Performance

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized asset delivery
- **Caching Strategy**: Smart caching for better performance
- **Bundle Analysis**: Monitor bundle size with `npm run analyze`

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Ensure accessibility compliance
- Follow responsive design principles

### API Guidelines
- Use proper HTTP status codes
- Implement comprehensive error handling
- Validate all inputs
- Document endpoints clearly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Contact the development team
- Check the documentation in `/docs/`

## 🗺️ Roadmap

See [NextPlan.md](NextPlan.md) for detailed development roadmap and planned features.

---

**Made with ❤️ for constitutional education in Nepal**