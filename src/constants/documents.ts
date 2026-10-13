import {MDI} from '@/constants/iconPaths';
import {MDI_DOCS} from '@/constants/iconPathsDocs';

export type DocId =
  | 'licence'
  | 'rc'
  | 'insurance'
  | 'profile'
  | 'vehiclePhoto'
  | 'police';

export type DocumentConfig = {
  id: DocId;
  title: string;
  subtitle?: string;
  iconPath: string;
  // One entry per photo the rider must add (1 or 2)
  sides: string[];
  numberLabel?: string;
  hasExpiry: boolean;
};

// Order = order on the checklist screen
export const DOCUMENTS: DocumentConfig[] = [
  {
    id: 'licence',
    title: 'Driving Licence',
    iconPath: MDI_DOCS.cardAccountDetails,
    sides: ['Scan Front of Licence', 'Upload Back of Licence'],
    numberLabel: 'Document Number',
    hasExpiry: true,
  },
  {
    id: 'rc',
    title: 'Registration (RC)',
    iconPath: MDI_DOCS.fileDocument,
    sides: ['Scan Front of RC', 'Upload Back of RC'],
    numberLabel: 'Document Number',
    hasExpiry: true,
  },
  {
    id: 'insurance',
    title: 'Vehicle Insurance',
    iconPath: MDI_DOCS.shieldPlus,
    sides: ['Upload Insurance Paper'],
    numberLabel: 'Policy Number',
    hasExpiry: true,
  },
  {
    id: 'profile',
    title: 'Profile Photo',
    iconPath: MDI_DOCS.accountCircle,
    sides: ['Upload Profile Photo'],
    hasExpiry: false,
  },
  {
    id: 'vehiclePhoto',
    title: 'Vehicle Photo',
    subtitle: 'Front & Back clearly visible',
    iconPath: MDI.car,
    sides: ['Upload Front of Vehicle', 'Upload Back of Vehicle'],
    hasExpiry: false,
  },
  {
    id: 'police',
    title: 'Police Verification',
    iconPath: MDI_DOCS.shieldStar,
    sides: ['Upload Police Certificate'],
    numberLabel: 'Certificate Number',
    hasExpiry: false,
  },
];

export function getDocument(id: DocId) {
  return DOCUMENTS.find(d => d.id === id) ?? DOCUMENTS[0];
}