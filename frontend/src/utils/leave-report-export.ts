import type { AttendanceReport } from "@/types/leave";

function xmlEscape(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function downloadBlob(content: Blob, filename: string) {
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function reportToRows(report: AttendanceReport) {
  const header = [
    "Name",
    ...report.days.map((day) => String(day.day)),
    "Total present",
    "Total Absent",
    "Total Over Time",
    "Total leave in a year",
    "Balance"
  ];
  const body = report.employees.map((row) => [
    row.name,
    ...row.cells.map((cell) => cell.mark),
    String(row.present),
    String(row.absent),
    String(row.overtime),
    String(row.leaveInYear),
    String(row.balance)
  ]);
  return [header, ...body];
}

export function exportLeaveReportExcel(report: AttendanceReport, company: string) {
  const rows = reportToRows(report);
  const table = rows
    .map(
      (row) =>
        `<Row>${row
          .map((cell) => `<Cell><Data ss:Type="String">${xmlEscape(cell)}</Data></Cell>`)
          .join("")}</Row>`
    )
    .join("");
  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Summary">
  <Table>
   <Row><Cell><Data ss:Type="String">${xmlEscape(company)}</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">${xmlEscape(`${report.monthNameNp} ${report.bsYear} · ${report.monthName}`)}</Data></Cell></Row>
   ${table}
  </Table>
 </Worksheet>
</Workbook>`;
  downloadBlob(
    new Blob([xml], { type: "application/vnd.ms-excel" }),
    `leave-summary-${report.bsYear}-${String(report.bsMonth).padStart(2, "0")}.xls`
  );
}
