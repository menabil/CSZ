import { useState } from "react";
import Icon from "../components/Icon";
import { STORE } from "../data/config";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const info = [["mail", "Email", STORE.email], ["phone", "Phone", STORE.phone], ["pin", "Address", STORE.address]];

  return (
    <div className="container-x py-12">
      <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-1 text-mute">Questions about a part or an order? We are happy to help.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4 rounded-2xl border border-line bg-card p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="c-name">Name</label><input id="c-name" required className="input" /></div>
            <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" type="email" required className="input" /></div>
          </div>
          <div><label className="label" htmlFor="c-msg">Message</label><textarea id="c-msg" required rows="5" className="input h-auto py-3" /></div>
          <button className="btn-primary h-11 px-6">Send message</button>
          {sent && <p className="text-sm text-green-600" role="status">Thanks! Your message was sent (demo).</p>}
        </form>
        <div className="space-y-4">
          {info.map(([icon, label, value]) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-tile text-brand"><Icon name={icon} /></span>
              <div><div className="text-sm text-mute">{label}</div><div className="font-medium">{value}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
