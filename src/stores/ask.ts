import { writable, Writable } from 'svelte/store';

export const question: Writable<string> = writable(null);
export const description: Writable<string> = writable(null);
export const name: Writable<string> = writable(null);
export const mail: Writable<string> = writable(null);
export const age: Writable<string> = writable(null);
export const gender: Writable<string> = writable(null);
export const postcode: Writable<string> = writable(null);
export const register: Writable<string> = writable('no');

export const questionAsked: Writable<string> = writable('');
export const questionAskedId: Writable<number> = writable(null);
export const related: Writable<publicQuestion[]> = writable([]);
export const relatedToken: Writable<string> = writable('');

export const reset = ():void => {
  [
    question,
    description,
    name,
    mail,
    age,
    postcode,
    gender,
  ].forEach((s) => s.set(null));
  register.set('no');
};

export const postcodes: Writable<{
  postcode: number,
  regiostar: number,
  state: string
}[]> = writable(null);

let postcodesLength: number = 0;
postcodes.subscribe((p) => {
  if (p) {
    postcodesLength = p.length;
  } else {
    postcodesLength = 0;
  }
});

export const load = ():void => {
  if (postcodesLength === 0) {
    fetch('http://localhost:5000/assets/data/platform.csv')
      .then((response) => response.text())
      .then((text) => {
        postcodes.set(text.split('\n').map((row) => {
          const cols = row.split(',');
          return {
            postcode: parseInt(cols[0]),
            regiostar: 50 + parseInt(cols[1]),
            state: cols[2]
          };
        }));
      });
  }
};