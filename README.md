# Resume

## Table of Contents

1. [Introduction](#introduction)
2. [Project structure](#project-structure)
3. [Installation](#installation)

## Introduction

This project is a Fullstack application that showcases my abilities to develop full-fledged applications. It is a resume handling project that lets you add, edit, and remove experiences and skills within the UI, which will be persisted in a database.

## Project Structure

The project is structured as a monolith with different workspaces that are ready for extraction if needed. It separates the Backend and Frontend components to ensure modularity and maintainability.

Further information on the different workspace's structures can be found in the README files of the [backend](./packages/backend/README.md) and [frontend](./packages/frontend/README.md).

## Installation

To install the project, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies:**

```sh
npm install
```

3. **Set environment variables**

See the [backend](./packages/backend/README.md) and [frontend](./packages/frontend/README.md) documentations for how to set up environment variables for each workspace properly.

<!-- FIXME: implement Docker  -->

4. **Compose**

```sh
   docker compose up -d
```

You can also compose up each service separately by typing `backend`or `frontend`.
