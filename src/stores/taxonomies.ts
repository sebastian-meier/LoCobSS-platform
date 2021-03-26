import { writable, Writable } from 'svelte/store';

export const taxonomies: Writable<Taxonomy[]> = writable(null);

export const load = (): void => {
  fetch("http://localhost:5001/bmbf-research-agenda/europe-west3/api/public/taxonomies")
    .then((response) => response.json())
    .then((response) => {
      taxonomies.set(response);
    });
};