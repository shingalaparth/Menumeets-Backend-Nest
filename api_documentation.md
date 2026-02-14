# API Documentation Guide

## Overview
The MenuMeets Backend now features fully automated, interactive API documentation using **Swagger UI**.

## 🚀 How to Access

1.  **Start the Server**:
    ```bash
    npm run start:dev
    # OR
    npm start
    ```

2.  **Open in Browser**:
    Navigate to: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## ✨ Features
- **Full Coverage**: Every endpoint in the system is automatically scanned.
- **Detailed Schemas**: Request and Response bodies are fully documented thanks to the CLI Plugin.
- **Try It Out**: You can execute requests directly from the browser by clicking "Try it out".
- **Authentication**: Click the `Authorize` button and paste your JWT token to test protected routes.

## 🛠️ Configuration
- **File**: [src/main.ts](file:///e:/Business/New-MM/Menumeets-Backend-Nest/src/main.ts)
- **Plugin**: [nest-cli.json](file:///e:/Business/New-MM/Menumeets-Backend-Nest/nest-cli.json) (Enabled `@nestjs/swagger` plugin for auto-documentation).
