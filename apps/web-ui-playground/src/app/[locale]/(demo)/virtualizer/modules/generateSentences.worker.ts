import { faker } from '@faker-js/faker';

function randomNumber(min: number, max: number) {
  return faker.number.int({ min, max });
}

globalThis.addEventListener('message', event => {
  const { count } = event.data;

  const sentences = Array.from({ length: count }).map(() => faker.lorem.sentence(randomNumber(20, 70)));

  // oxlint-disable-next-line unicorn/require-post-message-target-origin
  globalThis.postMessage({ sentences });
});
