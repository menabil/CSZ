import Icon from "./Icon";

const FEATURES = [
  { icon: "truck", title: "Fast delivery", text: "Orders ship within 24 hours." },
  { icon: "shield", title: "Warranty included", text: "Every part is covered." },
  { icon: "chip", title: "Genuine parts", text: "From authorized suppliers." },
  { icon: "headset", title: "Real support", text: "Help choosing compatible parts." },
];

export default function Features() {
  return (
    <section className="container-x grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((f) => (
        <div key={f.title} className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tile text-brand"><Icon name={f.icon} /></span>
          <div>
            <div className="text-sm font-semibold">{f.title}</div>
            <div className="text-sm text-mute">{f.text}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
