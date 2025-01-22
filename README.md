# AppsByLuke - Web Apps Development Services Website

## Project Overview

AppsByLuke is a developer services website offering custom app development solutions and subscription plans. 
The website showcases various app packages and subscription plans tailored to different business needs.

Project URL: [AppsByLuke](https://appsbyluke.com/)

## Project Structure:

- `/landing` - landing page and registration form
    - Stack:
      - Astro
      - Tailwind CSS
    - Default exposed port: 4321
- `/api` - API for the website
    - Stack:
      - Nest
      - Node.js
      - Fastify
      - PostgreSQL
      - Stripe API 
    - Default exposed port: 3000
- `/dashboard` - dashboard for requests and subscriptions
    - Stack:
      - Vue.js
      - TypeScript
      - Tailwind CSS
    - Default exposed port: 4173
## Prerequisites

- Docker
- Docker Compose

## Installation

To set up the project locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/logical-luke/appsbyluke.git

# Navigate to the project directory
cd appsbyluke

# Build and start containers
docker compose up -d
```

**Please note that provided instructions are for development purposes only.**