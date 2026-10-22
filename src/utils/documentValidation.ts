// Checks for the document number and expiry date typed on the upload screens.
// Dates are kept as "mmddyyyy" digits, the same format DateField uses.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ---- document number -------------------------------------------------------

// Cleans what the rider types, so wrong characters never get into the field.
export function sanitizeDocNumber(docId: string, input: string) {
  if (docId === 'aadhar') {
    return input.replace(/[^0-9 ]/g, '').slice(0, 14); // 12 digits + 2 spaces
  }
  return input.toUpperCase().replace(/[^A-Z0-9 \-/]/g, '').slice(0, 25);
}

export function validateDocNumber(docId: string, input: string) {
  const compact = input.replace(/[\s\-/]/g, '');
  if (docId === 'aadhar') {
    return /^\d{12}$/.test(compact);
  }
  // Licence, address proof, police certificate: letters + digits, 6-20 characters,
  // and at least one digit (a name or a word alone is not a document number)
  return /^[A-Z0-9]{6,20}$/.test(compact) && /\d/.test(compact);
}

// ---- dates -------------------------------------------------------------------

// Today at 00:00, so "today" itself is still allowed as an expiry date.
export function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// "mmddyyyy" -> a real Date, or undefined when it is not a real calendar date
// (month 36, day 49, 31 Feb ...).
export function parseDigits(digits: string) {
  if (!/^\d{8}$/.test(digits)) {
    return undefined;
  }
  const month = Number(digits.slice(0, 2));
  const day = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);
  const real =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return real ? date : undefined;
}

// An expiry date must be a real date, today or later, and not absurdly far away.
export function isValidExpiry(digits: string, maxYearsAhead = 50) {
  const date = parseDigits(digits);
  if (!date) {
    return false;
  }
  const today = startOfToday();
  const limit = new Date(today.getFullYear() + maxYearsAhead, today.getMonth(), today.getDate());
  return date >= today && date <= limit;
}

// "10142026" -> "Oct 14, 2026" (the format the document detail screen shows)
export function formatExpiry(digits: string) {
  const date = parseDigits(digits);
  if (!date) {
    return '';
  }
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
