// 1. Represents the Teller Till details from Fineract
export interface Teller {
  id: number;
  officeId: number;
  officeName: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// 2. Represents the Cashier Drawer details from Fineract
export interface Cashier {
  id: number;
  tellerId: number;
  tellerName: string;
  staffId: number;
  staffName: string;
  description: string;
}

// 3. TellerSession represents the core state of the cashier
export interface TellerSession {
  status: 'OPEN' | 'CLOSED' | 'SUSPENDED';
  openingBalance: number;
  cashier: Cashier | null; // Holds nested cashier metadata (IDs + names)
  teller: Teller | null;   // Holds nested branch/till metadata
}

// 4. DenominationBreakdown represents a single row in counting grids
export interface DenominationBreakdown {
  denomination: number; // e.g., 10000, 5000, 2000
  quantity: number;     // Subtotal is calculated dynamically in component forms
}

// 5. TellerTransaction tracks events for Daily Journals (Node 19-20)
export interface TellerTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'NOTE_EXCHANGE';
  amount: number;
  clientName?: string;
  accountNumber?: string;
  timestamp: string;    // String representation matching API payloads
}
