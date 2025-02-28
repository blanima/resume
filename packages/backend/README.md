# Resume - Backend

## Table of Contents

1. [Introduction](#introduction)
2. [Specifications](#specifications)
3. [Project Structure](#project-structure)
4. [Installation](#installation)

## Introduction

This project is the backend part of the resume application. It manages the data used for the resume app, including experiences, skills, and other relevant information. The backend is responsible for handling API requests, data persistence, and business logic.

## Specifications

The backend project uses tRPC within an Express server to handle API requests and manage data. Additionally, it employs basic authentication middleware to ensure that only users with admin privileges can access certain functionalities.

## Project Structure

The backend project is separated into several key folders and files. This is derived from Robert C. Martin's _Clean Architecture_

- application
  - data
    - clients
      - gateway.ts
  - domain
    - entities
    - useCases
    - interactors
    - models
  - presentation
    - controllers
    - presenters
- server
  - router.ts
  - index.ts
- resume.ts

## Installation

To install and run the backend project, follow these steps:

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Set environment variables:**

   Create a `.env` file in the root of the backend directory and set the necessary environment variables as described in the documentation.

3. **Run the project:**

   ```sh
   npm start
   ```

4. **Use Docker Compose:**

   To run the backend project using Docker Compose, navigate to the root of the repository and run:

   ```sh
   docker compose up -d
   ```

   You can also compose up the backend service separately by specifying the service name:

   ```sh
   docker compose up backend -d
   ```
