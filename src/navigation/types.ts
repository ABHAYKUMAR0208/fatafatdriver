import type { VehicleId } from '@/constants/vehicles';
import type { DocId } from '@/constants/documents';
import type { DriverDocId } from '@/constants/driverDocuments';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { DocumentKey } from '@/state/documentDetailStore';


// Screens Fare Match can continue to once the driver answers it.
export type FareMatchNext = 'HelmetCheck' | 'RiderIdentityCheck' | 'ActiveTrip' | 'DropVerification';

export type RootStackParamList = {
  Splash: undefined;
  SessionCheck: undefined;
  NoInternet: undefined;
  Maintenance: undefined;
  UpdateRequired: undefined;
  ResumeTrip: undefined;
  RiderLogin: undefined;
  OtpVerification: { phone?: string } | undefined;
  BecomeRider: undefined;
  PersonalDetails: { fromReview?: boolean } | undefined;
  VehicleType: undefined;
  VehicleDetails: { vehicle?: VehicleId; fromReview?: boolean } | undefined;
  DocumentChecklist: undefined;
  UploadDocument: { docId: DocId };
  PayoutIntro: undefined;
  BankDetails: { next?: 'ReviewSubmit' | 'DriverReview' } | undefined;
  ReviewSubmit: undefined;
  VerificationPending: undefined;
  VerificationRejected: undefined;
  DriverIntro: undefined;
  DriverPersonal: { fromReview?: boolean } | undefined;
  DriverExperience: { fromReview?: boolean } | undefined;
  DriverAvailability: undefined;
  DriverDocuments: undefined;
  DriverUploadDocument: { docId: DriverDocId };
  DriverPayout: undefined;
  DriverReview: undefined;
  DriverVerificationPending: undefined;
  DriverVerificationRejected: undefined;
  Home: NavigatorScreenParams<MainTabParamList> | undefined;
  Alerts: undefined;
  PayoutHistory: undefined;
  EarningsActivity: undefined;
  PayoutDetail: { payoutId?: string } | undefined;
  WeeklyPlan: undefined;
  IncomingTrip: undefined;
  TripAccepted: undefined;
  EnRoutePickup: undefined;
  ArrivedWaiting: undefined;
  HelmetCheck: undefined;
  RiderIdentityCheck: undefined;
  ActiveTrip: undefined;
  CancelTrip: undefined;
  TripComplete: undefined;
  DeliveryRequest: undefined;
  ParcelPickup: undefined;
  ParcelInTransit: undefined;
  DropVerification: undefined;
  SequentialDropoffs: undefined;
  CarpoolRequest: undefined;
  MultiStopManifest: undefined;
  CancelStop: { passengerId: string };
    DocumentDetail: { docKey: DocumentKey };
  // next = the screen to open after Fare Match (the OTP / start step of the flow)
  FareMatch: { next?: FareMatchNext } | undefined;
  RequestExpired: undefined;
};

export type MainTabParamList = {
  // online = open Home already online (e.g. after "Submit & Go Online")
  HomeTab: { online?: boolean } | undefined;
  Trips: undefined;
  Earnings: undefined;
  Profile: undefined;
};
