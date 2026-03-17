# Lernify - AI-Powered Learning Platform

A modern learning platform that transforms study materials into interactive AI-powered tools. Upload documents, generate smart flashcards, and test your knowledge with AI-created quizzes.

## 🚀 Features

- **Document Management**: Upload and organize PDFs, Word docs, and more
- **AI Flashcards**: Automatically generate flashcards from any document
- **Smart Quizzes**: AI creates personalized quizzes from your content
- **Progress Dashboard**: Track your learning journey with detailed analytics
- **AI Chat**: Get help with your study materials through AI-powered conversations
- **Dark/Light Mode**: Modern UI with theme switching
- **Responsive Design**: Works seamlessly on all devices

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** as build tool
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **GSAP** for animations
- **React Hook Form** for form management
- **Sileo** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Google OAuth** for social login
- **Gemini AI** for AI features

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB
- Google Cloud Project (for Gemini API)
- Google OAuth credentials

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lernify
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend/Lernify
npm install

# Install backend dependencies
cd ../../backend
npm install
```

### 3. Environment Setup

#### Frontend Environment Variables
Create `.env` file in `frontend/Lernify/`:

```env
VITE_API_URL=http://localhost:3000
```

#### Backend Environment Variables
Create `.env` file in `backend/`:

```env
PORT=3000
JWT_SECRET=JisG21$BsdYrnBz5jh%34asDEtF43@==
MONGODB_URI=mongodb://pujanmestry_db_user:kTBXCNJKN943NBdp@ac-uzh5afd-shard-00-00.2yknuh7.mongodb.net:27017,ac-uzh5afd-shard-00-01.2yknuh7.mongodb.net:27017,ac-uzh5afd-shard-00-02.2yknuh7.mongodb.net:27017/myDatabaseName?ssl=true&authSource=admin&retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSyDT-OV9z2fCF6LJxwXFfVjhrXTzRQ24w_I
CLIENT_ID=629033897800-kkghde3kpho3trphlhjipokvc26o0nna.apps.googleusercontent.com
CLIENT_SECRET=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
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start the Development Servers

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend/Lernify directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📁 Project Structure

```
lernify/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── .env
│   └── package.json
├── frontend/
│   └── Lernify/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   │   ├── auth/
│       │   │   ├── dashboard/
│       │   │   └── landing/
│       │   ├── services/
│       │   ├── utils/
│       │   └── types/
│       ├── .env
│       └── package.json
└── README.md
```

## 🔐 Authentication

The app supports two authentication methods:
1. **Email/Password** - Traditional registration and login
2. **Google OAuth** - Sign in with Google account

## 🤖 AI Features

### Gemini AI Integration
- **Document Analysis**: AI analyzes uploaded documents to extract key concepts
- **Flashcard Generation**: Automatically creates question-answer pairs from content
- **Quiz Creation**: Generates multiple-choice questions based on document content
- **AI Chat**: Interactive chat to help with study materials

## 📊 Key Features in Detail

### Document Management
- Upload PDF, Word, and other document formats
- Organize documents in folders
- Track reading progress and completion status
- AI-powered content extraction

### Flashcards
- Automatic flashcard generation from documents
- Spaced repetition algorithm for optimal learning
- Study sessions with progress tracking
- Custom flashcard creation

### Quizzes
- AI-generated multiple-choice questions
- Instant feedback and explanations
- Score tracking and analytics
- Difficulty adaptation

### Dashboard Analytics
- Learning progress visualization
- Study streak tracking
- Performance metrics
- Activity history

## 🎨 UI/UX Features

- **Modern Design**: Clean, minimalist interface
- **Dark Mode**: Automatic theme switching
- **Responsive**: Mobile-first design
- **Animations**: Smooth GSAP animations
- **3D Elements**: Interactive 3D book models (Unicorn Studio)
- **Glass Morphism**: Modern glass effects

## 🔧 Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in hosting platform

### Backend (Heroku/Railway)
1. Deploy the Node.js application
2. Set all environment variables
3. Configure MongoDB connection
4. Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB URI in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Gemini API Error**
   - Verify API key is correct
   - Check Google Cloud project setup
   - Ensure API is enabled

3. **CORS Issues**
   - Check `FRONTEND_URL` in backend `.env`
   - Verify CORS configuration

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

The project is actively being developed with regular updates and new features. Check the repository for the latest version.

---

**Built with ❤️ for learners everywhere**
