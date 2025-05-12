# CRUD API Project

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-29.0+-C21325.svg?logo=jest)](https://jestjs.io/)

A robust RESTful CRUD API built with Node.js, TypeScript, and Express-like HTTP server, featuring comprehensive
validation and testing.

## Features

- **Full CRUD Operations** (Create, Read, Update, Delete)
- **TypeScript Support** - Strong typing throughout the application
- **Request Validation** - Runtime type checking for all inputs
- **Unit & Integration Tests** - 100% endpoint coverage with Jest
- **Modern Tooling**:
    - Webpack for production builds
    - ESLint + Prettier for code quality
    - ts-node-dev for development

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Testing**: Jest + Supertest
- **Build**: Webpack
- **Code Quality**: ESLint, Prettier

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crud_api.git
   cd crud_api

Install dependencies:
npm install

Set up environment variables (create .env file):
PORT=4000
NODE_ENV=development

Usage
Development mode:
npm run start:dev

Production build:
npm run build
npm run start:prod

Running tests:
npm test

PI Endpoints
Method Endpoint Description

- GET /api/users Get all users
- GET /api/users/{id} Get user by ID
- POST /api/users Create new user
- PUT /api/users/{id} Update existing user
- DELETE /api/users/{id} Delete user

👨🏽‍💻Author
German Gribanov