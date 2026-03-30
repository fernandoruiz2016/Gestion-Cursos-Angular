const http = require("http");

async function testRegister() {
  const data = JSON.stringify({
    nombre: "Test",
    apellido: "User",
    email: "test@idat.edu.pe",
    clave: "password123",
    rol: "ESTUDIANTE"
  });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/auth/register",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Registration failed with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on("error", (error) => reject(error));
    req.write(data);
    req.end();
  });
}

async function testLogin() {
  const data = JSON.stringify({
    email: "test@idat.edu.pe",
    clave: "password123"
  });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Login failed with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on("error", (error) => reject(error));
    req.write(data);
    req.end();
  });
}

async function runTests() {
  try {
    console.log("Testing Registration...");
    const regResult = await testRegister().catch(err => {
        if (err.message.includes("400")) return { message: "User already exists" };
        throw err;
    });
    console.log("Registration Result:", JSON.stringify(regResult));

    console.log("\nTesting Login...");
    const loginResult = await testLogin();
    console.log("Login Successful! Received Token:", loginResult.token.substring(0, 20) + "...");
    console.log("User Info:", JSON.stringify(loginResult.user));
    
    console.log("\nAll verification tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error.message);
    process.exit(1);
  }
}

runTests();
