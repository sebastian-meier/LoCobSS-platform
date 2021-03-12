import { currentUser } from '../../stores/current_user'
import { Auth } from '../../config/firebase'

Auth.onAuthStateChanged(() => {
  if (Auth.currentUser) {
    currentUser.set({
      email: Auth.currentUser.email,
      id: Auth.currentUser.uid,
      name: Auth.currentUser.displayName,
      phoneNumber: Auth.currentUser.phoneNumber,
      photoUrl: Auth.currentUser.photoURL,
      emailVerified: Auth.currentUser.emailVerified
    });
  } else {
    currentUser.set({ id: 0, emailVerified: false })
  }
})
