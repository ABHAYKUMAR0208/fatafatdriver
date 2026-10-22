import {useEffect, useState, useSyncExternalStore} from 'react';

// Which document the detail screen shows. Add more keys here later
// (for example 'vehicleRc', 'insurance') when those screens are designed.
export type DocumentKey = 'licence';

export type DocumentDetail = {
  number: string;
  issuedState: string;
  expiry: string; // already formatted for display, e.g. "Oct 14, 2026"
  status: 'valid' | 'expired';
  approval: 'approved' | 'pending' | 'rejected';
};

// TODO: call your API here (e.g. GET /driver/documents/licence) and return the data.
// Right now it returns the sample values from the design so the screen is not empty.
export async function fetchDocumentDetail(_key: DocumentKey): Promise<DocumentDetail> {
  return {
    number: 'DL-0420-2019-0045678',
    issuedState: 'Delhi (DL)',
    expiry: 'Oct 14, 2026',
    status: 'valid',
    approval: 'approved',
  };
}

// ---- details the rider / driver saved from the upload screen ---------------

// Kept here so the detail screen shows them right after "Update Document".
// TODO: send these to your API too, and drop this once the API returns them.
let saved: Partial<Record<DocumentKey, DocumentDetail>> = {};
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export type SavedDocumentFields = {
  number: string;
  issuedState: string;
  expiry: string; // formatted for display
};

// Called when the upload screen saves. The expiry was already checked to be
// today or later, so the status is valid; an updated document goes back
// under review (see the note on the detail screen).
export function saveDocumentDetail(key: DocumentKey, fields: SavedDocumentFields) {
  saved = {
    ...saved,
    [key]: {
      number: fields.number.trim(),
      issuedState: fields.issuedState,
      expiry: fields.expiry,
      status: 'valid',
      approval: 'pending',
    },
  };
  listeners.forEach(l => l());
}

export type DocumentDetailState = {
  loading: boolean;
  failed: boolean;
  detail?: DocumentDetail;
  reload: () => void;
};

export function useDocumentDetail(key: DocumentKey): DocumentDetailState {
  const [fetched, setFetched] = useState<DocumentDetail | undefined>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);
  // what the user saved wins over what the API / sample returned
  const override = useSyncExternalStore(subscribe, () => saved[key]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetchDocumentDetail(key)
      .then(res => {
        if (alive) {
          setFetched(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setFailed(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [key, tick]);

  return {
    loading: override ? false : loading,
    failed: override ? false : failed,
    detail: override ?? fetched,
    reload: () => setTick(t => t + 1),
  };
}
