# Instant Mechanic — Live Dashboard

A full-stack mechanic service management dashboard built with **Java Spring Boot, MySQL, HTML, CSS and JavaScript**.

The dashboard provides real-time visibility into bookings, customers, mechanics, services, booking status and revenue.

## Features

### Dashboard

* Total bookings
* Today's bookings
* Completed bookings
* Pending bookings
* Cancelled bookings
* Total revenue
* Active mechanics
* Total customers
* Booking status chart
* Revenue summary
* Recent bookings

### Bookings

* View all bookings
* Search bookings
* Filter bookings by status
* Update booking status
* Automatic dashboard refresh
* Booking data persisted in MySQL

### Customers

* View customers
* Search customers

### Mechanics

* View mechanics
* Search mechanics
* Filter mechanics by availability/status

### Services

* View available services
* Search services
* Filter services by category

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Chart.js

### Backend

* Java
* Spring Boot
* Spring Data JPA
* REST APIs
* Maven

### Database

* MySQL

## Project Structure

```text
Instant_mechanic/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

## API Endpoints

### Bookings

```text
GET    /api/bookings
GET    /api/bookings/{id}
POST   /api/bookings
PUT    /api/bookings/{id}
DELETE /api/bookings/{id}
PUT    /api/bookings/{id}/status
```

### Customers

```text
GET /api/customers
```

### Mechanics

```text
GET /api/mechanics
```

### Services

```text
GET /api/services
```

## Running the Backend

Open a terminal inside the backend folder.

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

## Running the Frontend

Open a terminal inside the frontend folder and run:

```powershell
npx serve .
```

The frontend can then be accessed through the local server URL shown in the terminal.

## Database

The application uses MySQL with Spring Data JPA.

Configure the database connection in:

```text
backend/src/main/resources/application.properties
```

Make sure MySQL is running before starting the backend.

## Live Dashboard

The dashboard automatically refreshes its data periodically so that updated booking information can appear without manually refreshing the browser.

## Status Flow

Bookings support the following statuses:

```text
PENDING
    ↓
ASSIGNED
    ↓
MECHANIC_ON_THE_WAY
    ↓
COMPLETED
```

A booking can also be:

```text
CANCELLED
```

## CORS

The backend allows requests from the frontend using Spring Boot CORS configuration.

## Author

Instant Mechanic — Full Stack Developer Intern Assessment Project
