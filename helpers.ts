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

// There's probably some sort of type for serializable objects only
export class SerializableSet extends Set {
  add(elem: any) {
    return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }

  has(elem: any) {
    return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }

  delete(elem: any) {
    return super.delete(typeof elem === 'object' ? JSON.stringify(elem) : elem);
  }

  // TODO - update iterators
}

export const transpose = <T>(array2D: T[][]) =>
  array2D[0].map((_, col) => array2D.map((row) => row[col]));
