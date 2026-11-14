import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { categoryImages } from "../assets/images";
import { money } from "../utils/format";
import Icon from "../components/Icon";

const PAYMENTS = [
  { id: "cod", label: "Cash on delivery", hint: "Pay when your parts arrive" },
  { id: "bkash", label: "bKash / mobile wallet", hint: "We will send payment instructions" },
  { id: "card", label: "Credit / debit card", hint: "Demo only – no real payment is taken" },
];

function Field({ label, name, type = "text", required = true, defaultValue = "", ...rest }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="input"
        {...rest}
      />
    </div>
  );
}

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCartContext();
  const { createOrder } = useStore();
  const { user, isStaff } = useAuth();
  const [payment, setPayment] = useState("cod");
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const created = await createOrder({
        customer: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
          postcode: data.postcode || "",
          note: data.note || "",
        },
        items: items.map((i) => ({
          product: i._id || i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          category: i.category,
          brand: i.brand,
          spec: i.spec,
        })),
        payment,
        subtotal,
        shipping,
        total,
      });

      setOrder(created);
      clear();
    } catch (err) {
      alert("Order placement failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (order) {
    return (
      <div className="container-x py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-line bg-card p-8 text-center shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600 dark:border dark:border-green-800/40 dark:bg-green-950/60 dark:text-green-400">
            <Icon name="check" className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold">Thank you, {order.customer?.name || order.name}!</h1>
          <p className="mt-2 text-mute">
            Your order <b className="text-ink">{order.orderId || order.id}</b> has been placed and received in our system. Total: {money(order.total)} ({PAYMENTS.find((p) => p.id === order.payment)?.label || order.payment}).
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-tile px-3 py-1 text-xs font-medium text-mute">
              <Icon name="clock" className="h-3.5 w-3.5 text-amber-500" />
              <span>Status: <b className="text-amber-500">Pending</b></span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-brand">
              <Icon name="mail" className="h-3.5 w-3.5" />
              <span>Admin notified via Nodemailer</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/shop" className="btn-primary h-11 px-6">Continue shopping</Link>
            {isStaff && (
              <Link to="/admin/orders" className="btn-outline h-11 px-6">View in Admin Panel</Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-mute">Add some parts before checking out.</p>
        <Link to="/shop" className="btn-primary mt-6 h-11 px-6">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <form onSubmit={submit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-card p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold flex items-center justify-between">
              <span>Customer Contact</span>
              {user && (
                <span className="text-xs font-normal text-mute">
                  Logged in as <b className="text-brand">{user.name}</b>
                </span>
              )}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" defaultValue={user?.name || ""} autoComplete="name" />
              <Field label="Phone" name="phone" defaultValue={user?.phone || ""} type="tel" autoComplete="tel" />
              <div className="sm:col-span-2">
                <Field label="Email" name="email" defaultValue={user?.email || ""} type="email" autoComplete="email" />
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-line bg-card p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Street address" name="address" defaultValue={user?.address || ""} autoComplete="street-address" />
              </div>
              <Field label="City" name="city" defaultValue={user?.city || "Dhaka"} autoComplete="address-level2" />
              <Field label="Postcode" name="postcode" defaultValue={user?.postcode || ""} autoComplete="postal-code" />
              <div className="sm:col-span-2"><Field label="Order note (optional)" name="note" required={false} /></div>
            </div>
          </section>
          <section className="rounded-2xl border border-line bg-card p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Payment</h2>
            <div className="space-y-3">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${payment === p.id ? "border-brand bg-brand/5 dark:bg-brand/15" : "border-line"}`}>
                  <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} className="mt-1 h-4 w-4 accent-brand" />
                  <span><span className="block text-sm font-semibold">{p.label}</span><span className="text-sm text-mute">{p.hint}</span></span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-card p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-3">
                <img src={categoryImages[i.category]} alt="" className="h-14 w-14 rounded-lg bg-tile object-contain p-1" />
                <div className="min-w-0 flex-1 text-sm"><div className="font-medium leading-snug">{i.name}</div><div className="text-mute">Qty {i.qty}</div></div>
                <div className="text-sm font-semibold">{money(i.price * i.qty)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><span className="text-mute">Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-mute">Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
            <div className="flex justify-between pt-1 text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-5 h-12 w-full">
            {submitting ? "Placing Order..." : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
