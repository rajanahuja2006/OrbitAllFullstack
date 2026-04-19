import dotenv from "dotenv";
import { exec } from "child_process";
dotenv.config();

const BACKEND_URL = "http://localhost:5001/api";

async function runPaymentTest() {
  console.log("\n===========================================");
  console.log("🛡️  ORBIT AI - PAYMENT GATEWAY TEST SUITE");
  console.log("===========================================\n");

  // --- Step 0: Pre-flight Configuration Check ---
  console.log("🔍 Checking Environment Configuration...");
  const checks = {
    "Backend URL": BACKEND_URL,
    "Stripe Key": process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ MISSING",
    "JWT Secret": process.env.JWT_SECRET ? "✅ Set" : "❌ MISSING",
    "Frontend URL": process.env.FRONTEND_URL ? `✅ ${process.env.FRONTEND_URL}` : "⚠️ Defaulting to localhost:5173"
  };
  console.table(checks);

  if (!process.env.STRIPE_SECRET_KEY || !process.env.JWT_SECRET) {
    console.error("\n🛑 CRITICAL ERROR: Environment variables are not set properly.");
    console.log("Please check your orbit-backend/.env file.");
    return;
  }

  const TEST_EMAIL = `viva_test_${Date.now()}@example.com`;
  const TEST_PASSWORD = "password123";

  try {
    // --- Step 1: Authentication Test ---
    console.log("\n🔐 TEST 1: User Authentication & JWT Generation");
    console.log(`📡 Creating Temp Account: ${TEST_EMAIL}`);
    
    const signupRes = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Viva Test User", email: TEST_EMAIL, password: TEST_PASSWORD }),
    });

    if (!signupRes.ok) throw new Error("Signup failed during testing.");

    const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    });

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("✔️  Successfully authenticated. JWT stored safely.");

    // --- Step 2: Stripe Handshake Test ---
    console.log("\n💳 TEST 2: Stripe API Handshake (Premium Plan)");
    console.log("📡 Requesting Checkout Session from Stripe...");

    const checkoutRes = await fetch(`${BACKEND_URL}/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ plan: "premium" }),
    });

    const checkoutData = await checkoutRes.json();
    
    if (checkoutRes.ok && checkoutData.sessionUrl) {
      console.log("✔️  Stripe Success! Valid Session URL received.");
      console.log("\n🔗 FULL Stripe Checkout URL:");
      console.log(checkoutData.sessionUrl);
      
      console.log("\n🌐 Opening Stripe Checkout in browser...");
      // Auto-open in browser on macOS
      exec(`open "${checkoutData.sessionUrl}"`, (err) => {
        if (err) {
          console.log("⚠️  Could not auto-open browser. Copy the URL above manually.");
        } else {
          console.log("✔️  Browser opened! Use Stripe test card: 4242 4242 4242 4242");
        }
      });

      console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY");
      console.log("-------------------------------------------");
      console.log("💳 TEST CARD DETAILS (No real money charged):");
      console.log("   Card Number : 4242 4242 4242 4242");
      console.log("   Expiry      : 12/29");
      console.log("   CVC         : 123");
      console.log("   Name        : Test User");

    } else {
      throw new Error(checkoutData.message || "Failed to create checkout session.");
    }

  } catch (error) {
    console.error(`\n❌ TEST FAILED: ${error.message}`);
  }
}

runPaymentTest();
