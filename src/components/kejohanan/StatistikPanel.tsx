import { PingatBadge } from "./PingatBadge";
import type { KejohananStatistik } from "@/types/kejohanan";

interface StatistikPanelProps {
  statistik: KejohananStatistik;
}

export function StatistikPanel({ statistik }: StatistikPanelProps) {
  const cards = [
    { label: "Emas", count: statistik.pingat_emas, color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { label: "Perak", count: statistik.pingat_perak, color: "bg-gray-50 border-gray-200 text-gray-600" },
    { label: "Gangsa", count: statistik.pingat_gangsa, color: "bg-orange-50 border-orange-200 text-orange-700" },
    { label: "Tiada Pingat", count: statistik.tiada_pingat, color: "bg-gray-50 border-gray-200 text-gray-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border bg-blue-50 border-blue-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-700">{statistik.jumlah_atlet}</p>
          <p className="text-xs font-medium text-blue-600 mt-1">Jumlah Atlet</p>
        </div>
        {cards.map(({ label, count, color }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-xs font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Results table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h3 className="text-sm font-semibold text-gray-700">Keputusan Atlet</h3>
        </div>
        {statistik.keputusan.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Tiada keputusan direkodkan lagi.
          </div>
        ) : (
          <div className="divide-y">
            {statistik.keputusan.map((r, i) => (
              <div
                key={r.id}
                className="flex items-center gap-4 px-4 py-3"
              >
                <span className="w-8 text-sm font-semibold text-gray-400 text-center">
                  {r.placement ?? "—"}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {r.athlete.nama_atlet}
                  </p>
                  <p className="text-xs text-gray-500">{r.athlete.acara}</p>
                </div>
                {r.skor && (
                  <span className="text-sm text-gray-600">{r.skor}</span>
                )}
                {r.pingat && <PingatBadge pingat={r.pingat} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
