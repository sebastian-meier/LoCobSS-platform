import { derived, writable, Writable, Readable } from 'svelte/store';
import { loggedIn } from './current_user';
import { Auth } from '../config/firebase';

export const questions: Writable<publicQuestion[]> = writable(null);
export const questionId: Writable<number> = writable(null);
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

export const load = async(): Promise<boolean> => {
  if (localLoggedIn) {
    questions.set(null);
    return await Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
          __global.env.API_URL + 'questions',
          {
            headers: {'Authorization': `Bearer ${token}`}
          }
        );
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        questions.set(response.result);
        return true;
      });
  } else {
    return false;
  }
}

export const question: Readable<publicQuestion> = derived(
  [questionId, reloadCount],
  ([$questionId], set) => {
    set(null);
    if (localLoggedIn && $questionId) {
      Auth.currentUser.getIdToken()
        .then((token) => {
          return fetch(
            `${__global.env.API_URL}question/${$questionId}`,
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
