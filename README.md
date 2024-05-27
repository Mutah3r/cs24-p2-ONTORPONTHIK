# ONTORPONTHIK

## Project - EcoSync 🌍

![Logo](https://i.ibb.co/Wksyt54/EcoSync.png)

## Team Members 👥

-   **Arfatul Islam Asif** [![Email](https://img.shields.io/badge/email-awakicde@gmail.com-blue)](mailto:awakicde@gmail.com)
-   **Unayes Ahmed Khan** [![Email](https://img.shields.io/badge/email-unayeskhan.0808@gmail.com-blue)](mailto:unayeskhan.0808@gmail.com)
-   **Mutaher Ahmed Shakil** [![Email](https://img.shields.io/badge/email-mutaher.shakil@gmail.com-blue)](mailto:mutaher.shakil@gmail.com)

## Technologies Used 💻

### Frontend

-   ![HTML](https://img.icons8.com/color/48/000000/html-5.png) **HTML**
-   ![CSS](https://img.icons8.com/color/48/000000/css3.png) **CSS**
-   ![Tailwind](https://img.icons8.com/color/48/000000/tailwindcss.png) **Tailwind CSS**
-   ![JavaScript](https://img.icons8.com/color/48/000000/javascript.png) **JavaScript**
-   ![React](https://img.icons8.com/color/48/000000/react-native.png) **React**
-   ![React Router](https://i.ibb.co/19d5sDG/react-router-svg.png) **React Router**
-   ![React Spinners](https://i.ibb.co/zZjmmYQ/image.png) **React Spinners**
-   ![Recharts](https://i.ibb.co/KmJfYmC/image-2.png) **Recharts**
-   ![Animate.css](https://i.ibb.co/9pnq1vN/image-3.png) **Animate.css**
-   ![SweetAlert2](https://i.ibb.co/mbm8r3X/image-4.png) **SweetAlert2**

### Backend

-   ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png) **Node.js**
-   ![Express.js](https://cdn.icon-icons.com/icons2/2699/PNG/48/expressjs_logo_icon_169185.png) **Express.js**

### Database

-   ![MongoDB](https://img.icons8.com/color/48/000000/mongodb.png) **MongoDB**

### Authentication

-   ![JWT](https://img.icons8.com/?size=48&id=rHpveptSuwDz&format=png) **JSON Web Token (JWT)**

### Utilities

-   ![Axios](https://i.ibb.co/PwYcWwj/image-5.png) **Axios**

## Key Features ✨

1. **Secure Authentication** 🔒: EcoSync employs JSON Web Token (JWT) for secure authentication, ensuring that user data is protected and accessible only to authorized individuals.

2. **Registration of STS Manager** 🛠️: Administrators can create and manage user accounts for STS managers, enabling them to oversee STS operations and monitor waste collection activities.

3. **Registration of Landfill Manager** 🌍: Administrators can create and manage user accounts for landfill managers, allowing them to oversee landfill operations and ensure environmental compliance.

4. **Registration of 3rd Party Contractors** 🏗️: Administrators can register and manage third-party contractors, including essential information such as company details, contact information, workforce size, and contract duration.

5. **Creation of Contractor Manager User** 👤: Administrators can create user accounts for contractor managers, allowing them to manage workforce registration, collection plans, and monitor daily activities.

6. **Workforce Registration** 👷: Contractor managers can handle the registration of employees, including essential details such as employee ID, contact information, job title, and assigned collection route.

7. **Create a Collection Plan** 🗓️: Contractor managers can create schedules for domestic solid waste collection plans, including details such as area of collection, collection start time, duration, number of laborers, number of vans, and expected weight of daily solid waste.

8. **Real-time Data Visualization** 📊: EcoSync provides real-time data visualization through interactive charts and graphs, allowing users to easily analyze and understand environmental data.

9. **Monitoring Transported Waste by Contractors** 🚛: STS managers can track waste collection activities by third-party contractors, including details such as time/date of collection, amount of waste collected, type of waste, and designated STS for deposit.

10. **Monitoring Logged Working Hours** ⏰: Contractor managers can track the working hours of their teams, including daily log-in/out times, total hours worked, overtime hours, and absences/leaves.

11. **Bill Generation** 💵: STS managers can generate bills for third-party contractors based on the percentage of required waste collected and deposited to the STS, including calculations for basic pay, deficit, fine, and total bill.

12. **Fleet Optimization** 🚚: EcoSync optimizes the fleet of waste collection vehicles to ensure efficient routes and minimal fuel consumption, reducing operational costs and environmental impact.

13. **Optimal Routes for Waste Collection** 🗺️: Using Google Map, EcoSync calculates the most efficient routes for waste collection, ensuring timely and cost-effective waste management operations.

14. **User-friendly Interface** 💻: With a clean and intuitive user interface, EcoSync ensures a smooth user experience, making it easy for users to navigate and access information.

15. **Responsive Design** 📱: Built with responsive design principles, EcoSync is accessible across devices of all sizes, providing a seamless experience on desktops, tablets, and mobile phones.

## Role-based Access Control 🚪

EcoSync implements role-based access control (RBAC) to manage user permissions effectively:

-   **Administrator**: Has full access to all features and functionalities of the system, including user management, contractor registration, and billing.
-   **STS Manager**: Can track waste collection activities, generate bills, and manage STS operations, with restricted access to administrative functions.
-   **Landfill Manager**: Responsible for overseeing landfill operations, including waste disposal, environmental compliance, and safety protocols.
-   **Contractor Manager**: Can manage workforce registration, collection plans, and monitor daily activities, but does not have access to administrative features.
-   **Regular User**: Limited access to view data and reports, without permission to perform any administrative or managerial tasks.

## Getting Started 🚀

### Using Docker 🐳

Clone the repository and run the following command:

```sh
docker-compose up --build
```

-   Frontend: Runs on port `5173`
-   Backend: Runs on port `8000`

### Manual Setup 🧑‍💻

If Docker isn't working, run the system manually:

Backend:

```sh
cd samurai-backend
npm install
npm start
```

Frontend:

```sh
cd samurai-frontend
npm install
npm run dev
```

## Credentials 🔑

You can use our system with the following credentials:

### System Admin:

1.  email: mutaher.shakil@gmail.com

    -   password: `1234`

2.  email: unayeskhan.0808@gmail.com

    -   password: `1234`

3.  email: awakicde@gmail.com

    -   password: `1234`

### STS Manager:

1.  email: stsmanager1@gmail.com

    -   password: `1234`

2.  email: stsmanager2@gmail.com

    -   password: `1234`

3.  email: stsmanager3@gmail.com

    -   password: `1234`

### Landfill Manager:

1.  email: landmanager1@gmail.com

    -   password: `1234`

2.  email: landmanager2@gmail.com

    -   password: `1234`

3.  email: landmanager3@gmail.com
    -   password: `1234`

## Vehicle Information 🚛

Here are some vehicle's information you can use:

-   [TEST - 101] [Dump Truck]
-   [TEST - 102] [Compactor]
-   [TEST - 103] [Open Truck]
-   [TEST - 104] [Container Carrier]

## Security Notice 🔒

-   **Single Active Session:** For security purposes, controlled by JWT, a user is restricted to a single active session. If login attempts are made from multiple devices using the same credentials, the most recent login is prioritized, and other sessions are invalidated, requiring those users to return to the login page.

-   **Enrollment:** When a user enrolls, an email containing their login credentials will be sent to the provided email address. So, please provide a valid email address.

## Preferred Browser: 🌐

-   Chrome

## Diagrams and Workflows 📊

### Entity Relationship Diagram

[![Entity Relationship Diagram](https://i.ibb.co/Bj44W8c/ecosync-erd.png)](https://ibb.co/4MssvBK)

### Backend Workflow

[![Backend Workflow](https://i.ibb.co/jwMYY87/Bankend-workflow-diagram-1.png)](https://ibb.co/vdPWWc2)
