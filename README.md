# IronFlow Software

Precision RFID asset management and real-time inventory telemetry pipelines engineered for demanding environments.

## Features

- **Real-Time Telemetry**: Real-time signal monitoring, antenna tuning, and precision tracking.
- **Developer First**: Clean JSON APIs, Modbus/OPC-UA mapping support, and interactive simulators.
- **Offshore Resiliency**: Low-bandwidth sync modes and military-grade hardware telemetry interfaces.
- **Enterprise Grade**: Responsive bright-mode web UI, secure deployment, and high-performance charts.

## Technology Stack

- **Framework**: React, Vite v8, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Hosting**: Firebase Hosting (Classic)

## Deployment & Custom Domain

- **Custom Domain**: [https://www.ironflowsoftware.com](https://www.ironflowsoftware.com)
- **GitHub Repository**: [Arivu-007/Ironflowsoftware](https://github.com/Arivu-007/Ironflowsoftware)
- **Hosting**: GitHub Pages (via `.github/workflows/deploy.yml`)

### Automatic Deployment
Every `git push origin main` automatically builds and deploys to GitHub Pages.

### Namecheap DNS Setup
In your Namecheap Dashboard (**Domain List** → **Manage** → **Advanced DNS**), ensure the following records are set:

| Type | Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME Record** | `www` | `Arivu-007.github.io.` | Automatic |
| **A Record** | `@` | `185.199.108.153` | Automatic |
| **A Record** | `@` | `185.199.109.153` | Automatic |
| **A Record** | `@` | `185.199.110.153` | Automatic |
| **A Record** | `@` | `185.199.111.153` | Automatic |

