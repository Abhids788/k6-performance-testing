# 🐊 K6 Performance Testing – Crocodile API

This repository contains performance test scripts built using **k6** to test the Crocodile demo API.  
It includes load tests for public and authenticated endpoints, token generation, and HTML reports — all using modular and scalable architecture.

---

## 🚀 Features

- 🔐 Registers a user and generates Auth token before running tests
- 🧪 Executes load testing on:
  - Public API → `/public/crocodiles`
  - Private API → `/my/crocodiles`
- 📊 Auto-generates HTML report with performance stats
- 🌍 Environment-based configuration (`dev`, `staging`)
- 🧱 Modular script architecture for multi-service support
- 📁 Supports separate test flows under different scenarios

---

## 📁 Project Structure

```text
k6-performance-testing
│
├── crocodile.js                    <-- Main entry script (executed via CLI)
│
├── Auth0Utility
│   └── auth0Utility.js             <-- Registers user / generates auth token
│
├── commonUtils
│   └── Utils.js                    <-- Shared validation and helper methods
│
├── configs
│   └── crocodiles_Config
│       ├── dev_env.json            <-- DEV configuration
│       └── staging_env.json        <-- STAGING configuration
│
├── Crocodile_Load_Scripts
│   └── scripts
│       ├── getAllCrocodile.js      <-- Public API load test script
│       └── getMyCrocodile.js       <-- Private API load test script
│
├── test_reports
│   └── crocodiles_report.html      <-- Auto-generated HTML performance report
│
└── README.md


flowchart TD
    A[crocodile.js] --> B[Load ENV config]
    A --> C[registerUser()]
    C --> D[auth0Utility.js]
    D --> E[(Token)]
    A --> F[getAllCrocodile.js]
    A --> G[getMyCrocodile.js]
    F --> H[Public API /public/crocodiles]
    G --> I[Private API /my/crocodiles]
    A --> J[Generate HTML Report]

## Run this command from project root:
k6 run -e ENV=dev -e DURATION=10 -e VUS=30 -e SERVICE=crocodiles .\crocodile.js

## Summary

This project provides a scalable, modular, and extensible performance testing framework for REST APIs using k6.
It can easily be extended for:

## Multi-service testing
Token-based authentication flows
CI/CD integration (GitHub Actions, Jenkins, GitLab CI)
Distributed load execution

## Author
Abhijit Das
📍 India
🚀 Passionate about Automation, Performance Testing, and Scaling Systems
