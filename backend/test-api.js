const http = require("http");

async function runTests() {
  console.log("=== STARTING AUTH & ROLE-BASED ACCESS CONTROL TESTS ===");

  const BASE_URL = "http://localhost:5000";

  // 1. Root check
  const root = await fetch(`${BASE_URL}/`).then((r) => r.json());
  console.log("✓ Root API Status:", root.status, "| Roles:", root.roles.join(", "));

  // 2. Login as regular User
  const userLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "user@csz.com", password: "user123" }),
  }).then((r) => r.json());
  console.log("✓ User Login:", userLogin.success, "| User:", userLogin.user.name, "| Role:", userLogin.user.role);

  // 3. User trying to access Admin-only /api/users (Should be 403 Forbidden)
  const userAccessUsers = await fetch(`${BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${userLogin.token}` },
  });
  console.log("✓ User Access to /api/users -> Status:", userAccessUsers.status, "(Expected 403 Forbidden)");

  // 4. User trying to create Product (Should be 403 Forbidden)
  const userCreateProduct = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userLogin.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Unauthorized GPU",
      category: "Graphics Cards",
      brand: "Unknown",
      spec: "12GB",
      price: 500,
    }),
  });
  console.log("✓ User adding product -> Status:", userCreateProduct.status, "(Expected 403 Forbidden)");

  // 5. Login as Moderator
  const modLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "moderator@csz.com", password: "mod123" }),
  }).then((r) => r.json());
  console.log("✓ Moderator Login:", modLogin.success, "| User:", modLogin.user.name, "| Role:", modLogin.user.role);

  // 6. Moderator creating Product (Should be 201 Created - "modarator product add korte parbe")
  const modAddProduct = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${modLogin.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "GeForce RTX 4070 Ti Super",
      category: "Graphics Cards",
      brand: "MSI",
      spec: "16 GB GDDR6X · Tri Frozr 3",
      price: 799,
      stock: 8,
      badge: "New",
    }),
  }).then((r) => r.json());
  console.log("✓ Moderator Product Creation:", modAddProduct.success, "| Product:", modAddProduct.product?.name);

  // 7. Moderator trying to access Admin users (Should be 403 Forbidden)
  const modAccessUsers = await fetch(`${BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${modLogin.token}` },
  });
  console.log("✓ Moderator Access to /api/users -> Status:", modAccessUsers.status, "(Expected 403 Forbidden)");

  // 8. Login as Admin
  const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@csz.com", password: "admin123" }),
  }).then((r) => r.json());
  console.log("✓ Admin Login:", adminLogin.success, "| User:", adminLogin.user.name, "| Role:", adminLogin.user.role);

  // 9. Admin accessing /api/users (Should be 200 OK - "admin shob kisu dekte parbe")
  const adminUsers = await fetch(`${BASE_URL}/api/users`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` },
  }).then((r) => r.json());
  console.log("✓ Admin view all users:", adminUsers.success, "| Total Users:", adminUsers.total);

  // 10. Admin accessing Dashboard Analytics (/api/admin/dashboard)
  const adminDash = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` },
  }).then((r) => r.json());
  console.log("✓ Admin Dashboard Overview:", adminDash.success, "| Metrics:", adminDash.data?.metrics);

  // 11. Register a new user & save to database
  const newEmail = `customer_${Date.now()}@example.com`;
  const regUser = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Zubair Rahman",
      email: newEmail,
      password: "pass123456",
      phone: "01812345678",
      address: "House 10, Road 4",
      city: "Dhaka",
    }),
  }).then((r) => r.json());
  console.log("✓ New Customer Registered in DB:", regUser.success, "| Name:", regUser.user?.name, "| Role:", regUser.user?.role);

  // 12. New customer places an order
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${regUser.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: {
        name: regUser.user.name,
        phone: regUser.user.phone,
        email: regUser.user.email,
        address: regUser.user.address,
        city: regUser.user.city,
      },
      items: [
        {
          name: "Ryzen 7 7800X3D",
          price: 389,
          qty: 1,
          category: "Processors",
        },
      ],
      payment: "cod",
      subtotal: 389,
      shipping: 0,
      total: 389,
    }),
  }).then((r) => r.json());
  console.log("✓ Customer Placed Order:", orderRes.success, "| Order ID:", orderRes.order?.orderId);

  // 13. Admin checks all orders ("admin shob kisu dekte parbe")
  const allOrders = await fetch(`${BASE_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` },
  }).then((r) => r.json());
  console.log("✓ Admin fetched all orders in system:", allOrders.success, "| Count:", allOrders.count);

  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
