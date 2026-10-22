import {useEffect, useState} from 'react';

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

export type DocumentDetailState = {
  loading: boolean;
  failed: boolean;
  detail?: DocumentDetail;
  reload: () => void;
};

export function useDocumentDetail(key: DocumentKey): DocumentDetailState {
  const [detail, setDetail] = useState<DocumentDetail | undefined>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setFailed(false);
    fetchDocumentDetail(key)
      .then(res => {
        if (alive) {
          setDetail(res);
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

  return {loading, failed, detail, reload: () => setTick(t => t + 1)};
}