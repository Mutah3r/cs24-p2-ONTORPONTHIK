Team Name: ONTORPONTHIK

Clone the repository and Run the command `docker-compose up --build`. It starts running frontend on port 5173 and backend server on port 8000.

If Docker isn't working, run the system as follows:
Backend: [cd samurai-backend] [npm install] [npm start]
Frontend: [cd samurai-frontend] [npm install] [npm run dev]

You can use our system by these credentials:
    System Admin:
        email: mutaher.shakil@gmail.com
        password: 1234

        email: unayeskhan.0808@gmail.com
        password: 1234

        email: awakicde@gmail.com
        password: 1234

    Landfill Manager:
        email:
        password:

    STS Manager:
        email:
        password:

*** For security purposes, controlled by JWT, a user is restricted to a single active session. 
    If login attempts are made from multiple devices using the same credentials, 
    the most recent login is prioritized, and other sessions are invalidated, 
    requiring those users to return to the login page.
*** When a user enrolls, an email containing their login credentials will be sent to the email address provided.
    So,please provide an valid email address.