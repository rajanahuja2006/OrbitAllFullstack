import dotenv from "dotenv";
dotenv.config();

const BACKEND_URL = "http://localhost:5001/api";

// ─── HELPER: Login and get JWT token ─────────────────────────────────────────
async function getToken() {
  const TEST_EMAIL = `sub_test_${Date.now()}@example.com`;
  const TEST_PASSWORD = "password123";

  // Create a fresh test user
  await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Subscription Test User", email: TEST_EMAIL, password: TEST_PASSWORD }),
  });

  const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });

  const loginData = await loginRes.json();
  return loginData.token;
}

// ─── MAIN TEST RUNNER ─────────────────────────────────────────────────────────
async function runSubscriptionTests() {
  console.log("\n==============================================");
  console.log("📋  ORBIT AI - MANAGE SUBSCRIPTION TEST SUITE");
  console.log("==============================================\n");

  let passed = 0;
  let failed = 0;

  try {
    const token = await getToken();
    if (!token) throw new Error("Authentication failed. Cannot run tests.");
    console.log("✔️  Auth Setup Complete. Starting Tests...\n");
    console.log("----------------------------------------------");

    // ─────────────────────────────────────────────
    // TEST 1: Get Subscription (Free/No Subscription)
    // ─────────────────────────────────────────────
    console.log("📌 TEST 1: Get Default Subscription Status (Free User)");
    const subRes = await fetch(`${BACKEND_URL}/payment/subscription`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const subData = await subRes.json();

    if (subRes.ok && subData.hasOwnProperty("isPremium")) {
      console.log(`   ✔️  PASS — Status: ${subRes.status}`);
      console.log(`   📄 isPremium        : ${subData.isPremium}`);
      console.log(`   📄 Uploads Remaining: ${subData.resumeUploadsRemaining}`);
      console.log(`   📄 Plan             : ${subData.subscription?.plan || "free"}`);
      passed++;
    } else {
      console.log(`   ❌ FAIL — ${subData.message}`);
      failed++;
    }

    console.log("\n----------------------------------------------");

    // ─────────────────────────────────────────────
    // TEST 2: Verify Available Plans are Returned
    // ─────────────────────────────────────────────
    console.log("📌 TEST 2: Verify All Subscription Plans are Available");

    if (subData.plans) {
      const planNames = Object.keys(subData.plans);
      console.log(`   ✔️  PASS — ${planNames.length} plans found`);
      planNames.forEach((name) => {
        const plan = subData.plans[name];
        console.log(`   💰 ${plan.name}: ${plan.displayPrice}/month | ${plan.resumeUploads === -1 ? "Unlimited" : plan.resumeUploads} uploads`);
      });
      passed++;
    } else {
      console.log("   ❌ FAIL — No plans returned from server.");
      failed++;
    }

    console.log("\n----------------------------------------------");

    // ─────────────────────────────────────────────
    // TEST 3: Access Subscription Without Token (Security Test)
    // ─────────────────────────────────────────────
    console.log("📌 TEST 3: Security — Access Without JWT Token");
    const noAuthRes = await fetch(`${BACKEND_URL}/payment/subscription`, {
      method: "GET",
      // NO Authorization header — simulating unauthorized access
    });

    if (noAuthRes.status === 401 || noAuthRes.status === 403) {
      console.log(`   ✔️  PASS — Unauthorized request correctly blocked (HTTP ${noAuthRes.status})`);
      console.log("   🔒 The authMiddleware (JWT guard) is working correctly.");
      passed++;
    } else {
      console.log(`   ❌ FAIL — Server should have rejected this. Got HTTP ${noAuthRes.status}`);
      failed++;
    }

    console.log("\n----------------------------------------------");

    // ─────────────────────────────────────────────
    // TEST 4: Access Subscription With Invalid Token (Security Test)
    // ─────────────────────────────────────────────
    console.log("📌 TEST 4: Security — Access With Fake/Invalid JWT Token");
    const fakeTokenRes = await fetch(`${BACKEND_URL}/payment/subscription`, {
      method: "GET",
      headers: { "Authorization": "Bearer this.is.a.fake.token" },
    });

    if (fakeTokenRes.status === 401 || fakeTokenRes.status === 403) {
      console.log(`   ✔️  PASS — Fake token correctly rejected (HTTP ${fakeTokenRes.status})`);
      console.log("   🔒 JWT signature validation is working correctly.");
      passed++;
    } else {
      console.log(`   ❌ FAIL — Server should have rejected fake token. Got HTTP ${fakeTokenRes.status}`);
      failed++;
    }

  } catch (error) {
    console.error(`\n🛑 Test suite crashed: ${error.message}`);
    failed++;
  }

  // ─── Final Report ─────────────────────────────
  console.log("\n==============================================");
  console.log(`\n🏁 TEST RESULTS: ${passed} Passed ✅  |  ${failed} Failed ❌`);
  console.log("==============================================\n");
}

runSubscriptionTests();
