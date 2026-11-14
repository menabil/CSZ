const nodemailer = require("nodemailer");

// Create reusable transporter
const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    if (process.env.EMAIL_SERVICE) {
      return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Fallback for development/testing when SMTP credentials are not configured yet
  return null;
};

// Send Order Notification to Admin
const sendNewOrderNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@csz.com";
  const itemsListHtml = (order.items || [])
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${item.name}</td>
        <td style="padding: 10px 14px; color: #64748b;">${item.category || "-"}</td>
        <td style="padding: 10px 14px; text-align: center; color: #0f172a;">${item.qty}</td>
        <td style="padding: 10px 14px; text-align: right; font-weight: 600; color: #2563eb;">$${(
          item.price * item.qty
        ).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 28px; text-align: center; color: #ffffff;">
        <div style="display: inline-block; background: #2563eb; color: #ffffff; font-weight: 800; font-size: 14px; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;">CSZ Store Admin Alert</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Customer Order Placed!</h1>
        <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">Order ID: <b style="color: #ffffff;">${order.orderId}</b></p>
      </div>

      <div style="padding: 24px;">
        <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Customer & Delivery Details</h3>
        <table style="width: 100%; font-size: 14px; margin-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 35%;">Customer Name:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${order.customer?.name || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Phone:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${order.customer?.phone || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Email:</td>
            <td style="padding: 6px 0; color: #0f172a;">${order.customer?.email || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Delivery Address:</td>
            <td style="padding: 6px 0; color: #0f172a;">${order.customer?.address || "N/A"}, ${order.customer?.city || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Payment Method:</td>
            <td style="padding: 6px 0; font-weight: 600; text-transform: uppercase; color: #f97316;">${order.payment}</td>
          </tr>
          ${order.customer?.note ? `<tr><td style="padding: 6px 0; color: #64748b;">Note:</td><td style="padding: 6px 0; color: #64748b; font-style: italic;">${order.customer.note}</td></tr>` : ""}
        </table>

        <h3 style="color: #0f172a; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Ordered Computer Parts</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
              <th style="padding: 10px 14px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Product</th>
              <th style="padding: 10px 14px; text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase;">Category</th>
              <th style="padding: 10px 14px; text-align: center; color: #64748b; font-size: 12px; text-transform: uppercase;">Qty</th>
              <th style="padding: 10px 14px; text-align: right; color: #64748b; font-size: 12px; text-transform: uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>

        <div style="background: #f8fafc; padding: 16px; border-radius: 12px; text-align: right; font-size: 14px;">
          <div style="margin-bottom: 6px; color: #64748b;">Subtotal: <b style="color: #0f172a;">$${Number(order.subtotal || 0).toFixed(2)}</b></div>
          <div style="margin-bottom: 6px; color: #64748b;">Shipping: <b style="color: #0f172a;">${order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</b></div>
          <div style="font-size: 18px; font-weight: 700; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 8px;">Grand Total: <span style="color: #2563eb;">$${Number(order.total || 0).toFixed(2)}</span></div>
        </div>

        <div style="text-align: center; margin-top: 28px;">
          <a href="http://localhost:5173/admin/orders" style="display: inline-block; background: #2563eb; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px;">Open Order in Admin Panel</a>
        </div>
      </div>

      <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
        This is an automated notification from CSZ Store E-Commerce System.
      </div>
    </div>
  `;

  try {
    const transporter = createTransporter();

    if (transporter) {
      await transporter.sendMail({
        from: `"CSZ Store" <${process.env.EMAIL_USER || "no-reply@csz.com"}>`,
        to: adminEmail,
        subject: `🛒 New Customer Order Placed - ${order.orderId} ($${order.total})`,
        html: emailHtml,
      });
      console.log(`[Nodemailer] Email alert successfully sent to Admin (${adminEmail}) for order ${order.orderId}`);
    } else {
      console.log(`[Nodemailer Simulation] (Configure EMAIL_USER & EMAIL_PASS in .env for live SMTP delivery)`);
      console.log(`→ To Admin: ${adminEmail}`);
      console.log(`→ Subject: 🛒 New Customer Order Placed - ${order.orderId} ($${order.total})`);
      console.log(`→ Customer: ${order.customer?.name} (${order.customer?.phone}) | Total: $${order.total}`);
    }
  } catch (error) {
    console.error("[Nodemailer Error] Could not send email notification:", error.message);
  }
};

module.exports = {
  sendNewOrderNotification,
};
