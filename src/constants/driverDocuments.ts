export type DriverDocId = 'licence' | 'aadhar' | 'profile' | 'address' | 'police';

export type DriverDocConfig = {
  id: DriverDocId;
  title: string; // name on the checklist
  uploadTitle: string; // header of the upload screen
  sides: string[]; // one entry per photo (1 or 2)
  numberLabel?: string;
  hasExpiry: boolean;
  optional: boolean;
};

// Order = order on the checklist screen
export const DRIVER_DOCS: DriverDocConfig[] = [
  {
    id: 'licence',
    title: 'Driving Licence',
    uploadTitle: 'Upload Driving Licence',
    sides: ['Scan Front of Licence', 'Upload Back of Licence'],
    numberLabel: 'Document Number',
    hasExpiry: true,
    optional: false,
  },
  {
    id: 'aadhar',
    title: 'Aadhar Card / ID Proof',
    uploadTitle: 'Upload Aadhar Card',
    sides: ['Scan Front of Aadhar Card', 'Upload Back of Aadhar Card'],
    numberLabel: 'Aadhar Number',
    hasExpiry: false,
    optional: false,
  },
  {
    id: 'profile',
    title: 'Profile Photo',
    uploadTitle: 'Upload Profile Photo',
    sides: ['Take or Upload Your Photo'],
    hasExpiry: false,
    optional: false,
  },
  {
    id: 'address',
    title: 'Address Proof',
    uploadTitle: 'Upload Address Proof',
    sides: ['Upload Address Proof'],
    numberLabel: 'Document Number',
    hasExpiry: false,
    optional: false,
  },
  {
    id: 'police',
    title: 'Police Verification Certificate',
    uploadTitle: 'Upload Police Certificate',
    sides: ['Upload Police Certificate'],
    numberLabel: 'Certificate Number',
    hasExpiry: true,
    optional: true,
  },
];

export function getDriverDoc(id: DriverDocId) {
  return DRIVER_DOCS.find(d => d.id === id) ?? DRIVER_DOCS[0];
}