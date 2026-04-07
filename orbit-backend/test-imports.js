import console from "console";
const imports = [
  "express",
  "cors",
  "dotenv",
  "./src/routes/resumeRoutes.js",
  "./src/routes/paymentRoutes.js",
  "./src/config/db.js",
  "./src/routes/authRoutes.js"
];

(async () => {
  for (const m of imports) {
    console.log("Loading", m);
    await import(m);
    console.log("Loaded", m);
  }
  console.log("All loaded successfully");
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
