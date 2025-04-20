const routes = {
  "/": "<h1>Welcome to HR App</h1>",
  "/login": `<h1>LOGIN</h1>
        <form id="loginForm">
            <input type="email" id="email" placeholder="Email" required />
            <input type="password" id="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
        <p id="loginMessage"></p>`,

  "/register": `<h1>REGISTER</h1>
        <form id="registerForm">
            <input type="email" id="regEmail" placeholder="Email" required />
            <input type="password" id="regPassword" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
        <p id="registerMessage"></p>`,

  "/dashboard": `<h1>DASHBOARD</h1>
        <form id="dashboardForm">
        <nav>
            <ul>
                <li><a href="/">Employee</a></li>
                <li><a href="/">Attendance</a></li>
                <li><a href="/">Leave</a></li>
                <li><a href="/">Salary</a></li>
                <li><a href="/">Reports</a></li>
            </ul>
        </nav>
        </form>
        <button id="logout">Logout</button>'`,

  "/employee": `<h1>Employee</h1>
        <form id="EmployeeForm">
            <input type="name" id="regName" placeholder="Name" required />
            <input type="position" id="regPosition" placeholder="Position" required />
            <button type="submit">Add</button>
        </form>
        <p id="employeeMessage"></p>`,

  "/attendance": "<h1>Attendance</h1>",

  "/leave": "<h1>Leave</h1>",

  "/salary": "<h1>Salary</h1>",

  "/reports": "<h1>Reports</h1>",
};

const loadContent = (route) => {
  const content = document.getElementById("content");
  content.innerHTML =
    routes[route] || "<h1>404 Not Found</h1><p>Page does not exist.</p>";

  if (route === "/login") setupLogin();
  if (route === "/register") setupRegister();
  if (route === "/dashboard") setupDashboard();
  if (route === "/employee") setupEmployee();
  if (route === "/attendance") setupAttendance();
  if (route === "/leave") setupLeave();
  if (route === "/salary") setupSalary();
  if (route === "/reports") setupReports();
};

const setupLogin = () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const user = await getUser(email);
      if (user && user.password === password) {
        sessionStorage.setItem("loggedInUser", email);
        document.getElementById("dashboardLink").style.display = "inline";
        loadContent("/dashboard");
      } else {
        document.getElementById("loginMessage").textContent =
          "Invalid email or password!";
      }
    });
};

const setupRegister = () => {
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;

      if (await getUser(email)) {
        document.getElementById("registerMessage").textContent =
          "Email already registered!";
      } else {
        await addUser({ email, password });
        document.getElementById("registerMessage").textContent =
          "Registration successful! Please login.";
      }
    });
};

const setupDashboard = () => {
  document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    document.getElementById("dashboardLink").style.display = "none";
    loadContent("/");
  });
};

const setupEmployee = () => {
  document
    .getElementById("EmployeeForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("regName").value;
      const position = document.getElementById("regPosition").value;

      if (await getUser(name)) {
        document.getElementById("registerMessage").textContent =
          "Name already registered!";
      } else {
        await addUser({ name, position });
        document.getElementById("registerMessage").textContent =
          "Your Data has been submitted!";
      }
    });
};

// Navigation event listener
document.addEventListener("click", (event) => {
  if (event.target.matches("[data-route]")) {
    event.preventDefault();
    const route = event.target.getAttribute("data-route");
    history.pushState({}, "", route);
    loadContent(route);
  }
});

// Handle browser navigation
window.addEventListener("popstate", () => {
  loadContent(location.pathname);
});

// Display correct links based on login state
if (sessionStorage.getItem("loggedInUser")) {
  document.getElementById("dashboardLink").style.display = "inline";
}

// Load default route
loadContent("/");
