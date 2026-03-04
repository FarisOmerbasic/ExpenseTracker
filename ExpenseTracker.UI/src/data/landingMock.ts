

export interface MockCategory {
  name: string;
  
  amount: number;
  
  color: string;
}

export interface MockMonth {
  label: string;
  amount: number;
}

export interface MockStats {
  totalSpent: number;
  thisMonth: number;
  
  monthChange: number;
  transactionsThisMonth: number;
  activeCategories: number;
}



export function categoryTotal(cats: MockCategory[]): number {
  return cats.reduce((s, c) => s + c.amount, 0);
}


export function donutSegments(cats: MockCategory[]) {
  const total = categoryTotal(cats);
  const circumference = 2 * Math.PI * 14; // ≈87.96
  let offset = 0;

  return cats.map((c) => {
    const pct = c.amount / total;
    const dash = pct * circumference;
    const seg = { color: c.color, dash, offset: -offset };
    offset += dash;
    return seg;
  });
}


export function barHeights(months: MockMonth[]) {
  const max = Math.max(...months.map((m) => m.amount));
  return months.map((m) => ({
    label: m.label,
    pct: max > 0 ? (m.amount / max) * 100 : 0,
  }));
}


export function fmtCurrency(n: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}
