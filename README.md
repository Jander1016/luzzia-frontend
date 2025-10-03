# ⚡ Luzzia Energy Dashboard

> **Smart Electricity Price Monitoring Platform**  
> Real-time visualization and analysis of Spanish electricity market prices

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=flat-square&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=flat-square&logo=react)

## 🚀 Overview

Luzzia is a modern web application that provides real-time monitoring and analysis of electricity prices in Spain. Built with Next.js 15 and TypeScript, it offers interactive charts, price predictions, and smart recommendations to help users optimize their energy consumption.

### ✨ Key Features

- **📊 Interactive Charts** - Bar, Line, and Pie charts with responsive design
- **🔔 Price Alerts** - Smart notifications for price changes
- **📱 Mobile-First** - Optimized for all devices with progressive enhancement
- **⚡ Real-Time Data** - Live electricity price updates
- **🎨 Modern UI** - Dark theme with smooth animations and micro-interactions
- **💡 Smart Recommendations** - AI-powered energy saving suggestions

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.4 | React framework with App Router |
| **TypeScript** | 5.x | Type-safe development |
| **TailwindCSS** | 4.x | Utility-first CSS framework |
| **React** | 19.1.0 | UI library with latest features |
| **Lucide React** | Latest | Modern icon library |
| **Radix UI** | Latest | Accessible component primitives |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── precios/           # Price monitoring page
│   ├── ahorro/            # Savings calculator
│   ├── diagnostico/       # Energy diagnostics
│   └── dispositivos/      # Device management
├── components/
│   ├── dashboard/         # Dashboard components
│   │   └── chart/         # Interactive charts
│   ├── layout/            # Layout components
│   ├── notifications/     # Notification system
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── services/              # API services
├── types/                 # TypeScript definitions
└── styles/                # Custom CSS
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jander1016/luzzia-frontend.git
   cd luzzia-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript checks |

## 📊 Features in Detail

### Interactive Charts
- **Bar Chart**: Hourly price comparison with gradient effects
- **Line Chart**: Trend analysis with interactive data points
- **Pie Chart**: Price distribution with detailed breakdowns

### Smart Notifications
- Real-time price alerts
- Customizable thresholds
- Energy saving recommendations

### Responsive Design
- Mobile-first approach
- Progressive enhancement for larger screens
- Touch-friendly interactions

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradients for interactive elements
- **Success**: Green for low prices
- **Warning**: Yellow for medium prices  
- **Danger**: Red for high prices
- **Background**: Dark slate theme

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Monospace**: For price displays

## 🔮 Future Enhancements

- [ ] PWA support for offline functionality
- [ ] Advanced price prediction algorithms
- [ ] Integration with smart home devices
- [ ] Multi-language support
- [ ] Export data functionality
- [ ] Historical data analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jander1016**  
- GitHub: [@Jander1016](https://github.com/Jander1016)

---

<div align="center">
  <p>Built with ❤️ for a more efficient energy future</p>
  <p>⚡ Luzzia - Smart Energy Management</p>
</div>