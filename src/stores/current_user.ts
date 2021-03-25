import { writable, derived, Writable, Readable } from "svelte/store";

const userInfo: Writable<{
  id?: string | number,
  emailVerified?: boolean,
  email?: string,
  name?: string,
  phoneNumber?: string,
  photoUrl?: string
}> = writable({});

export const roles: Writable<string[]> = writable([]);

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
  [userInfo, roles],
  ([$userInfo, $roles]) => ($userInfo && 'id' in $userInfo && $userInfo.id !== 0)
);

export const validated: Readable<boolean> = derived(
  [userInfo, roles],
  ([$userInfo, $roles]) => ($userInfo && 'id' in $userInfo && $userInfo.id !== 0 && 'emailVerified' in $userInfo && $userInfo.emailVerified)
);

export const hasRoles: Readable<boolean> = derived(
  roles,
  ($roles) => ($roles && $roles.length > 0)
)