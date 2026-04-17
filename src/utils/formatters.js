export function formatMillionsCLP(value) {
  const millions = Number(value) / 1000;

  if (!Number.isFinite(millions)) {
    return '$0 millones CLP';
  }

  return `$${millions.toLocaleString('es-CL', {
    minimumFractionDigits: millions % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  })} millones CLP`;
}
