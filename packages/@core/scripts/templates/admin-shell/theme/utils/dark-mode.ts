/** Dark mode class name */
const DARK_CLASS = 'dark';

/**
 * Toggle HTML class helper
 *
 * @param className Class name to toggle
 * @returns Object with add and remove functions
 */
function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return { add, remove };
}

/**
 * Toggle CSS dark mode
 *
 * Adds or removes the 'dark' class on the html element
 *
 * @param darkMode Is dark mode enabled
 */
export function toggleCssDarkMode(darkMode = false): void {
  const { add, remove } = toggleHtmlClass(DARK_CLASS);

  if (darkMode) {
    add();
  } else {
    remove();
  }
}

/**
 * Check if dark mode class is present
 *
 * @returns Whether dark mode class is on html element
 */
export function isDarkModeClass(): boolean {
  return document.documentElement.classList.contains(DARK_CLASS);
}
