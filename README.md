# SwiftHire

SwiftHire is a blue-collar hiring platform built with Spring Boot and React.

## Run the backend

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
./mvnw spring-boot:run
```

## Run the frontend in development

```bash
cd frontend
npm install
npm run dev
```

## Build the frontend for Spring Boot

```bash
cd frontend
npm run build
```

The built React app is served by Spring Boot from `frontend/dist`.