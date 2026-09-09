import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminApi } from "@/api/admin.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDate, formatNpr, formatPercent, rangeToDates } from "@/utils/format";
import { entityId } from "@/utils/cn";

const ranges = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "3m", label: "3 months" },
  { value: "6m", label: "6 months" },
  { value: "1y", label: "1 year" },
  { value: "custom", label: "Custom" }
];

export default function RateHistory() {
  const [range, setRange] = useState("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [rateKind, setRateKind] = useState<"NRB" | "COMPANY">("NRB");
  const { from, to } = useMemo(() => rangeToDates(range, customFrom, customTo), [range, customFrom, customTo]);

  const currencies = useQuery({ queryKey: ["admin-currencies"], queryFn: adminApi.rates.currencies });
  const chart = useQuery({
    queryKey: ["admin-rate-chart", currencyCode, from, to, rateKind],
    queryFn: () => adminApi.rates.chart({ currencyCode, from, to, rateKind })
  });
  const history = useQuery({
    queryKey: ["admin-rate-history", currencyCode, from, to, rateKind],
    queryFn: () => adminApi.rates.history({ currencyCode, from, to, rateKind, limit: 50 })
  });

  const summary = chart.data?.summary;

  return (
    <div>
      <PageHeader
        title="Rate history"
        description="Historical NRB and company rates"
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Rate History" }]}
      />
      <div className="mb-6 grid gap-3 md:grid-cols-5">
        <Select
          label="Currency"
          value={currencyCode}
          onChange={(event) => setCurrencyCode(event.target.value)}
          options={(currencies.data ?? []).map((item) => ({ value: item.code, label: `${item.code} · ${item.name}` }))}
        />
        <Select
          label="Kind"
          value={rateKind}
          onChange={(event) => setRateKind(event.target.value as "NRB" | "COMPANY")}
          options={[
            { value: "NRB", label: "NRB" },
            { value: "COMPANY", label: "Company" }
          ]}
        />
        <Select label="Range" value={range} onChange={(event) => setRange(event.target.value)} options={ranges} />
        {range === "custom" ? (
          <>
            <Input label="From" type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} />
            <Input label="To" type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} />
          </>
        ) : (
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={async () => {
                const response = await adminApi.rates.exportHistory({ currencyCode, from, to });
                const blob = new Blob([response.data], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "exchange-rate-history.csv";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </Button>
          </div>
        )}
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-wider text-gold">High</p>
          <p className="mt-1 font-display text-2xl">{formatNpr(summary?.highest)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-gold">Low</p>
          <p className="mt-1 font-display text-2xl">{formatNpr(summary?.lowest)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-gold">Average</p>
          <p className="mt-1 font-display text-2xl">{formatNpr(summary?.average)}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-gold">Change</p>
          <p className="mt-1 font-display text-2xl">{formatPercent(summary?.changePercent)}</p>
        </Card>
      </div>
      <Card className="mb-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart.data?.series ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#C5D0DE" />
            <XAxis dataKey="date" tickFormatter={(value: string) => formatDate(value)} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="buy" stroke="#2E3192" name="Buy" dot={false} />
            <Line type="monotone" dataKey="sell" stroke="#E31E24" name="Sell" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <DataTable
        columns={[
          { key: "date", header: "Date", render: (row) => formatDate(row.effectiveDate) },
          { key: "kind", header: "Kind", render: (row) => row.rateKind },
          { key: "buy", header: "Buy", render: (row) => formatNpr(row.buyRate) },
          { key: "sell", header: "Sell", render: (row) => formatNpr(row.sellRate) },
          { key: "change", header: "Buy change", render: (row) => formatNpr(row.changeBuy, 4) },
          { key: "source", header: "Source", render: (row) => row.source },
          { key: "by", header: "By", render: (row) => row.changedBy }
        ]}
        rows={history.data?.items ?? []}
        loading={history.isLoading}
        rowKey={(row) => entityId(row)}
        total={history.data?.total}
        page={history.data?.page}
        limit={history.data?.limit}
      />
    </div>
  );
}
