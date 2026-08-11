/** Small dependency-free CSV writer — escapes quotes/commas/newlines per RFC 4180. */
export function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escapeCell = (cell: string | number | null | undefined): string => {
    const value = cell === null || cell === undefined ? "" : String(cell);
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const lines = [headers.map(escapeCell).join(",")];
  for (const row of rows) {
    lines.push(row.map(escapeCell).join(","));
  }
  return lines.join("\r\n");
}
