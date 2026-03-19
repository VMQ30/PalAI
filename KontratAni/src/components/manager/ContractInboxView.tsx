import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Inbox, AlertCircle, Leaf, Wallet, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface InboxContract {
  id: string;
  buyer: string;
  buyerType: string;
  crop: string;
  volumeKg: number;
  pricePerKg: number;
  escrowAmount: number;
  targetDate: string;
  terms: string;
  status: 'pending' | 'accepted' | 'declined';
  postedAt: string;
}

interface ContractInboxViewProps {
  contracts: InboxContract[];
  isSolo: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const FILTER_TABS = ['all', 'pending', 'accepted', 'declined'] as const;

const statusStyles: Record<string, { badge: string; label: string }> = {
  pending:  { badge: 'border-amber-200 bg-amber-50 text-amber-800',  label: 'Awaiting Review' },
  accepted: { badge: 'border-green-200 bg-green-50 text-green-800',  label: 'Accepted'        },
  declined: { badge: 'border-red-200   bg-red-50   text-red-800',    label: 'Declined'        },
};

export function ContractInboxView({
  contracts,
  isSolo,
  onAccept,
  onDecline,
}: ContractInboxViewProps) {
  const [selected, setSelected] = useState<InboxContract | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Keep selected in sync with latest contract state
  const selectedLatest = selected
    ? contracts.find((c) => c.id === selected.id) ?? null
    : null;

  const filtered =
    filter === 'all' ? contracts : contracts.filter((c) => c.status === filter);

  const metric = (label: string, value: string) => (
    <div className="rounded-lg bg-accent p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );

  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4">
      {/* ── Left: list ── */}
      <div>
        {/* Filter tabs */}
        <div className="mb-4 flex gap-1.5">
          {FILTER_TABS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-[#1A2E1A] text-[#86EFAD]'
                  : 'bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((c, i) => {
            const s = statusStyles[c.status];
            return (
              <motion.button
                key={c.id}
                onClick={() => setSelected(c)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                  selectedLatest?.id === c.id
                    ? 'border-[#2D6A4F] bg-[#EAF3DE]'
                    : 'border-border/50 bg-card hover:border-[#2D6A4F]/30 hover:bg-[#EAF3DE]/30'
                }`}
              >
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{c.crop}</p>
                  <Badge variant="outline" className={`shrink-0 text-[10px] ${s.badge}`}>
                    {s.label}
                  </Badge>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">{c.buyer}</p>
                <div className="flex gap-3 text-[11px] text-muted-foreground">
                  <span>{c.volumeKg.toLocaleString()} kg</span>
                  <span>₱{c.pricePerKg}/kg</span>
                  <span className="ml-auto">{c.postedAt}</span>
                </div>
              </motion.button>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Inbox className="mb-3 h-8 w-8 opacity-30" />
              <p className="text-sm">No contracts in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: detail panel ── */}
      <div>
        <AnimatePresence mode="wait">
          {selectedLatest ? (
            <motion.div
              key={selectedLatest.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardHeader className="border-b border-border/60 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{selectedLatest.crop}</CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF3DE] text-[9px] font-bold text-[#27500A]">
                          {selectedLatest.buyer
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedLatest.buyer} · {selectedLatest.buyerType}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${statusStyles[selectedLatest.status].badge}`}
                    >
                      {statusStyles[selectedLatest.status].label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  {/* Metrics */}
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {metric('Volume', `${(selectedLatest.volumeKg / 1000).toFixed(1)}t`)}
                    {metric('Price / kg', `₱${selectedLatest.pricePerKg}`)}
                    {metric('Escrow', `₱${(selectedLatest.escrowAmount / 1000).toFixed(0)}k`)}
                  </div>

                  {/* Details row */}
                  <div className="mb-4 space-y-2.5 border-t border-border/60 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" /> Target Delivery
                      </div>
                      <span className="font-medium">{selectedLatest.targetDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Wallet className="h-3.5 w-3.5" /> Contract ID
                      </div>
                      <span className="font-mono text-xs font-medium">{selectedLatest.id}</span>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="mb-4">
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Contract Terms
                    </p>
                    <div className="rounded-lg bg-accent p-3 text-sm leading-relaxed text-foreground">
                      {selectedLatest.terms}
                    </div>
                  </div>

                  {/* Solo notice */}
                  {isSolo && selectedLatest.status === 'pending' && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#9FE1CB] bg-[#E1F5EE] p-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0F6E56]" />
                      <p className="text-xs text-[#085041]">
                        Solo mode: accepting assigns fulfillment entirely to you.
                      </p>
                    </div>
                  )}

                  {/* CTAs */}
                  {selectedLatest.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAccept(selectedLatest.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2D6A4F] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      >
                        <Check className="h-4 w-4" /> Accept Contract
                      </button>
                      <button
                        onClick={() => onDecline(selectedLatest.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <X className="h-4 w-4" /> Decline
                      </button>
                    </div>
                  )}

                  {selectedLatest.status === 'accepted' && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#C0DD97] bg-[#EAF3DE] px-3 py-2.5">
                      <Check className="h-4 w-4 shrink-0 text-[#2D6A4F]" />
                      <p className="text-sm text-[#27500A]">
                        Accepted — visible to buyer and tracked in analytics.
                      </p>
                    </div>
                  )}

                  {selectedLatest.status === 'declined' && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                      <X className="h-4 w-4 shrink-0 text-red-700" />
                      <p className="text-sm text-red-800">
                        Declined — the buyer has been notified.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground"
            >
              <Inbox className="mb-3 h-8 w-8 opacity-30" />
              <p className="text-sm">Select a contract to review</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}