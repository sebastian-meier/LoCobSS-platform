import { writable, Writable, Readable, derived } from 'svelte/store';
import { loggedIn } from './current_user';
import { Auth } from '../config/firebase';

export const detailId: Writable<number> = writable(null);
export const limit: Writable<number> = writable(10);

export const cache: Readable<publicQuestion> = derived(
  [
    detailId, loggedIn
  ],
  ([
    $detailId, $loggedIn
  ], 
  set) => {
    (async() => {
      if ($detailId && $loggedIn) {
        const response = await Auth.currentUser.getIdToken()
          .then((token) => {
            return fetch(
              // `https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/public/questions${($page > 0) ? '/' + $page : ''}${query}`,
              `http://localhost:5001/bmbf-research-agenda/europe-west3/api/question/${$detailId}`,
              {
                headers: {'Authorization': `Bearer ${token}`}
              }
            );
          })
          .then((response) => {
            return response.json();
          });

        set(response[0]);
      }
    })();
  }
);

export const newClusterIds: Writable<number[]> = writable([]);
export const clusterIds: Readable<number[]> = derived(
  [detailId, newClusterIds],
  ([$detailId, $newClusterIds], set) => {
    set([...$newClusterIds, ...[$detailId]])
  }
);

export const questions: Readable<publicQuestion[]> = derived(
  [clusterIds, limit, cache, loggedIn],
  ([$clusterIds, $limit, $cache, $loggedIn], set) => {
    (async() => {
      if ($clusterIds.length > 0 && $loggedIn && $cache) {
        const response = await Auth.currentUser.getIdToken()
          .then((token) => {
            return fetch(
              // `https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/public/questions${($page > 0) ? '/' + $page : ''}${query}`,
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/related/questions/cluster/?ids=${$clusterIds.join(',')}&limit=${$limit}`,
              {
                headers: {'Authorization': `Bearer ${token}`}
              }
            );
          })
          .then((response) => {
            return response.json();
          });

        set([...response.results.filter((r) => r.id !== $cache.id), ...[$cache]]);
      } else {
        set([]);
      }
    })();
  }
);

export const ignoredIds: Writable<number[]> = writable([]);

export const relatedIds: Readable<number[]> = derived(
  [questions,clusterIds,ignoredIds],
  ([$questions,$clusterIds,$ignoredIds], set) => {
    if ($questions && $questions.length > 0) {
      const ids = $questions.map((q) => q.id);
      set(ids.filter((id) => !$clusterIds.includes(id) && !$ignoredIds.includes(id)));
    } else {
      set([]);
    }
  }
);

export const clusterQuestions: Readable<publicQuestion[]> = derived(
  [questions,clusterIds],
  ([$questions, $clusterIds], set) => {
    if ($questions && $questions.length > 0) {
      set($questions.filter((q) => $clusterIds.includes(q.id)))
    } else {
      set([]);
    }
  }
);

export const relatedQuestions: Readable<publicQuestion[]> = derived(
  [questions,relatedIds],
  ([$questions, $relatedIds], set) => {
    if ($questions && $questions.length > 0) {
      set($questions.filter((q) => $relatedIds.includes(q.id)))
    } else {
      set([]);
    }
  }
);

export const ignoredQuestions: Readable<publicQuestion[]> = derived(
  [questions,ignoredIds],
  ([$questions, $ignoredIds], set) => {
    if ($questions && $questions.length > 0) {
      set($questions.filter((q) => $ignoredIds.includes(q.id)))
    } else {
      set([]);
    }
  }
);