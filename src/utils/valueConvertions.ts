export function convertByteToMB(size: number): number {
  if (!size || typeof size !== 'number') {
    return 0;
  }

  return size / 1024 / 1024;
}
