import userEvent from '@testing-library/user-event';

export function setupUser() {
  return userEvent.setup();
}
