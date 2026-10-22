// States and union territories a licence can be issued in.
// `code` is the RTO state code printed on the licence (e.g. DL, UK, MH).
// The saved / shown value is "Name (CODE)", e.g. "Delhi (DL)".
// TODO: load this list from your API if the backend owns it.

export type IndianState = {code: string; name: string};

export const INDIAN_STATES: IndianState[] = [
  {code: 'AN', name: 'Andaman and Nicobar Islands'},
  {code: 'AP', name: 'Andhra Pradesh'},
  {code: 'AR', name: 'Arunachal Pradesh'},
  {code: 'AS', name: 'Assam'},
  {code: 'BR', name: 'Bihar'},
  {code: 'CH', name: 'Chandigarh'},
  {code: 'CG', name: 'Chhattisgarh'},
  {code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu'},
  {code: 'DL', name: 'Delhi'},
  {code: 'GA', name: 'Goa'},
  {code: 'GJ', name: 'Gujarat'},
  {code: 'HR', name: 'Haryana'},
  {code: 'HP', name: 'Himachal Pradesh'},
  {code: 'JK', name: 'Jammu and Kashmir'},
  {code: 'JH', name: 'Jharkhand'},
  {code: 'KA', name: 'Karnataka'},
  {code: 'KL', name: 'Kerala'},
  {code: 'LA', name: 'Ladakh'},
  {code: 'LD', name: 'Lakshadweep'},
  {code: 'MP', name: 'Madhya Pradesh'},
  {code: 'MH', name: 'Maharashtra'},
  {code: 'MN', name: 'Manipur'},
  {code: 'ML', name: 'Meghalaya'},
  {code: 'MZ', name: 'Mizoram'},
  {code: 'NL', name: 'Nagaland'},
  {code: 'OD', name: 'Odisha'},
  {code: 'PY', name: 'Puducherry'},
  {code: 'PB', name: 'Punjab'},
  {code: 'RJ', name: 'Rajasthan'},
  {code: 'SK', name: 'Sikkim'},
  {code: 'TN', name: 'Tamil Nadu'},
  {code: 'TS', name: 'Telangana'},
  {code: 'TR', name: 'Tripura'},
  {code: 'UP', name: 'Uttar Pradesh'},
  {code: 'UK', name: 'Uttarakhand'},
  {code: 'WB', name: 'West Bengal'},
];

export function stateLabel(code: string) {
  const found = INDIAN_STATES.find(s => s.code === code);
  return found ? `${found.name} (${found.code})` : code;
}
