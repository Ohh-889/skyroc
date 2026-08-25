/**
 * Toggle auxiliary color modes
 *
 * Applies CSS filters for grayscale and colour weakness modes
 *
 * @param grayscaleMode Enable grayscale mode
 * @param colourWeakness Enable colour weakness mode
 */
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false): void {
  const htmlElement = document.documentElement;

  htmlElement.style.filter = [grayscaleMode ? 'grayscale(100%)' : '', colourWeakness ? 'invert(80%)' : '']
    .filter(Boolean)
    .join(' ');
}

/** Clear all auxiliary color modes */
export function clearAuxiliaryColorModes(): void {
  document.documentElement.style.filter = '';
}
