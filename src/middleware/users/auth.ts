import { loggedIn, currentUser, roles } from '../../stores/current_user';
import { Auth } from '../../config/firebase';

Auth.onAuthStateChanged(() => {
  if (Auth.currentUser) {
    Auth.currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        if ('role' in idTokenResult.claims) {
          roles.set([idTokenResult.claims.role]);
        }
      });

    currentUser.set({
      email: Auth.currentUser.email,
      id: Auth.currentUser.uid,
      name: Auth.currentUser.displayName,
      phoneNumber: Auth.currentUser.phoneNumber,
      photoUrl: Auth.currentUser.photoURL,
      emailVerified: Auth.currentUser.emailVerified
    });
  } else {
    currentUser.set({ id: 0, emailVerified: false });
    roles.set([]);
  }
})

export const addAuthorization = async (header?: {} | { headers: {} }): 
  Promise<{} | { headers: { 'Authorization': string} }> => {

  const lHeader = header || {};
  if (Auth.currentUser) {
    const token = await Auth.currentUser.getIdToken();
    if (!('headers' in lHeader)) {
      lHeader['headers'] = {};
    }
    lHeader['headers']['Authorization'] = `Bearer ${token}`;
  }
  return lHeader;
}
