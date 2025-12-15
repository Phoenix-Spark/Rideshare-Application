# Base Bound 🇺🇸

> Get Where You Need to Go, Together

Base Bound connects service members and base personnel through volunteer-driven ride-sharing. Free, community-powered transportation within your Air Force Base.



## 🎯 Overview

Base Bound is a volunteer-driven ridesharing platform designed specifically for Air Force base communities. Whether you need a ride to the BX, have an appointment at the clinic, or want to help fellow service members get around, Base Bound makes it simple and safe.

**Built by service members, for service members.**

### Key Features

- **100% Free** - No fees, no charges, no subscriptions. Community members volunteer their time to help each other
- **Base Security** - All users are verified base personnel. Rides stay within base boundaries
- **Real-Time Matching** - See available drivers instantly and get notifications when your ride is on the way
- **Community Driven** - Built on the values of service and support. Every ride strengthens our base community
- **Rating System** - Build trust through ratings and feedback. Recognize outstanding community members
- **Easy to Use** - Simple interface designed for quick pickups. Request or offer rides in seconds

## 🚀 How It Works

### 1. Sign Up
Create your account with your military email. Quick verification ensures everyone is part of our community.

### 2. Request or Drive
- **Need a ride?** Post your request with pickup location and destination
- **Have a car and some time?** See if anyone needs a ride and offer to help

### 3. Connect & Go
Get matched with a driver or rider. Coordinate pickup details through the app and you're on your way!

## 💪 Community Stats

- **2,400+** Rides Completed
- **500+** Active Members
- **4.8★** Average Rating

## ⚠️ Important Notice

**Service Not Guaranteed** - Base Bound is a volunteer-driven service. While we strive to connect you with rides, availability depends on community participation. Always have a backup transportation plan.

## 🛠️ Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: Prisma ORM with PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Real-Time Updates**: WebSocket integration

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn package manager
- PostgreSQL (or use Docker)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Phoenix-Spark/Rideshare-Application.git
cd Rideshare-Application
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start with Docker**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
npm run prisma:migrate
```

6. **Start the development server**
```bash
npm run dev
```

7. **Access the application**
Open your browser to `http://localhost:3000`

## 🏗️ Project Structure

```
├── app/                    # Frontend React application
│   ├── components/         # Reusable React components
│   ├── routes/            # Application routes
│   └── styles/            # CSS and styling files
├── server/                # Backend Node.js server
│   ├── controllers/       # Request handlers
│   ├── routes/           # API routes
│   └── middleware/       # Custom middleware
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema definition
├── api/                  # API route handlers
│   └── rides/           # Ride-specific endpoints
├── public/              # Static assets
├── docker-compose.yml   # Docker configuration
└── package.json        # Project dependencies
```

## 🔧 Development

### Available Scripts

**Start development server with hot reload**
```bash
npm run dev
```

**Build for production**
```bash
npm run build
```

**Start production server**
```bash
npm start
```

**Run Prisma Studio (database GUI)**
```bash
npm run prisma:studio
```

**Create a new migration**
```bash
npm run prisma:migrate
```

**Reset database**
```bash
npm run prisma:reset
```

**Run tests**
```bash
npm test
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/basebound"
NODE_ENV="development"
PORT=3000
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"
```

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help makes Base Bound better.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔒 Security & Safety

- All users must verify their military email address
- Rides are limited to within base boundaries
- Built-in rating system promotes accountability
- Report feature for any safety concerns
- User privacy is protected and personal information is never shared without consent

## 📱 Features Roadmap

* Mobile app (iOS & Android)
* Scheduled rides
* Carpool matching for regular commutes
* Integration with base shuttle schedules
* Multi-base support
* Push notifications
* In-app messaging
* Route optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ by Phoenix Spark for the Air Force community.

Special thanks to all the volunteers who make Base Bound possible and to every service member who helps strengthen our community through shared rides.

## 📞 Support

* **Help Center**: Support Documentation at basebound.example.com/help
* **Contact**: support@basebound.example.com
* **Issues**: GitHub Issues at github.com/Phoenix-Spark/Rideshare-Application/issues

## ⚖️ Disclaimer

Base Bound is an unofficial community service and is not affiliated with or endorsed by the United States Air Force, Department of Defense, or any government agency.

---

**Stronger Together** - Base Bound thrives because of volunteers like you. Whether you're offering rides or requesting them, you're helping build a more connected, supportive base community.

*© 2025 Phoenix Spark. Volunteer-driven community service.*