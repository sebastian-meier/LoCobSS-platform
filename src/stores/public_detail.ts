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
          // `https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/public/questions${($page > 0) ? '/' + $page : ''}${query}`,
          `http://localhost:5001/bmbf-research-agenda/europe-west3/api/public/question/${$detailId}`,
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
          // `https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/public/questions${($page > 0) ? '/' + $page : ''}${query}`,
          `http://localhost:5001/bmbf-research-agenda/europe-west3/api/public/related/questions/${$detailId}`,
          await addAuthorization()
        ).then((response) => response.json());

        set(response);
      }
    })();
  }
);

