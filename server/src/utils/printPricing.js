// This was made by some AI and copied over from a separate file, so it might be a bit rough around the edges. It provides a function to estimate 3D printing costs based on file size, material, quantity, and complexity. The pricing model is simple but takes into account various factors to give a reasonable estimate.

// Material cost per gram (USD)
const MATERIAL_COST_PER_GRAM = {
  PLA:   0.025,   // ~$25/kg spool
  PETG:  0.030,
  ABS:   0.028,
  TPU:   0.045,   // flexible filament, more expensive
  ASA:   0.035,
  NYLON: 0.060,   // specialty, expensive
  RESIN: 0.080,   // resin priced by ml, roughly equivalent
};

const COMPLEXITY = [
  { maxBytes: 500_000,         label: "Simple",   factor: 1.0, fee: 2.00  }, // <500KB
  { maxBytes: 2_000_000,       label: "Moderate", factor: 1.3, fee: 5.00  }, // 500KB–2MB
  { maxBytes: 10_000_000,      label: "Complex",  factor: 1.6, fee: 12.00 }, // 2MB–10MB
  { maxBytes: Infinity,        label: "Highly Complex", factor: 2.0, fee: 22.00 }, // >10MB
];

const BASE_LABOR = 4.00;        // per order
const PER_UNIT_LABOR = 1.50;    // per copy printed

const MINIMUM_PRICE = 8.00;

// Bulk discount thresholds
const bulkDiscount = (qty) => {
  if (qty >= 20) return 0.20;
  if (qty >= 10) return 0.12;
  if (qty >= 5)  return 0.06;
  return 0;
};

const estimateGrams = (fileSizeBytes, complexityFactor) => {
  const mb = fileSizeBytes / 1_000_000;
  const base = Math.max(mb * 25, 5); // minimum 5g for tiny files
  return base * complexityFactor;
};

/**
 * Main pricing function.
 *
 * @param {object} opts
 * @param {number} opts.fileSizeBytes   - Size of uploaded file in bytes
 * @param {string} opts.material        - e.g. "PLA", "PETG"
 * @param {number} opts.quantity        - Number of copies
 * @param {string} opts.fileType        - "stl", "obj", "3mf", etc.
 * @returns {object} estimatedCost
 */
function calculatePrintCost({ fileSizeBytes = 0, material = "PLA", quantity = 1, fileType = "stl" }) {
  const matCostPerG = MATERIAL_COST_PER_GRAM[material] ?? MATERIAL_COST_PER_GRAM.PLA;

  const tier = COMPLEXITY.find(t => fileSizeBytes <= t.maxBytes) || COMPLEXITY.at(-1);

  const estimatedGrams = estimateGrams(fileSizeBytes, tier.factor);

  const materialCostPerCopy = estimatedGrams * matCostPerG;
  const laborCostPerCopy    = PER_UNIT_LABOR;

  const complexityCost = tier.fee;
  const laborCostBase  = BASE_LABOR;

  // Subtotal for all copies before discount
  const subtotal = (materialCostPerCopy + laborCostPerCopy) * quantity
                 + complexityCost
                 + laborCostBase;

  // Bulk discount on variable portion only
  const discount     = bulkDiscount(quantity);
  const variablePart = (materialCostPerCopy + laborCostPerCopy) * quantity;
  const total        = variablePart * (1 - discount) + complexityCost + laborCostBase;

  // ±20% range for uncertainty (we can't see actual geometry)
  const low  = Math.max(total * 0.82, MINIMUM_PRICE);
  const high = total * 1.22;

  // Build breakdown (single-copy reference values for display)
  const breakdown = {
    materialCost:   parseFloat((materialCostPerCopy * quantity).toFixed(2)),
    laborCost:      parseFloat((laborCostBase + laborCostPerCopy * quantity).toFixed(2)),
    complexityCost: parseFloat(complexityCost.toFixed(2)),
    quantityTotal:  quantity,
    discountPct:    parseFloat((discount * 100).toFixed(0)),
    estimatedGrams: parseFloat(estimatedGrams.toFixed(1)),
    complexityTier: tier.label,
  };

  const disclaimer = [
    `Based on ~${estimatedGrams.toFixed(0)}g of ${material} filament per unit (${tier.label} geometry).`,
    discount > 0 ? `${(discount * 100).toFixed(0)}% bulk discount applied.` : null,
    "Final price confirmed by admin after file review.",
  ].filter(Boolean).join(" ");

  return {
    low:        parseFloat(low.toFixed(2)),
    high:       parseFloat(high.toFixed(2)),
    breakdown,
    currency:   "USD",
    disclaimer,
  };
}

module.exports = { calculatePrintCost };

//