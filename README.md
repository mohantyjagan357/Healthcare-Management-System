
# 🏥 Healthcare Management System (HMS)

A full-stack **Healthcare Management System** built with **Java Spring Boot**, **MySQL**, and **RESTful APIs** to streamline hospital operations — including patient management, appointment scheduling, billing, and staff management.

---

## 🚀 Features

### 🧑‍⚕️ Patient Management
- Register new patients with personal and medical details  
- Maintain medical history and treatment records  
- Manage appointments and notifications  

### 👨‍💼 Staff Management
- Register and manage doctors, nurses, and administrative staff  
- Manage work schedules, attendance, and roles  

### 💊 Inventory Management
- Track medicines, equipment, and supply usage  
- Generate stock reports and low-inventory alerts  

### 💰 Billing & Accounting
- Generate bills for consultations, treatments, and pharmacy  
- Manage insurance claims and payment records  

### 📅 Appointment Management
- Book, reschedule, or cancel appointments  
- Send reminders via SMS/email  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend** | Spring Boot (3.x), Java 17 |
| **Database** | MySQL |
| **ORM / JPA** | Hibernate / Spring Data JPA |
| **Validation** | Jakarta Validation (`spring-boot-starter-validation`) |
| **Tools** | IntelliJ IDEA, Postman |
| **Build Tool** | Maven |

---

## ⚙️ Project Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/hospital-management-system.git
cd hospital-management-system
````

### 2. Configure the Database

Create a MySQL database:

CREATE DATABASE hms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hms_user'@'localhost' IDENTIFIED BY 'hms_pass';
GRANT ALL PRIVILEGES ON hms_db.* TO 'hms_user'@'localhost';
FLUSH PRIVILEGES;


### 3. Update `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hms_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=hms_user
spring.datasource.password=hms_pass
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

### 4. Run the Application

In IntelliJ IDEA:

* Open the project
* Run `HealthManagementSystemApplication.java`

Or using Maven:

```bash
mvn spring-boot:run
```

The app will start on **[http://localhost:8080](http://localhost:8080)**

---

## 🧪 API Testing (Sample)

### ➕ Create a Patient

```bash
POST /api/patients
Content-Type: application/json
{
  "name": "John Doe",
  "address": "123 Main St",
  "contact": "+91-9876543210",
  "dob": "1990-01-01"
}
```

### 📅 Create an Appointment

```bash
POST /api/appointments
Content-Type: application/json
{
  "patient": {"id": 1},
  "provider": "Dr. Sharma",
  "startTime": "2025-10-20T11:00:00",
  "endTime": "2025-10-20T11:30:00"
}
```

---

## 🛠️ Project Structure

```
src/
 └── main/
     ├── java/com/example/hms/
     │   ├── controller/   # REST Controllers
     │   ├── service/      # Business Logic
     │   ├── model/        # Entities
     │   └── repository/   # JPA Repositories
     └── resources/
         ├── application.properties
         └── db/migration/
```

---

## 🔒 Security (Next Phase)

* Role-Based Access (Admin, Doctor, Nurse, Patient)
* JWT Authentication or OAuth2
* HTTPS Configuration
* Data encryption (at rest and in transit)

---

## 📈 Future Enhancements

* Add Patient Portal with React.js frontend
* Email/SMS notification microservice
* Analytics & reporting dashboard
* Docker + Kubernetes deployment
* Integration with external lab systems (LIS/RIS)

---

## 👨‍💻 Developer Setup Notes

* Java 17 or above required
* Use IntelliJ IDEA for better auto-configuration
* Run MySQL before launching the app
* Recommended: Postman for API testing

---

## 🧾 License

This project is open-source under the **MIT License**.

---

## 👨‍💻 Author

<div align="center">

**Soumya Mohanty**

[![GitHub](https://img.shields.io/badge/GitHub-mohantyjagan357-1fffa0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mohantyjagan357)

*DevOps Engineer · Java Developer · Cloud Native*

</div>

```
