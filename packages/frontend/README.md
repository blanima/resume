# Resume - Frontend

## Table of Contents

1. [Introduction](#introduction)
2. [Specifications](#specifications)
3. [Project Structure](#project-structure)
4. [UI Components](#ui-components)
5. [Installation](#installation)

## Introduction

This project is the frontend part of the resume application. It provides a user-friendly interface for showcasing the resume data. The application is built with modern web technologies to ensure a responsive and interactive user experience.

## Specifications

The frontend project is built with a component-based architecture, using Next.js App Router and Tailwind CSS for styling. It emphasizes clean UI design, responsiveness, and accessibility.

## Project Structure

The frontend project is organized into key folders:

- src
  - components    // Reusable UI components
  - app           // Application pages and routing
  - experiences   // components that belong to the experience domain
  - skills        // components that belong to the skills domain
  - lib           // Utility functions and API integrations
- public          // Static assets
- package.json    // Project configuration and dependency management

## UI Components

This project uses [shadcn/ui](https://ui.shadcn.com) for building UI components. The configuration for shadcn/ui can be found in the `components.json` file.

### Configuration

The `components.json` file includes settings for style, Tailwind CSS, and aliases:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "stone",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs) for more details on how to use and customize the components.

## Installation

To install and run the frontend project, follow these steps:

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Run the project:**

   ```sh
   npm start
   ```

3. **Build for production:**

   ```sh
   npm run build
   ```
