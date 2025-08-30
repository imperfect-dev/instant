# 🔐 SecureBackup - Comprehensive Data Backup Application

A modern, full-featured data backup application built with React, TypeScript, Node.js, and MongoDB. Designed for deployment on Render with enterprise-grade features including real-time analytics, automated scheduling, health monitoring, and advanced security.

![SecureBackup Dashboard](https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

## 🌟 Features

### 🔒 **Security & Data Protection**
- **End-to-End Encryption** for all uploaded files
- **Audit Logging** for all user activities
- **Secure File Storage** with encryption at rest
- **HTTPS Enforcement** for all data transfers

### 📊 **Analytics & Monitoring**
- **Real-time Dashboard** with key performance metrics
- **Interactive Charts** using Chart.js for data visualization
- **Storage Usage Analytics** with breakdown by file type
- **Backup Success Rate Tracking** and trend analysis
- **Performance Metrics** monitoring upload/download speeds
- **Cost Analysis** with detailed breakdown
- **Health Monitoring** system with alerts and recommendations

### ⏰ **Automation & Scheduling**
- **Flexible Backup Scheduling** (hourly, daily, weekly, monthly)
- **Automated Backup Execution** with cron-like functionality
- **Incremental & Full Backup** support
- **Custom Path Inclusion/Exclusion** rules
- **Backup Retry Logic** with exponential backoff
- **Schedule Management** with enable/disable controls

### 📁 **File Management**
- **Drag & Drop Upload** with progress tracking
- **Folder Structure Preservation** for complete backups
- **File Preview** for images, videos, audio, and documents
- **File Sharing** with secure links and access controls
- **Version Control** for file history tracking
- **Trash Bin** with 30-day retention policy
- **File Compression** to optimize storage usage

### 🎨 **User Experience**
- **Responsive Design** optimized for all devices
- **Dark/Light Theme** support (coming soon)
- **Real-time Notifications** for all operations
- **Progressive Web App** capabilities
- **Offline Support** for critical functions
- **Accessibility** compliant (WCAG 2.1)

### 🏢 **Enterprise Features**
- **Team Collaboration** with shared workspaces
- **Admin Panel** for user and system management
- **Multi-tenant Architecture** support
- **API Rate Limiting** and request throttling
- **Comprehensive Logging** and error tracking
- **Scalable Architecture** for high-volume usage

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** 5.0+ (MongoDB Atlas recommended)
- **Git** for version control

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/securebackup.git
   cd securebackup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/backup-app
   ENCRYPTION_KEY=your-32-character-encryption-key
   NODE_ENV=development
   PORT=3000
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod --dbpath /path/to/your/db
   ```

5. **Run the application**
   ```bash
   # Development mode (frontend + backend)
   npm run dev
   
   # Or run separately:
   # Frontend (port 5173)
   npm run dev:client
   
   # Backend (port 3000)
   npm run dev:server
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api
   - Health Check: http://localhost:3000/health

## 🌐 Deployment on Render

### Automatic Deployment

1. **Fork this repository** to your GitHub account

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

3. **Environment Variables**
   The following variables will be automatically configured:
   - `MONGODB_URI` - Connected to Render's MongoDB
   - `ENCRYPTION_KEY` - Auto-generated encryption key
   - `NODE_ENV` - Set to "production"

4. **Custom Domain** (Optional)
   - Go to your service settings
   - Add your custom domain
   - Configure DNS records as instructed

### Manual Deployment

1. **Create Web Service**
   ```yaml
   # Build Command
   npm install && npm run build
   
   # Start Command  
   node server/index.js
   
   # Environment
   NODE_ENV=production
   ```

2. **Create MongoDB Database**
   - Add a new PostgreSQL database (or use MongoDB Atlas)
   - Copy the connection string to `MONGODB_URI`

3. **Configure Environment Variables**
   ```env
   MONGODB_URI=your-mongodb-connection-string
   ENCRYPTION_KEY=your-encryption-key
   NODE_ENV=production
   ```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop** (1920px+) - Full feature set with multi-column layouts
- **Laptop** (1024px-1919px) - Optimized sidebar and content areas
- **Tablet** (768px-1023px) - Collapsible sidebar, touch-friendly controls
- **Mobile** (320px-767px) - Mobile-first design, bottom navigation

### Key Responsive Features:
- **Adaptive Navigation** - Sidebar collapses to hamburger menu on mobile
- **Touch Gestures** - Swipe support for mobile interactions
- **Flexible Grids** - CSS Grid and Flexbox for optimal layouts
- **Scalable Typography** - Fluid font sizes using clamp()
- **Optimized Images** - Responsive images with proper aspect ratios

## 🔧 API Documentation

### Authentication Endpoints

```typescript
// No authentication required - public access
```

### Backup Management

```typescript
GET    /api/backups              // List all backups
POST   /api/backups              // Create new backup
GET    /api/backups/:id          // Get specific backup
PUT    /api/backups/:id          // Update backup
DELETE /api/backups/:id          // Delete backup
GET    /api/backups/stats/overview // Get backup statistics
```

### File Operations

```typescript
POST   /api/files/upload         // Upload files
GET    /api/files/:id            // Download file
DELETE /api/files/:id            // Delete file
POST   /api/files/:id/share      // Create share link
```

### Analytics & Monitoring

```typescript
GET /api/analytics/dashboard     // Dashboard metrics
GET /api/analytics/storage       // Storage analytics
GET /api/analytics/performance   // Performance metrics
GET /api/health                  // System health check
```

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── analytics/      # Analytics dashboard
│   ├── monitoring/     # Health monitoring
│   ├── scheduler/      # Backup scheduling
│   └── fileManager/    # File management
├── hooks/              # Custom React hooks
├── services/           # API and utility services
├── contexts/           # React context providers
└── types/              # TypeScript type definitions
```

### Backend Architecture
```
server/
├── models/             # MongoDB schemas
├── routes/             # API route handlers
├── middleware/         # Express middleware
├── services/           # Business logic services
└── utils/              # Utility functions
```

### Database Schema

**Users Collection**
```javascript
{
  _id: ObjectId,
  // Removed user authentication fields
  // App now works without user accounts
  createdAt: Date,
  updatedAt: Date
}
```

**BackupSessions Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  type: String (enum),
  status: String (enum),
  files: [FileSchema],
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

### Data Protection
- **AES-256 Encryption** for all stored files
- **Secure Key Management** with environment variables
- **HTTPS Enforcement** in production
- **CORS Configuration** for API security
- **Input Validation** and sanitization
- **NoSQL Injection Prevention** with parameterized queries

### Infrastructure Security
- **Environment Variable** protection
- **Secrets Management** through Render
- **Database Connection** encryption
- **API Rate Limiting** to prevent abuse
- **Error Handling** without information leakage

## 📊 Performance Optimization

### Frontend Optimization
- **Code Splitting** with dynamic imports
- **Lazy Loading** for non-critical components
- **Image Optimization** with WebP support
- **Bundle Analysis** and size optimization
- **Caching Strategies** for API responses
- **Service Worker** for offline functionality

### Backend Optimization
- **Database Indexing** for query performance
- **Connection Pooling** for MongoDB
- **Response Compression** with gzip
- **Caching Layer** with Redis (optional)
- **Background Jobs** for heavy operations
- **Memory Management** and garbage collection

### Database Optimization
- **Compound Indexes** for complex queries
- **Aggregation Pipelines** for analytics
- **Data Archiving** for old records
- **Connection Optimization** with pooling
- **Query Performance** monitoring

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Coverage
- **Unit Tests** for utility functions
- **Integration Tests** for API endpoints
- **Component Tests** for React components
- **E2E Tests** for user workflows
- **Performance Tests** for load testing

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Domain DNS configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured

### Post-deployment
- [ ] Health check endpoints responding
- [ ] File upload/download functional
- [ ] Analytics dashboard loading
- [ ] Performance monitoring active

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Conventional Commits** for commit messages
- **Code Reviews** required for all PRs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)
- [FAQ](docs/faq.md)

### Community
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Community support and questions
- **Discord** - Real-time community chat
- **Email** - support@securebackup.com

### Professional Support
For enterprise support, custom development, or consulting services, contact us at enterprise@securebackup.com.

---

## 🎯 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced file versioning
- [ ] User authentication system (optional)
- [ ] Advanced analytics and reporting
- [ ] Integration with cloud storage providers

### Version 2.1 (Q3 2024)
- [ ] AI-powered file organization
- [ ] Multi-user support
- [ ] Performance optimizations
- [ ] Enhanced mobile experience

---

**Built with ❤️ for secure data backup**

*Secure your data, secure your future.*