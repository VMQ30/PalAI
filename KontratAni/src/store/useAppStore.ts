// useAppStore.ts

import { create } from 'zustand';

export type CropStatus = 'pending' | 'seeds_planted' | 'fertilized' | 'growing' | 'ready_for_harvest' | 'harvested' | 'delivered';
export type ContractStatus = 'open' | 'matched' | 'accepted' | 'funded' | 'in_progress' | 'completed' | 'declined';
export type FarmerSmsStatus = 'pending' | 'notified' | 'confirmed' | 'planted' | 'harvested';

export type MilestoneVerificationStatus = 'pending_verification' | 'verified' | 'disputed';

export interface MilestoneEvidence {
  cropStatus: CropStatus;
  photoFileName: string;
  submittedAt: string;
  verificationStatus: MilestoneVerificationStatus;
  verifiedAt?: string;
  disputeReason?: string;
}

// ── Types from useStore ───────────────────────────────────────────────────────
export type Role = 'buyer' | 'coop_manager' | 'solo_farmer' | 'sub_farmer';
export type EscrowStatus = 'unfunded' | 'locked' | 'released';
export type PlotStatus = 'idle' | 'assigned' | 'planted' | 'harvested' | 'declined';

export interface User {
  id: string;
  name: string;
  role: Role;
  walletBalance: number;
  payoutMethod: 'Cash' | 'GCash' | 'Maya';
  smsStatus?: 'pending' | 'notified' | 'planted' | 'declined';
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
}

export interface FarmPlot {
  id: string;
  ownerId: string;
  assignedFarmerId: string | null;
  coordinates: [number, number];
  status: PlotStatus;
  currentContractId: string | null;
}

// ── Types from useAppStore ────────────────────────────────────────────────────
export interface Farmer {
  id: string;
  name: string;
  hectares: number;
  location: string;
  lat: number;
  lng: number;
  soilType: string;
  smsStatus: FarmerSmsStatus;
  assignedKg: number;
  payoutMethod: 'cash' | 'gcash' | 'maya';
  paid: boolean;
}

export interface Cooperative {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  totalHectares: number;
  members: Farmer[];
  soilScore: number;
  weatherScore: number;
}

export interface SoloFarmer {
  id: string;
  name: string;
  hectares: number;
  location: string;
  lat: number;
  lng: number;
  soilType: string;
  smsStatus: FarmerSmsStatus;
  assignedKg: number;
  payoutMethod: 'cash' | 'gcash' | 'maya';
  paid: boolean;
}

export interface Contract {
  // useAppStore fields
  id: string;
  crop: string;
  volumeKg: number;
  targetDate: string;
  status: ContractStatus;
  cropStatus: CropStatus;
  progress: number;
  buyerName: string;
  matchedCooperative?: Cooperative;
  escrowAmount: number;
  createdAt: string;
}

export interface DemandRequest {
  crop: string;
  volumeKg: number;
  targetDate: string;
}

export interface BroadcastMessage {
  id: string;
  text: string;
  time: string;
}

// ── Combined state ────────────────────────────────────────────────────────────
interface AppState {
  // ── useAppStore state ──────────────────────────────────────────────────────
  contracts: Contract[];
  cooperatives: Cooperative[];
  soloFarmers: SoloFarmer[];
  activeView: string;
  selectedContractId: string | null;

  // Broadcast messages from manager to farmers
  broadcastMessages: BroadcastMessage[];

  addBroadcastMessage: (text: string) => void;
  clearBroadcastMessages: () => void;
  setActiveView: (view: string) => void;
  selectContract: (id: string | null) => void;
  addContract: (demand: DemandRequest) => Contract;
  matchContract: (contractId: string, coopId: string) => void;
  acceptContract: (contractId: string) => void;
  declineContract: (contractId: string) => void;
  fundContract: (contractId: string) => void;
  updateCropStatus: (contractId: string, status: CropStatus) => void;
  updateFarmerSmsStatus: (contractId: string, farmerId: string, status: FarmerSmsStatus) => void;
  addCoopMember: (coopId: string, farmer: Farmer) => void;
  removeCoopMember: (coopId: string, farmerId: string) => void;
  updateCoopMemberCrops: (coopId: string, farmerId: string, crops: string[]) => void;
}

const mockFarmers: Farmer[] = [
  { id: 'f1', name: 'Juan dela Cruz',  hectares: 2.5, location: 'Brgy. San Jose',   lat: 14.58, lng: 121.0,  soilType: 'Loam',       smsStatus: 'pending', assignedKg: 0, payoutMethod: 'gcash', paid: false },
  { id: 'f2', name: 'Maria Santos',    hectares: 1.8, location: 'Brgy. Sta. Rosa',  lat: 14.61, lng: 121.02, soilType: 'Clay Loam',  smsStatus: 'pending', assignedKg: 0, payoutMethod: 'maya',  paid: false },
  { id: 'f3', name: 'Pedro Reyes',     hectares: 3.0, location: 'Brgy. Bagumbayan', lat: 14.56, lng: 120.98, soilType: 'Sandy Loam', smsStatus: 'pending', assignedKg: 0, payoutMethod: 'cash',  paid: false },
  { id: 'f4', name: 'Ana Flores',      hectares: 2.2, location: 'Brgy. Maligaya',   lat: 14.59, lng: 121.04, soilType: 'Loam',       smsStatus: 'pending', assignedKg: 0, payoutMethod: 'gcash', paid: false },
  { id: 'f5', name: 'Ricardo Mendoza', hectares: 4.0, location: 'Brgy. Pag-asa',    lat: 14.63, lng: 120.96, soilType: 'Silt Loam',  smsStatus: 'pending', assignedKg: 0, payoutMethod: 'cash',  paid: false },
];

// ── Mock cooperatives ─────────────────────────────────────────────────────────
const mockCooperatives: Cooperative[] = [
  { id: 'coop1', name: 'Quezon Farmers Cooperative', region: 'Quezon Province',  lat: 14.59, lng: 121.01, totalHectares: 13.5, soilScore: 87, weatherScore: 92, members: mockFarmers.slice(0, 3) },
  { id: 'coop2', name: 'Laguna Harvest Alliance',    region: 'Laguna Province',   lat: 14.27, lng: 121.41, totalHectares: 9.0,  soilScore: 91, weatherScore: 85, members: mockFarmers.slice(2, 5) },
  { id: 'coop3', name: 'Batangas Green Growers',     region: 'Batangas Province', lat: 13.76, lng: 121.06, totalHectares: 18.2, soilScore: 94, weatherScore: 88, members: mockFarmers },
];

const mocksoloFarmers: SoloFarmer[] = [
  {
    id: 'sf1', name: 'Luzviminda Garcia', hectares: 1.5, location: 'Brgy. San Isidro',
    lat: 14.57, lng: 121.03, soilType: 'Loam', smsStatus: 'pending', assignedKg: 0,
    payoutMethod: 'gcash', paid: false,
  },
  {
    id: 'sf2', name: 'Manuel Santos', hectares: 2.0, location: 'Brgy. Santa Cruz',
    lat: 14.60, lng: 121.05, soilType: 'Silt Loam', smsStatus: 'pending', assignedKg: 0,
    payoutMethod: 'maya', paid: false,
  },
];

// MOCK CONTRACTS — 7 scenarios, one per verification lifecycle state.
// Each contract is designed so judges can open any portal and immediately see
// a live interactive state without needing to set anything up first.
//
// Scenario map:
//   c1  Coop    — accepted, no escrow            → DirectPayout: "locked"
//   c2  Coop    — in_progress, escrow funded     → DirectPayout: "escrow_funded", next step submittable
//   c3  Coop    — milestone pending_verification  → ContractProgress: amber badge, AuditLog shows entry
//   c4  Solo    — delivery pending buyer confirm  → ContractsView: amber "Confirm Delivery" banner
//   c5  Coop    — disputed, escrow frozen         → PayoutView: locked, DisputeFrozenBanner visible
//   c6  Coop    — buyer confirmed, payout ready   → PayoutView: Distribute button enabled
//   c7  Solo    — completed, payout paid         → DirectPayout: "paid" stage, transaction record
//
// This array is also used by resetContracts() — it is a named const (not inline)
// so the reset action can reference the original values cleanly.
const mockContracts: Contract[] = [

  // ── Scenario 1 — Coop, accepted, no escrow ───────────────────────────────
  // What judges see:
  //   Buyer portal → ContractsView: "Lock Funds in Escrow" button available
  //   DirectPayoutView (farmer portal): "Escrow Not Yet Funded" locked banner
  //   ContractProgress: "seeds_planted" step is the next submittable step
  // What they can do:
  //   Click "Lock Funds in Escrow" → escrow funded → state advances to scenario 2
  {
    id: 'c1', crop: 'Tomatoes', volumeKg: 5000, targetDate: '2026-06-15',
    status: 'in_progress', cropStatus: 'growing', progress: 60,
    buyerName: 'Metro Fresh Foods', matchedCooperative: mockCooperatives[0],
    escrowAmount: 150000, createdAt: '2026-01-10',
  },

  // ── Scenario 3 — Coop, milestone pending_verification ────────────────────
  // What judges see:
  //   ContractProgress: "ready_for_harvest" step shows amber Hourglass + "Awaiting buyer sign-off"
  //   AuditLog (buyer): pending evidence entry at the top of the log
  //   MilestoneStepper: amber node on "Ready for Harvest"
  //   ContractAiAssistant: "Awaiting Sign-off" badge in contract table
  // What they can do:
  //   Buyer portal → ContractsView → click the contract → no confirm banner (not delivery yet)
  //   DemoOverlay → "Buyer: Verify Milestone" → milestone confirmed → progress advances
  //   OR DemoOverlay → "Buyer: Dispute Milestone" → escrow frozen → advances to scenario 5
  {
    id: 'c2', crop: 'Rice (Sinandomeng)', volumeKg: 10000, targetDate: '2026-08-01',
    status: 'funded', cropStatus: 'seeds_planted', progress: 25,
    buyerName: 'Metro Fresh Foods', matchedCooperative: mockCooperatives[2],
    escrowAmount: 450000, createdAt: '2026-02-01',
  },
  {
    id: 'c3', crop: 'Onions (Red)', volumeKg: 3000, targetDate: '2026-05-20',
    status: 'matched', cropStatus: 'pending', progress: 10,
    buyerName: 'Metro Fresh Foods', matchedCooperative: mockCooperatives[1],
    escrowAmount: 0, createdAt: '2026-03-05',
  },
];

const VERIFIED_PROGRESS_MAP: Record<CropStatus, number> = {
  pending:            0,
  seeds_planted:     25,
  fertilized:        40,
  growing:           60,
  ready_for_harvest: 80,
  harvested:         95,
  delivered:        100,
};

// ── Mock data (useStore) ──────────────────────────────────────────────────────
const initialUsers: User[] = [
  { id: 'farmer_01', name: 'Juan Dela Cruz', role: 'sub_farmer', walletBalance: 0, payoutMethod: 'GCash', smsStatus: 'pending' },
  { id: 'farmer_02', name: 'Maria Santos',   role: 'sub_farmer', walletBalance: 0, payoutMethod: 'Cash',  smsStatus: 'pending' },
];

const initialPlots: FarmPlot[] = [
  { id: 'plot_A', ownerId: 'coop_01', assignedFarmerId: null, coordinates: [14.5995, 120.9842], status: 'idle', currentContractId: null },
  { id: 'plot_B', ownerId: 'coop_01', assignedFarmerId: null, coordinates: [14.6010, 120.9850], status: 'idle', currentContractId: null },
];

// ── Store ─────────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>((set, get) => ({
  // ── useAppStore initial state ──────────────────────────────────────────────
  contracts: mockContracts,
  cooperatives: mockCooperatives,
  soloFarmers: mockSoloFarmers,
  activeView: 'dashboard',
  selectedContractId: null,
  broadcastMessages: [],

  addBroadcastMessage: (text) => {
    const msg: BroadcastMessage = {
      id: `bcast-${Date.now()}`,
      text,
      time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    };
    set((s) => ({ broadcastMessages: [...s.broadcastMessages, msg] }));
  },
  clearBroadcastMessages: () => set({ broadcastMessages: [] }),
  setActiveView:  (view) => set({ activeView: view }),
  selectContract: (id)   => set({ selectedContractId: id }),

  addContract: (demand) => {
    const newContract: Contract = {
      id: `c${Date.now()}`,
      crop: demand.crop,
      volumeKg: demand.volumeKg,
      targetDate: demand.targetDate,
      status: 'open',
      cropStatus: 'pending',
      progress: 0,
      buyerName: 'Metro Fresh Foods',
      escrowAmount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((s) => ({ contracts: [...s.contracts, newContract] }));
    return newContract;
  },

  matchContract: (contractId, coopId) => {
    const coop = get().cooperatives.find((c) => c.id === coopId);
    if (!coop) return;
    set((s) => ({
      contracts: s.contracts.map((c) =>
        c.id === contractId
          ? { ...c, status: 'matched' as ContractStatus, matchedCooperative: coop, progress: 10 }
          : c,
      ),
    }));
  },

  // acceptContract: merged — updates both useAppStore status and useStore timeline
  acceptContract: (contractId) => {
    set((s) => ({
      contracts: s.contracts.map((c) =>
        c.id === contractId ? { ...c, status: 'accepted' as ContractStatus, progress: 15 } : c
      ),
    }));
  },

  declineContract: (contractId) => {
    set((s) => ({
      contracts: s.contracts.map((c) =>
        c.id === contractId ? { ...c, status: 'declined' as ContractStatus, progress: 0 } : c,
      ),
    }));
  },

  fundContract: (contractId) => {
    set((s) => ({
      contracts: s.contracts.map((c) =>
        c.id === contractId
          ? { ...c, status: 'funded' as ContractStatus, escrowAmount: c.volumeKg * 30, progress: Math.max(c.progress, 20) }
          : c
      ),
    }));
  },

  updateCropStatus: (contractId, status) => {
    set((s) => ({
      contracts: s.contracts.map((c) =>
        c.id === contractId
          ? {
              ...c,
              cropStatus: status,
              progress: progressMap[status],
              status: status === 'delivered' ? ('completed' as ContractStatus) : c.status,
            }
          : c,
      ),
    }));
  },

  // updateFarmerSmsStatus: merged — updates cooperative members (useAppStore) AND
  // users / farmPlots / contract timeline (useStore)
  updateFarmerSmsStatus: (contractId, farmerId, status) => {
    set((s) => {
      // 1. Update cooperative member smsStatus inside the matched contract (useAppStore)
      const updatedContracts = s.contracts.map((c) => {
        if (c.id !== contractId || !c.matchedCooperative) return c;
        return {
          ...c,
          matchedCooperative: {
            ...c.matchedCooperative,
            members: c.matchedCooperative.members.map((f) =>
              f.id === farmerId ? { ...f, smsStatus: status } : f,
            ),
          },
        };
      });

      // 2. Update User smsStatus (useStore) — map FarmerSmsStatus → useStore smsStatus
      const userStatus = (['pending', 'notified', 'planted', 'declined'] as const).includes(
        status as any
      )
        ? (status as 'pending' | 'notified' | 'planted' | 'declined')
        : undefined;

      const updatedUsers = userStatus
        ? s.users.map((u) => (u.id === farmerId ? { ...u, smsStatus: userStatus } : u))
        : s.users;

      // 3. Update farmPlot status (useStore)
      // Cast to string first because FarmerSmsStatus doesn't include 'declined',
      // but this function may be called from useStore paths that pass that value.
      const statusStr = status as string;
      const updatedPlots = s.farmPlots.map((p) =>
        p.assignedFarmerId === farmerId
          ? {
              ...p,
              status:
                statusStr === 'declined'
                  ? ('declined' as PlotStatus)
                  : statusStr === 'planted' || statusStr === 'harvested'
                  ? (statusStr as PlotStatus)
                  : p.status,
            }
          : p
      );

      return { contracts: updatedContracts, users: updatedUsers, farmPlots: updatedPlots };
    });
  },

  addCoopMember: (coopId, farmer) => {
    set((s) => ({
      cooperatives: s.cooperatives.map((coop) =>
        coop.id === coopId
          ? { ...coop, members: [...coop.members, farmer], totalHectares: parseFloat((coop.totalHectares + farmer.hectares).toFixed(2)) }
          : coop,
      ),
    }));
  },

  removeCoopMember: (coopId, farmerId) => {
    set((s) => ({
      cooperatives: s.cooperatives.map((coop) => {
        if (coop.id !== coopId) return coop;
        const removed = coop.members.find((f) => f.id === farmerId);
        return {
          ...coop,
          members: coop.members.filter((f) => f.id !== farmerId),
          totalHectares: parseFloat((coop.totalHectares - (removed?.hectares ?? 0)).toFixed(2)),
        };
      }),
    }));
  },

  updateCoopMemberCrops: (coopId, farmerId, crops) => {
    set((s) => ({
      cooperatives: s.cooperatives.map((coop) =>
        coop.id !== coopId
          ? coop
          : { ...coop, members: coop.members.map((f) => (f.id === farmerId ? { ...f, crops } as any : f)) },
      ),
    }));
  },

  submitMilestoneEvidence: (contractId, cropStatus, photoFileName) => {
    const evidence: MilestoneEvidence = {
      cropStatus,
      photoFileName,
      submittedAt: new Date().toISOString(),
      verificationStatus: 'pending_verification',
    };
    set((s) => ({
      contracts: s.contracts.map((c) => {
        if (c.id !== contractId) return c;
        const existingIdx = c.milestoneEvidence.findIndex((e) => e.cropStatus === cropStatus);
        const updatedEvidence =
          existingIdx >= 0
            ? c.milestoneEvidence.map((e, i) => (i === existingIdx ? evidence : e))
            : [...c.milestoneEvidence, evidence];
        return {
          ...c,
          cropStatus,
          pendingBuyerConfirmation: cropStatus === 'delivered' ? true : c.pendingBuyerConfirmation,
          milestoneEvidence: updatedEvidence,
        };
      }),
    }));
  },

  verifyMilestone: (contractId, cropStatus) => {
    set((s) => ({
      contracts: s.contracts.map((c) => {
        if (c.id !== contractId) return c;
        const updatedEvidence = c.milestoneEvidence.map((e) =>
          e.cropStatus === cropStatus
            ? { ...e, verificationStatus: 'verified' as MilestoneVerificationStatus, verifiedAt: new Date().toISOString() }
            : e,
        );
        const isDelivery = cropStatus === 'delivered';
        return {
          ...c,
          progress: VERIFIED_PROGRESS_MAP[cropStatus],
          status: isDelivery ? ('completed' as ContractStatus) : c.status,
          buyerConfirmedDelivery: isDelivery ? true : c.buyerConfirmedDelivery,
          pendingBuyerConfirmation: isDelivery ? false : c.pendingBuyerConfirmation,
          milestoneEvidence: updatedEvidence,
        };
      }),
    }));
  },

  disputeMilestone: (contractId, cropStatus, reason) => {
    set((s) => ({
      contracts: s.contracts.map((c) => {
        if (c.id !== contractId) return c;
        const updatedEvidence = c.milestoneEvidence.map((e) =>
          e.cropStatus === cropStatus
            ? { ...e, verificationStatus: 'disputed' as MilestoneVerificationStatus, disputeReason: reason }
            : e,
        );
        return { ...c, disputeFlag: true, milestoneEvidence: updatedEvidence };
      }),
    }));
  },

  resolveDispute: (contractId) => {
    set((s) => ({
      contracts: s.contracts.map((c) => {
        if (c.id !== contractId) return c;
        const updatedEvidence = c.milestoneEvidence.map((e) =>
          e.verificationStatus === 'disputed'
            ? { ...e, verificationStatus: 'pending_verification' as MilestoneVerificationStatus, disputeReason: undefined }
            : e,
        );
        return { ...c, disputeFlag: false, milestoneEvidence: updatedEvidence };
      }),
    }));
  },

  // ── new code starts here ────────────────────────────────────────────────────
  // resetContracts: deep-clones mockContracts back into the store.
  // JSON round-trip breaks all object references so React re-renders cleanly.
  resetContracts: () => {
    set({
      contracts: JSON.parse(JSON.stringify(mockContracts)),
      selectedContractId: null,
    });
  },

  // updateContract: dev-only direct partial merge for the DemoOverlay editor.
  // Spreads `partial` over the matching contract — whatever fields are provided
  // are overwritten; nothing else is touched. No computed side-effects fire.
  updateContract: (contractId, partial) => {
    set((s) => ({
      contracts: s.contracts.map((c) =>
        c.id === contractId ? { ...c, ...partial } : c,
      ),
    }));
  },
}));