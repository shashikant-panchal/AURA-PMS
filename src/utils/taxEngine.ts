/**
 * Indian GST calculation engine for Luxury Hospitality
 * Under Indian GST regulations:
 * - Room tariff < ₹7,500 per night: 12% GST (6% CGST + 6% SGST)
 * - Room tariff >= ₹7,500 per night: 18% GST (9% CGST + 9% SGST)
 * - Fine Dining, Spa, Experiences: 18% GST (9% CGST + 9% SGST)
 */

export interface TaxCalculation {
  preTaxAmount: number;
  gstRate: number; // e.g. 0.12 or 0.18
  cgstRate: number; // half of gstRate
  sgstRate: number; // half of gstRate
  cgstAmount: number;
  sgstAmount: number;
  totalTax: number;
  grandTotal: number;
}

export function getRoomGstRate(effectiveNightlyRate: number): number {
  if (effectiveNightlyRate < 7500) {
    return 0.12;
  }
  return 0.18;
}

export function calculateItemGst(amount: number, gstRate: number): TaxCalculation {
  const roundedAmount = Math.round(amount * 100) / 100;
  const halfRate = gstRate / 2;
  const cgstAmount = Math.round(roundedAmount * halfRate * 100) / 100;
  const sgstAmount = Math.round(roundedAmount * halfRate * 100) / 100;
  const totalTax = cgstAmount + sgstAmount;
  const grandTotal = Math.round((roundedAmount + totalTax) * 100) / 100;

  return {
    preTaxAmount: roundedAmount,
    gstRate,
    cgstRate: halfRate,
    sgstRate: halfRate,
    cgstAmount,
    sgstAmount,
    totalTax,
    grandTotal,
  };
}

export function calculateReservationTotals(
  nightlyRate: number,
  nights: number,
  discountAmount: number = 0,
  extraCharges: { amount: number; gstRate: number }[] = []
) {
  const rawRoomSubtotal = nightlyRate * nights;
  const roomSubtotalAfterDiscount = Math.max(0, rawRoomSubtotal - discountAmount);
  const effectivePerNight = nights > 0 ? roomSubtotalAfterDiscount / nights : nightlyRate;
  const roomGstRate = getRoomGstRate(effectivePerNight);

  const roomTaxCalc = calculateItemGst(roomSubtotalAfterDiscount, roomGstRate);

  let extrasSubtotal = 0;
  let extrasCgst = 0;
  let extrasSgst = 0;

  for (const item of extraCharges) {
    extrasSubtotal += item.amount;
    const calc = calculateItemGst(item.amount, item.gstRate);
    extrasCgst += calc.cgstAmount;
    extrasSgst += calc.sgstAmount;
  }

  const totalPreTax = roomSubtotalAfterDiscount + extrasSubtotal;
  const totalCgst = roomTaxCalc.cgstAmount + extrasCgst;
  const totalSgst = roomTaxCalc.sgstAmount + extrasSgst;
  const totalTax = totalCgst + totalSgst;
  const grandTotal = totalPreTax + totalTax;

  return {
    rawRoomSubtotal,
    discountAmount,
    roomSubtotalAfterDiscount,
    roomGstRate,
    roomCgst: roomTaxCalc.cgstAmount,
    roomSgst: roomTaxCalc.sgstAmount,
    extrasSubtotal,
    extrasCgst,
    extrasSgst,
    totalPreTax,
    totalCgst,
    totalSgst,
    totalTax,
    grandTotal,
  };
}

