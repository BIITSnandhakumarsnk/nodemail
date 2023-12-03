const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // or '*' to allow any origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Pass to next layer of middleware
  next();
});
// Endpoint to receive user details and send email
app.post("/sendEmail", (req, res) => {
  const { first_name, last_name, department, email, phone, message, time } =
    req.body;
  require("dotenv").config();
  const departmentString = department ? department.join(", ") : "";
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Your SMTP server host
    port: 587, // Your SMTP server port
    secure: false, // Set to true if your SMTP server requires a secure connection
    auth: {
      user: process.env.SMTP_USERNAME, //username
      pass: process.env.SMTP_PASSWORD, //password
    },
    authMethod: "PLAIN", // Specify the authentication method here
  });

  // Define the email options
  const mailOptions = {
    from: email, // Use the user's email as the sender address
    to: "info@creowiz.com", // Admin's email address
    subject: "New Student Request",
    text: `
      FirstName: ${first_name}
      LastName:${last_name}
      Department: ${departmentString}
      PreferredTime: ${time}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({ message: "Email sent successfully" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
