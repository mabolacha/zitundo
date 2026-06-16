export type Technology = 'Fibre' | 'ADSL' | 'VDSL' | '4G Box' | '5G Box';
export type OfferCategory = 'pure-player' | 'low-cost';

export interface Offer {
  categorie: OfferCategory;
  id: string;
  operator: string;
  brand: string;
  name: string;
  promoPrice: number;
  regularPrice: number;
  promoDuration: number; // months
  technology: Technology;
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  installationFee: number;
  activationFee: number;
  modemRental: number; // per month
  terminationFee: number;
  hasTV: boolean;
  tvChannels?: number;
  hasFixedPhone: boolean;
  hasMobilePhone: boolean;
  mobileData?: string;
  commitment: number; // months, 0 = none
  highlight?: string;
  color: string;
  logo: string;
}

export interface Filters {
  technology: Technology | 'all';
  maxPrice: number;
  minDownload: number;
  operator: string;
  hasTV: boolean;
  hasPhone: boolean;
}

export interface TCOResult {
  offerId: string;
  offerName: string;
  promoCost: number;
  regularCost: number;
  installationFee: number;
  activationFee: number;
  modemCost: number;
  terminationFee: number;
  total: number;
  monthlySmoothed: number;
}

export type MigrationStep = {
  id: number;
  title: string;
  description: string;
  detail: string;
  done: boolean;
};

export type EligibilityResult = {
  address: string;
  hasFiber: boolean;
  hasADSL: boolean;
  nro?: string;
  maxSpeed?: number;
  availableOperators: string[];
};
