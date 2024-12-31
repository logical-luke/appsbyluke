# AppsByLuke - Web Apps Development Services Website

## Project Overview

AppsByLuke is a developer services website offering custom app development solutions and subscription plans. 
The website showcases various app packages and subscription plans tailored to different business needs.

Project URL: [AppsByLuke](https://appsbyluke.com/)

## Project Structure:

- `/landing` - landing page
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
    - Default exposed port: 3000
- `/subscription` - subscription form and payment gateway
    - Stack:
      - Vue.js
      - TypeScript
      - Tailwind CSS
      - Stripe (?) / Padddle (?) / Lemon Squeezy (?)
- `/panel` - user requests and subscription management panel
    - Stack:
      - Vue.js
      - TypeScript
      - Tailwind CSS

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