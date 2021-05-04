import { derived, Readable, writable, Writable } from 'svelte/store';
import { loggedIn } from './current_user';
import { Auth } from '../config/firebase';

export const taxonomies: Writable<Taxonomy[]> = writable(null);
export const taxonomyId: Writable<number> = writable(null);
export const reload: Writable<boolean> = writable(false);
export const reloadCount: Writable<number> = writable(0);

export const load = (): void => {
  fetch(__global.env.API_URL + "public/taxonomies")
    .then((response) => response.json())
    .then((response) => {
      taxonomies.set(response);
    });
};

let localLoggedIn: boolean = false;

loggedIn.subscribe((val) => {
  localLoggedIn = val;
});

// Simply resetting the reload to false and observing it,
// had no effect, therefore we need an additional changing variable 
let count = 0;
reload.subscribe((val) => {
  if (val) {
    count += 1;
    reloadCount.set(count);
  }
});

export const taxonomy: Readable<Taxonomy> = derived(
  [taxonomyId, reloadCount],
  ([$taxonomyId], set) => {
    set(null);
    if (localLoggedIn && $taxonomyId) {
      Auth.currentUser.getIdToken()
        .then((token) => {
          return fetch(
            `${__global.env.API_URL}taxonomy/${$taxonomyId}`,
            {
              headers: {'Authorization': `Bearer ${token}`}
            }
          );
        })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          set(response[0]);
          reload.set(false);
        });
    }
  }
)