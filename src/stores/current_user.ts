import { writable, derived, Writable, Readable } from "svelte/store";

const userInfo: Writable<{
  id?: string | number,
}> = writable({});

const setUser = user => {
  userInfo.set(user);
};

const removeUser = () => {
  userInfo.set({});
};

export const currentUser = {
  subscribe: userInfo.subscribe,
  set: setUser,
  remove: removeUser
};

export const loggedIn: Readable<boolean> = derived(
  userInfo,
  ($userInfo) => ($userInfo && 'id' in $userInfo && $userInfo.id !== 0)
);


