# Personal Finance Tracker

A full-stack web application for tracking personal expenses and managing budgets with multi-currency support and visual spending reports.

## Features

- **Transaction Management**: Add, view, and categorize transactions
- **Multi-Currency Support**: Support for USD, EUR, GBP, JPY, CAD, AUD with real-time exchange rates
- **Monthly Reports**: Filter transactions by month and view spending patterns
- **Visual Analytics**: Interactive bar charts showing spending by category
- **Real-time Exchange Rates**: Integration with ExchangeRate-API for current currency conversion

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Chart.js, Axios, Lucide React icons
- **Backend**: Node.js, Express.js, PostgreSQL
- **Database**: PostgreSQL 15 with optimized indexing
- **Containerization**: Docker & Docker Compose
- **External API**: ExchangeRate-API for currency conversion

## Project Structure

```
├── src/                     # React frontend source
│   ├── components/          # React components
│   │   ├── AddTransaction.jsx
│   │   ├── TransactionList.jsx
│   │   └── SpendingChart.jsx
│   ├── App.jsx             # Main application component
│   └── index.css           # Tailwind CSS styles
├── backend/                # Express.js backend
│   ├── server.js          # Main server file
│   ├── init-db.sql        # Database schema
│   ├── package.json       # Backend dependencies
│   └── Dockerfile         # Backend container config
├── docker-compose.yml     # Multi-container orchestration
├── Dockerfile.frontend    # Frontend container config
└── nginx.conf            # Nginx configuration
```

## Database Schema

### Tables

- **users**: User account information
- **categories**: Expense categories (Food, Transportation, etc.)
- **transactions**: Individual expense records with currency support
- **budgets**: Monthly budget allocations per category

### Key Features

- Foreign key relationships ensuring data integrity
- Optimized indexes for fast querying
- Automatic timestamp tracking
- Support for multiple currencies

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

### Installation & Setup

1. **Clone and start the application**:
   ```bash
   git clone <repository-url>
   cd personal-finance-tracker
   docker-compose up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

3. **Test the setup**:
   - Visit http://localhost:3000 to access the web interface
   - Add your first transaction using the "Add Transaction" tab
   - View your transactions in the "Transactions" tab
   - Check spending reports in the "Reports" tab

## API Endpoints

### Transactions
- `POST /transactions` - Add a new transaction
- `GET /transactions?month=YYYY-MM` - Get transactions for a specific month

### Reports
- `GET /spending-report?month=YYYY-MM` - Get spending summary by category

### Utilities
- `GET /exchange-rate?from=USD&to=EUR` - Get current exchange rate
- `GET /health` - API health check

## Configuration

### Environment Variables

The application uses hardcoded configuration for simplicity:

- **Database**: `financeuser:password123@postgres:5432/financedb`
- **Exchange API**: Integrated with ExchangeRate-API
- **Ports**: Frontend (3000), Backend (5000), Database (5432)

### Currency Support

Supported currencies: USD, EUR, GBP, JPY, CAD, AUD

All transactions are stored in their original currency with automatic USD conversion for reporting.

## Development

### Local Development Setup

1. **Start database only**:
   ```bash
   docker-compose up postgres -d
   ```

2. **Run backend locally**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Run frontend locally**:
   ```bash
   npm install
   npm run dev
   ```

### Adding New Features

- **New Categories**: Add to the `CATEGORIES` array in `AddTransaction.jsx`
- **New Currencies**: Add to the `CURRENCIES` array and ensure API support
- **Additional Reports**: Extend the `/spending-report` endpoint

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure PostgreSQL container is running: `docker-compose ps`
   - Check logs: `docker-compose logs postgres`

2. **Exchange Rate API Errors**:
   - Verify API key is correctly set in `backend/server.js`
   - Check network connectivity and API limits

3. **Frontend Build Issues**:
   - Clear Docker cache: `docker system prune`
   - Rebuild containers: `docker-compose up --build`

### Database Reset

To reset the database:
```bash
docker-compose down -v
docker-compose up --build
```

## Production Deployment

For production deployment:

1. Replace hardcoded credentials with environment variables
2. Set up SSL/TLS certificates
3. Configure proper backup strategies for PostgreSQL
4. Set up monitoring and logging
5. Use a reverse proxy (nginx) for load balancing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.