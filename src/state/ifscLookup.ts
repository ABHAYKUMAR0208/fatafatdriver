export type BankBranch = {bank: string; branch: string};

// 4 letters + "0" + 6 letters/digits, e.g. HDFC0001234
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// TODO: call your backend (or a public IFSC lookup API) here and return the bank
// and branch for this IFSC code. Throw an error when the code does not exist.
// Right now it returns the sample bank from the design for any valid-looking code.
export async function lookupIfsc(ifsc: string): Promise<BankBranch> {
  await new Promise<void>(resolve => setTimeout(resolve, 600));
  if (!IFSC_REGEX.test(ifsc)) {
    throw new Error('invalid');
  }
  return {bank: 'State Bank of India', branch: 'Connaught Place Branch, New Delhi'};
}

// TODO: send the full bank details to your backend.
// Only the last 4 digits are kept on the phone (the Review screen shows "Ending in").
export async function saveBankDetails(_details: {
  holder: string;
  accountNumber: string;
  ifsc: string;
}): Promise<void> {
  await new Promise<void>(resolve => setTimeout(resolve, 500));
}