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
          __global.env.API_URL + 'user/questions',
          {
            headers: {'Authorization': `Bearer ${token}`}
          }
        );
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        questions.set(response.results);
        return true;
      });
  } else {
    return false;
  }
}