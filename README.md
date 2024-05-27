# ONTORPONTHIK

## Project - EcoSync 🌍

![Logo](https://i.ibb.co/Wksyt54/EcoSync.png)

## Team Members 👥

-   **Arfatul Islam Asif** [![Email](https://img.shields.io/badge/email-awakicde@gmail.com-blue)](mailto:awakicde@gmail.com)
-   **Unayes Ahmed Khan** [![Email](https://img.shields.io/badge/email-unayeskhan.0808@gmail.com-blue)](mailto:unayeskhan.0808@gmail.com)
-   **Mutaher Ahmed Shakil** [![Email](https://img.shields.io/badge/email-mutaher.shakil@gmail.com-blue)](mailto:mutaher.shakil@gmail.com)

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
