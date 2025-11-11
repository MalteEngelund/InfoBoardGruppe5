export const API_URL = 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json';

export async function fetchRawMenu() {
  const res = await fetch(API_URL);
  const raw = await res.text();
  return { res, raw };
}
