const TAX_RATE = 0.1;

export function actualCost(p) {
  return p.items.reduce((s, x) => s + x.qty * x.unit, 0);
}

export function actualInclTotal(p) {
  return p.items.reduce((s, x) => s + x.qty * x.unit * (1 + TAX_RATE), 0);
}

export function costVariance(p) {
  return p.estCost - actualCost(p);
}

export function profit(p) {
  return p.deptSales - actualCost(p);
}

export function margin(p) {
  if (!p.deptSales) return 0;
  return profit(p) / p.deptSales;
}

export function estMargin(p) {
  if (!p.deptSales) return 0;
  return (p.deptSales - p.estCost) / p.deptSales;
}

const helpers = { actualCost, actualInclTotal, costVariance, profit, margin, estMargin };
export default helpers;
