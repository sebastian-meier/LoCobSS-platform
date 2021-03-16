import { writable, Writable } from 'svelte/store';
import { loggedIn } from './current_user';
import { Auth } from '../config/firebase';

export const questions: Writable<publicQuestion[]> = writable(null);

let localLoggedIn: boolean = false;

loggedIn.subscribe((val) => {
  localLoggedIn = val;
});

export const load = async(): Promise<boolean> => {
  if (localLoggedIn) {
    return await Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
          //'https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/questions',
          // 'http://localhost:5001/bmbf-research-agenda/europe-west3/api/questions',
          'http://localhost:5000/assets/data/questions.json',
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