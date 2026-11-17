# Tedtek Engine

Tedtek Engine is the orchestration backend for TerraSunny's website factory.

## Current milestone

This starter implements the Phase 2 backbone:

- NestJS modular monolith
- Prisma + PostgreSQL
- Projects
- WebsiteSpec validation
- Catalog/add-on definitions
- Template registry
- Project status lifecycle
- Generation and WordPress adapter stubs
- Docker Compose for PostgreSQL + Redis
- Basic e2e test

### Not implemented yet

- BullMQ worker/queue
- Real Redis integration
- WordPress provisioning
- Tedtek Core WordPress plugin
- Payments/webhooks
- Authentication
- Domain automation

Those come after the core project/configuration flow is proven.

## Requirements

- Node.js 22+
- pnpm 10+
- Docker Desktop

## Setup

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm start:dev
```

The API runs on:

`http://localhost:4000/v1`

## Useful endpoints

```text
GET  /v1/catalog
GET  /v1/templates
POST /v1/projects
GET  /v1/projects/:id
GET  /v1/projects/:id/status
GET  /v1/generation/health
```

## Example project request

```json
{
  "template": {
    "id": "real-estate-modern",
    "version": "1.0.0"
  },
  "plan": "FREE",
  "business": {
    "name": "Ada's Realty",
    "description": "Modern real estate agency",
    "industry": "real-estate",
    "location": "Lagos"
  },
  "contact": {
    "fullName": "Ada Example",
    "email": "ada@example.com",
    "phone": "+2348000000000",
    "whatsapp": "+2348000000000",
    "address": "Lagos, Nigeria"
  },
  "branding": {
    "logoName": "ada-realty",
    "primaryColor": "#1F7A5A",
    "secondaryColor": "#D9A441",
    "font": "Inter"
  },
  "pages": [
    {
      "key": "home",
      "title": "Home",
      "slug": "/",
      "enabled": true
    }
  ],
  "features": {
    "forms": true,
    "booking": false,
    "ecommerce": false,
    "blog": false,
    "analytics": false
  },
  "content": {
    "services": [
      "Property sales",
      "Property rentals"
    ],
    "notes": ""
  },
  "addonIds": []
}
```

## Architecture

```text
TerraSunny
    |
    | WebsiteSpec
    v
Tedtek Engine
    |
    +-- Projects
    +-- Catalog
    +-- Templates
    +-- Entitlements (via project add-ons)
    +-- Generation
    +-- WordPress adapter
    |
    v
BullMQ / Redis       (next milestone)
    |
    v
WordPress / Tedtek Core
```

## Important pricing note

The catalog prices in this starter are placeholders for development only. Final TerraSunny pricing should be decided before production.
