export const fileLinesToStringArray = async (
  filePath: string
): Promise<string[]> => {
  const file = Bun.file(filePath);
  const text = await file.text();

  const lines = text.split('\n');

  const n = lines.length;

  if (lines[n - 1] === '') {
    lines.pop();
    return lines.slice(0, n);
  }

  return lines;
};

export const fileLineToGrid = async (filePath: string) => {
  const stringLines = await fileLinesToStringArray(filePath);

  return stringLines.map((line) => line.split(''));
};

export const range = (size: number, startAt: number) => {
  return [...Array(size).keys()].map((i) => i + startAt);
};
