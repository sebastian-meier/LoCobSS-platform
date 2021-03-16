import { writable, Writable, Readable, derived } from 'svelte/store'

export const detailId: Writable<string> = writable(null);

export const cache: Readable<publicQuestion> = derived(
  [
    detailId
  ],
  ([
    $detailId
  ], 
  set) => {
    (async() => {
      if ($detailId) {
        const response = await fetch(
          // `https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/public/questions${($page > 0) ? '/' + $page : ''}${query}`,
          `http://localhost:5001/bmbf-research-agenda/europe-west3/api/public/question/${$detailId}`
        ).then((response) => response.json());

        set(response[0]);
      }
    })();
  }
);

export const relatedCache: Readable<publicQuestionResult> = derived(
  [
    detailId
  ],
  ([
    $detailId
  ], 
  set) => {
    (async() => {
      if ($detailId) {
        const response = await fetch(
          // `https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/public/questions${($page > 0) ? '/' + $page : ''}${query}`,
          `http://localhost:5001/bmbf-research-agenda/europe-west3/api/public/related/questions/${$detailId}`
        ).then((response) => response.json());

        set(response);
      }
    })();
  }
);

