type MarkdownTable = {
  headers: string[];
  data: Record<string, string>[];
};

export function parseMarkdownTable(table: string): MarkdownTable {
  const rows = table.split('\n').filter((row) => row.trim() !== '');
  const headers = rows[0].split('|').slice(1, -1).map((header) => header.trim());
  const data = rows.slice(2).map((row) => {
    const cells = row.split('|').slice(1, -1).map((cell) => cell.trim());
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  });
  return { headers, data };
}

export function formatMarkdownTable(table: MarkdownTable): string {
  // Calculate max width for each column
  const columnWidths = table.headers.map((header, index) => {
    const columnValues = [
      header,
      ...table.data.map((row) => Object.values(row)[index] || ''),
    ];
    return Math.max(...columnValues.map((val) => val.length));
  });

  // Format rows with padding
  const padCell = (t: string, width: number) => t.padEnd(width, ' ');

  const topBorder = `┌${columnWidths.map((w) => '─'.repeat(w + 2)).join('┬')}┐`;
  const headerRow = `│ ${table.headers.map((h, i) => padCell(h, columnWidths[i])).join(' │ ')} │`;
  const middleBorder = `├${columnWidths.map((w) => '─'.repeat(w + 2)).join('┼')}┤`;
  // eslint-disable-next-line max-len
  const dataRows = table.data.map((row) => `│ ${Object.values(row).map((cell, i) => padCell(cell || '', columnWidths[i])).join(' │ ')} │`);
  const bottomBorder = `└${columnWidths.map((w) => '─'.repeat(w + 2)).join('┴')}┘`;

  return [topBorder, headerRow, middleBorder, ...dataRows, bottomBorder].join('\n');
}
