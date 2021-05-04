import { writable, Writable, Readable, derived } from 'svelte/store';
import {addAuthorization} from '../middleware/users/auth';
import {loggedIn} from './current_user';

export const detailId: Writable<string> = writable(null);

export const cache: Readable<publicQuestion> = derived(
  [
    detailId,
    loggedIn
  ],
  ([
    $detailId
  ], 
  set) => {
    (async() => {
      if ($detailId) {
        const response = await fetch(
          `${__global.env.API_URL}public/question/${$detailId}`,
          await addAuthorization()
        ).then((response) => response.json());

        set(response.result);
      }
    })();
  }
);

export const relatedCache: Readable<publicQuestion[]> = derived(
  [
    detailId,
    loggedIn
  ],
  ([
    $detailId
  ], 
  set) => {
    (async() => {
      if ($detailId) {
        const response = await fetch(
          `${__global.env.API_URL}public/related/questions/${$detailId}`,
          await addAuthorization()
        ).then((response) => response.json());

        set(response);
      }
    })();
  }
);

