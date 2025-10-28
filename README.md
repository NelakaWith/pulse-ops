# 🩺 PulseOps - GitHub Analytics Dashboard

A modern **GitHub analytics dashboard** built with **Next.js 16** and **TypeScript**, featuring real-time user metrics, contribution visualization, and language usage insights. Demonstrates advanced data visualization, GraphQL integration, and modern React patterns.

---

## 🎯 Project Overview

PulseOps transforms GitHub user data into actionable insights through interactive charts and metrics cards. The dashboard fetches comprehensive user information via GitHub's GraphQL API and presents it in a clean, responsive interface perfect for developers, recruiters, and team leads.

**Key Highlights:**

- 📈 **Real-time GitHub Analytics** - Live contribution data and repository insights
- 🎨 **Modern UI/UX** - Clean design with shadcn/ui components and Tailwind CSS
- 📊 **Interactive Charts** - Line charts for contributions, bar charts for language usage
- 🔧 **TypeScript-First** - Full type safety across components and API integration
- ⚡ **Performance Optimized** - Efficient data fetching with Apollo GraphQL client

---

## 🛠️ Tech Stack

| **Category**         | **Technology**             | **Purpose**                                |
| -------------------- | -------------------------- | ------------------------------------------ |
| **Framework**        | Next.js 16 (App Router)    | Server-side rendering, routing, API routes |
| **Language**         | TypeScript 5               | Type safety and developer experience       |
| **Styling**          | Tailwind CSS 4 + shadcn/ui | Responsive design and component library    |
| **Data Fetching**    | Apollo Client + GraphQL    | Efficient GitHub API integration           |
| **Charts**           | Recharts 2.15              | Interactive data visualizations            |
| **Icons**            | Lucide React               | Consistent, modern iconography             |
| **State Management** | React 19 (built-in hooks)  | Component state and data flow              |

---

## ✨ Features

### 📊 **User Metrics Dashboard**

- Real-time repository count, commit contributions, pull requests, and releases
- Color-coded metric cards with responsive design
- GitHub avatar and profile information display

### 📈 **Contribution Analytics**

- Interactive line chart showing weekly contribution patterns
- Contribution calendar data with color-coded activity levels
- Total contribution statistics and trends

### 🌍 **Language Usage Insights**

- Horizontal bar chart displaying programming language distribution
- GitHub's official language colors for accurate representation
- Percentage-based tooltips and visual breakdown

### 🎨 **Modern Interface**

- Responsive sidebar navigation with collapsible design
- Dark/light theme support (ready for implementation)
- Consistent spacing and typography using Tailwind CSS
- Smooth animations and transitions

---

## 📁 Project Structure

```
pulse-ops/
├── app/
│   ├── layout.tsx                    # Root layout with sidebar
│   ├── page.tsx                      # Home page
│   ├── metrics/
│   │   ├── page.tsx                  # Main metrics dashboard
│   │   ├── types.ts                  # Shared TypeScript interfaces
│   │   └── components/
│   │       ├── userMetrics.tsx       # User profile and metric cards
│   │       ├── contributionChart.tsx # Weekly contribution line chart
│   │       └── languageUsage.tsx     # Language distribution chart
│   └── api/
│       └── github/
│           └── route.ts              # GraphQL proxy endpoint
├── components/
│   ├── ui/                           # shadcn/ui components (Card, Button, etc.)
│   └── app-sidebar.tsx               # Navigation sidebar
├── hooks/
│   └── use-mobile.ts                 # Responsive design hook
├── lib/
│   └── utils.ts                      # Utility functions and helpers
└── public/                           # Static assets
```

---

## 🔧 Key Technical Concepts

### **GraphQL Integration**

- GitHub GraphQL API v4 for comprehensive user data fetching
- Efficient query structure retrieving repositories, contributions, and languages
- Type-safe data fetching with generated TypeScript interfaces

### **Data Visualization**

- Recharts integration with custom chart configurations
- Responsive chart containers that adapt to different screen sizes
- Color consistency using GitHub's official language color palette

### **Component Architecture**

- Separation of concerns: data fetching in page components, presentation in UI components
- Reusable metric card system with data-driven rendering
- Type-safe props and interfaces throughout the component tree

### **Modern React Patterns**

- React 19 with latest hooks and patterns
- Memoized computations for expensive data transformations
- Efficient re-rendering with proper dependency arrays

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub Personal Access Token

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pulse-ops.git
cd pulse-ops

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your GitHub token to .env.local:
# GITHUB_TOKEN=ghp_your_token_here

# Run development server
npm run dev
```

### Environment Variables

```bash
# .env.local
GITHUB_TOKEN=ghp_your_github_personal_access_token
```

**Getting a GitHub Token:**

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` and `user` scopes
3. Copy token to your `.env.local` file

---

## 🎨 Demo Screenshots

_work in progress_

---

## 🔮 Future Enhancements

- [ ] **Multi-user Support** - Compare multiple GitHub profiles
- [ ] **Advanced Analytics** - Commit frequency patterns, repository health scores
- [ ] **Export Features** - PDF reports and data export functionality
- [ ] **Real-time Updates** - WebSocket integration for live data updates
- [ ] **Team Analytics** - Organization-level insights and team comparisons
- [ ] **Mobile App** - React Native version for mobile analytics

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**🫡 Nelaka Withanage**

- **GitHub**: [@NelakaWith](https://github.com/NelakaWith)
- **LinkedIn**: [in/nelaka-withanage](https://www.linkedin.com/in/nelaka-withanage/)
- **Portfolio**: [nelakawith.netlify.app](https://nelakawith.netlify.app/)

---

## 📝 License

This project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 - see the [LICENSE](LICENSE) file for details.

_Built with ❤️ using Next.js, TypeScript, and the GitHub GraphQL/REST APIs_
