# 🚀 AI-Powered Website Builder

**Build Stunning Websites with AI Assistance**  
Transform your ideas into fully functional websites using cutting-edge AI technology. This project leverages Next.js, Tailwind CSS, and gemini AI model to streamline web development.

[Live Preview](https://ai-website-builder-mu.vercel.app/)
(AI requests fails on the deployment server, it works fine in the local machine)

![Image](https://github.com/user-attachments/assets/024b29be-3059-492d-bdcc-d82af0325e64)

![Image](https://github.com/user-attachments/assets/c30f1bfe-5098-4c22-ab2b-0537f1802322)

![Image](https://github.com/user-attachments/assets/f7187bb9-1905-444c-9b0d-1fc47d8ec9c9)



---

## 🌟 Features

### 🤖 AI-Powered Assistance
- **Content Generation**: Automatically generate SEO-friendly text, images, and code snippets using AI.
- **Code Synthesis**: Convert natural language prompts into React components with real-time previews.
- **Smart Recommendations**: Get AI-driven suggestions for layout improvements and design enhancements.

### 🎨 Design & Collaboration
- **Theme Customization**: Switch between light/dark modes and customize themes effortlessly.
- **Real-Time Collaboration**: Multiple users can edit simultaneously using [Convex](https://convex.dev) backend.
- **Export Options**: Download generated code as ZIP files for seamless integration into other projects.

### ⚡ Modern Tech Stack
- **Next.js 14**: Server-side rendering, API routes, and optimized performance.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **AI Integration**: Powered by Gemini Flash 2.0 for intelligent content generation.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- npm, yarn, or pnpm
- Gemini API key (for AI features)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-website-builder.git
   cd ai-website-builder

2. Install Dependencies
```bash
npm install  # or yarn/pnpm
```

3. Set Up Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

4. Start the Development Server
```bash
npm run dev
```

5. Visit the Application
Open your browser and go to:
```
http://localhost:3000
```

---

# Project Structure

```bash
.
├── app/           # Next.js page routes and layouts
├── components/    # Reusable React components (Header, AI Chat, etc.)
├── config/        # AI model configurations and API settings
├── context/       # React context providers (Theme, User, AI State)
├── convex/        # Convex backend functions and database schema
├── data/          # Static data and prompt templates
├── lib/           # Utilities (API clients, theme handlers)
├── public/        # Static assets (images, fonts)
├── styles/        # Global CSS and Tailwind configurations
```
---

# 🔧 Tech Stack

| Technology       | Purpose                          |
|-----------------|--------------------------------|
| **Next.js**      | Framework for SSR & Routing   |
| **Tailwind CSS** | Styling & Responsive Design   |
| **Convex**       | Real-time Database & Backend  |
| **Gemini API**   | AI Content Generation        |
| **React Markdown** | Render AI-generated Markdown |



---

# 📚 Documentation

- **[Next.js: Official Guide](https://nextjs.org/docs)**
- **[Tailwind CSS: Documentation](https://tailwindcss.com/docs)**
- **[Convex Setup: Getting Started](https://docs.convex.dev/quickstart)**
- **[Gemini API: API Reference](https://ai.google.dev/docs)

---

# 🚀 Deployment
Deploy to Vercel in one click:

[![Deploy](https://vercel.com/button)](https://vercel.com/new)

## Required Environment Variables:
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_CONVEX_URL`

---

# 🤝 Contributing
We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

# 📜 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

# 🙌 Acknowledgements
- **Google Gemini AI** for advanced language models
- **Vercel** for hosting support
- **Convex** for real-time backend infrastructure

