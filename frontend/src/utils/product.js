export const features = (p) => p.spec.split(" · ");

export const describe = (p) =>
  `The ${p.name} from ${p.brand} is a reliable choice in our ${p.category.toLowerCase()} range. ` +
  `It offers ${features(p).join(", ").toLowerCase()}, backed by CSZ’s genuine-parts guarantee and 12 months of warranty.`;
