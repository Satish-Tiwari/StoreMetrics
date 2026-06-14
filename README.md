# StoreMetrics

StoreMetrics is an all-in-one AI-powered analytics and data synchronization platform designed explicitly for WooCommerce. It provides real-time e-commerce metrics, retention cohort analysis, and an embedded Retrieval-Augmented Generation (RAG) AI assistant to seamlessly chat with your store's database.

## 🚀 Features

- **Store Management**: Configured for a single WooCommerce store via `application.yml` for simplified maintenance and performance.
- **Background Synchronization**: Headless data ingestion using Spring Boot Scheduling and Redis.
- **Analytics Dashboard**: Interactive charting (Recharts) covering gross revenue, order volume, and customer retention.
- **AI Chat Assistant**: Integrated conversational AI using pgvector to answer natural language questions about your store's data trends.
- **Dark Mode UI**: A fully responsive, modern design system built with Tailwind CSS.

## 🏗️ Architecture

The platform is designed as a highly scalable monolith, utilizing:

- **Frontend**: React 18, Vite, Tailwind CSS, TanStack Query, React Hook Form, Recharts.
- **Backend**: Java 17, Spring Boot, Spring MVC, Spring Data JPA, Spring Security.
- **Database**: PostgreSQL (with `pgvector` for semantic RAG) and Redis (for caching and job queues).

The Vite frontend is compiled directly into the Spring Boot `src/main/resources/static` directory, allowing both applications to be served securely on a single port (8080).

## 🛠️ Prerequisites

To run this project locally, you will need:
- Java 21+ and Maven (or Gradle)
- Node.js (v18+) for frontend compilation
- PostgreSQL (with `pgvector` extension installed)
- Redis Server

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/storemetrics.git
   cd storemetrics
   ```

2. **Environment Configuration**
   Copy the `src/main/resources/application.example.yml` file to `application.yml` (once generated) and fill in your database credentials.

3. **Start the Infrastructure**
   Start PostgreSQL and Redis via Docker:
   ```bash
   docker-compose up -d
   ```

4. **Build and Run the Application**
   Using Maven, you can compile the React frontend and run the Spring Boot backend simultaneously:
   ```bash
   npm run build:frontend
   mvn spring-boot:run
   ```

The application will be available at `http://localhost:8081`.
Acuator Metrics: `http://localhost:8081/actuator/metrics`

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
