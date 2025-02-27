# BountyBoard

BountyBoard is a web platform that crawls Reddit for posts where users express willingness to pay for solutions, and displays them on a clean, filterable interface.

## Project Overview

This application consists of:
- A Reddit crawler that collects posts containing key phrases like "I'd pay for..."
- A Django backend with RESTful API endpoints
- A frontend interface built with modern web technologies
- PostgreSQL database for data storage
- User authentication and premium subscription options

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bountyboard.git
cd bountyboard
```

2. Start the Docker containers:
```bash
docker-compose up -d
```

3. Apply Django migrations:
```bash
docker-compose exec web python manage.py migrate
```

4. Create a superuser for the Django admin:
```bash
docker-compose exec web python manage.py createsuperuser
```

5. Access the application:
    - Web interface: http://localhost:8000
    - Admin panel: http://localhost:8000/admin

## Database Structure

The application uses PostgreSQL with the following schema:

- **Users**: User accounts and authentication information
- **Posts**: Reddit posts collected by the crawler
- **Comments**: User comments and notifications
- **Subreddits**: List of subreddits to monitor

You can inspect the database using:
```bash
docker-compose exec postgres psql -U postgres -c "\dt"
```

## API Endpoints

The backend exposes the following API endpoints:

- **GET /api/posts**: Retrieve posts with filtering options
- **POST /api/register**: Register a new user
- **POST /api/login**: Authenticate and receive token
- **POST /api/submit-post**: Manually submit a post

## Development Workflow

### Backend Development

The Django application is located in the `backend/` directory. To make changes:

1. Modify the code in the mounted volume
2. Django's development server will automatically reload

To add a new app:
```bash
docker-compose exec web python manage.py startapp app_name
```

### Database Changes

If you need to modify the database schema:

1. Update models in Django
2. Create migrations:
```bash
docker-compose exec web python manage.py makemigrations
```
3. Apply migrations:
```bash
docker-compose exec web python manage.py migrate
```

To reset the database (during development):
```bash
docker-compose down
rm -rf ./database/volumes/postgres/17/data
docker-compose up -d
```

## Project Structure

```
bountyboard/
├── backend/
│   ├── api/                 # Django API app
│   ├── bountyboard/         # Django project settings
│   ├── crawler/             # Reddit crawler module
│   └── Dockerfile           # Backend container definition
├── database/
│   ├── schema.sql           # Initial database schema
│   └── volumes/             # Persistent database storage
├── frontend/                # Frontend application (to be added)
├── docker-compose.yml       # Container orchestration
└── README.md                # This file
```

## Deployment

For production deployment:

1. Update environment variables in docker-compose.yml
2. Set DEBUG=False in Django settings
3. Use a proper SECRET_KEY
4. Configure secure database passwords
5. Set up HTTPS with a reverse proxy (Nginx recommended)
6. Configure proper CORS settings

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]