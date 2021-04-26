import { derived, Readable, writable, Writable } from 'svelte/store';
import { loggedIn } from './current_user';
import { Auth } from '../config/firebase';

export const replies: Writable<Taxonomy[]> = writable(null);
export const replyId: Writable<number> = writable(null);
export const reload: Writable<boolean> = writable(false);
export const reloadCount: Writable<number> = writable(0);

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

export const load = (): void => {
  fetch("http://localhost:5001/bmbf-research-agenda/europe-west3/api/public/replies")
    .then((response) => response.json())
    .then((response) => {
      replies.set(response);
    });
};

export const reply: Readable<Reply> = derived(
  [replyId, reloadCount],
  ([$replyId], set) => {
    set(null);
    if (localLoggedIn && $replyId) {
      Auth.currentUser.getIdToken()
        .then((token) => {
          return fetch(
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/replies/${$replyId}`,
            {
              headers: {'Authorization': `Bearer ${token}`}
            }
          );
        })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          set(response.result);
          reload.set(false);
        });
    }
  }
)