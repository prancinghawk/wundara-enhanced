# Wundara - Neurodiversity-Affirming Educational Platform

A personalized learning platform designed specifically for neurodivergent children, featuring AI-powered plan generation with comprehensive Australian Curriculum (ACARA) integration.

## 🎯 Project Overview

Wundara creates personalized, neurodiversity-affirming learning experiences that celebrate different learning styles while maintaining alignment with Australian Curriculum standards. The platform generates detailed learning plans with flexible pathways to accommodate various needs and energy levels.

## ✨ Key Features

### 🤖 Enhanced AI Plan Generation
- **Detailed ACARA Integration**: 2,000+ character curriculum context per year level
- **Real Achievement Standards**: AI receives full curriculum descriptions, not just codes
- **Year-Level Specific**: Automatically extracts appropriate content for each age group
- **Curriculum Alignment**: Activities reference specific learning objectives and standards

### 🎨 Neurodiversity-Affirming UI
- **Activity Pathways**: Three flexible approaches (Low Demand, Moderate Structure, High Engagement)
- **PDA-Friendly**: Low-demand options with high autonomy
- **Sensory Considerations**: Built-in accommodations and modifications
- **Success Reframing**: Celebrates engagement over completion

### 📚 Comprehensive Curriculum Library
- **2,678 Curriculum Codes**: Complete Australian Curriculum Version 9.0 integration
- **Real Descriptions**: Detailed learning objectives with subject, year level, and strand
- **Smart Search**: Find curriculum codes by subject, year level, or content
- **Homeschool Compliance**: Detailed curriculum mapping for reporting requirements

### 👥 Child Profile Management
- **Comprehensive Profiles**: Age, neurotype, interests, learning context, and accommodations
- **Multi-Step Wizard**: Intuitive profile creation with progress tracking
- **Neurodiversity Support**: 11+ neurotype options including Autism, ADHD, PDA, Dyslexia
- **Interest Tracking**: Tag-based system with suggestions and custom inputs

## 🏗️ Architecture

### Frontend (Client)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Material Design 3 tokens
- **Routing**: React Router DOM
- **Authentication**: Clerk
- **State Management**: React hooks and context

### Backend (Server)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: Clerk SDK
- **AI Integration**: Anthropic Claude 3 Haiku
- **Development**: ts-node-dev with hot reload

### Key Services
- **Curriculum Context Service**: Loads and parses ACARA documents
- **AI Service**: Enhanced with detailed curriculum context
- **Plan Generation**: Structured JSON output with neurodiversity considerations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- Anthropic API key for AI features

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd windsurf-project
```

2. **Install dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Setup**

Create `.env` file in the server directory:
```env
# Server
PORT=3001
NODE_ENV=development
USE_REAL_AI=true

# Database (Neon / PostgreSQL)
DATABASE_URL=your_neon_database_url

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Anthropic AI
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

Create `.env.local` file in the client directory:
```env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. **Start Development Servers**

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Project Structure

```
windsurf-project/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   │   ├── DailyActivityView.tsx # Enhanced activity display
│   │   │   └── ...
│   │   ├── services/                # API services
│   │   ├── utils/                   # Utility functions
│   │   │   └── curriculumLibrary.ts # 2,678 ACARA curriculum codes
│   │   └── ui/                      # UI component library
│   └── package.json
├── server/                          # Express backend
│   ├── src/
│   │   ├── data/
│   │   │   └── acara/              # ACARA curriculum documents
│   │   │       ├── aus_curriculum_english_f6.txt
│   │   │       └── aus_curriculum_english_7_10.txt
│   │   ├── routes/                  # API routes
│   │   ├── services/
│   │   │   ├── ai.ts               # Enhanced AI service
│   │   │   └── curriculumContext.ts # ACARA document processor
│   │   └── index.ts
│   └── package.json
└── README.md
```

## 🎨 Enhanced Features

### Activity Pathways
Each activity includes three flexible approaches:

1. **🟢 Low Demand Path** (PDA-friendly)
   - High autonomy, minimal pressure
   - Child-led exploration
   - Flexible completion criteria

2. **🟡 Moderate Structure Path** 
   - Balanced approach with shared control
   - Clear expectations with flexibility
   - Guided steps with choice

3. **🔵 High Engagement Path**
   - Detailed exploration for motivated learners
   - Extended activities and extensions
   - Deep dive opportunities

### Curriculum Integration
- **Real-time Context**: AI receives 2,000+ character curriculum descriptions
- **Achievement Standards**: Full learning objectives, not just codes
- **Year-Level Appropriate**: Content automatically matched to child's age
- **Compliance Ready**: Detailed mapping for homeschool reporting

## 🔧 Development

### Key Technologies
- **TypeScript**: Full type safety across frontend and backend
- **React 18**: Modern React with hooks and concurrent features
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Express.js**: RESTful API with middleware support
- **PostgreSQL**: Relational database with JSON support
- **Clerk**: Authentication and user management
- **Anthropic Claude**: AI-powered content generation

### Build Scripts
```bash
# Client
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# Server
npm run dev          # Development with hot reload
npm run build        # TypeScript compilation
npm start            # Production server
```

## 🚀 Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### Environment Variables for Production
- `DATABASE_URL`: PostgreSQL connection string
- `CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `ANTHROPIC_API_KEY`: Anthropic API key
- `USE_REAL_AI=true`: Enable AI features

## 📊 Recent Enhancements

### Session Accomplishments (September 30, 2025)
1. **Enhanced AI Integration**: Added detailed ACARA curriculum context (2,000+ chars per year)
2. **Fixed Mock Data Issues**: DailyActivityView now shows real activity instructions
3. **Module Resolution**: Resolved ES6/CommonJS conflicts in curriculum library
4. **Activity Pathways**: Restored structured, neurodiversity-affirming UI
5. **Public Sharing**: Cloudflare tunnel setup for external testing

### Technical Improvements
- **Curriculum Context Service**: Automated ACARA document processing
- **Error Handling**: Comprehensive debugging and fallback systems
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized bundle size and loading times

## 🤝 Contributing

This project follows neurodiversity-affirming principles:
- Celebrate different learning styles and approaches
- Provide flexible, choice-based interactions
- Use clear, supportive language
- Accommodate sensory and processing differences
- Focus on engagement over compliance

## 📄 License

This project is proprietary and confidential.

## 🙏 Acknowledgments

- Australian Curriculum, Assessment and Reporting Authority (ACARA) for curriculum standards
- Neurodiversity community for guidance on affirming approaches
- Anthropic for AI capabilities that enable personalized learning

---

**Built with ❤️ for neurodivergent learners and their families**
