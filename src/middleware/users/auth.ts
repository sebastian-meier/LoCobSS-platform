import { currentUser } from '../../stores/current_user'
import { Auth } from '../../config/firebase'

Auth.onAuthStateChanged(() => {
  if (Auth.currentUser) {
    const userInfo = {
      email: Auth.currentUser.email,
      id: Auth.currentUser.uid,
      phoneNumber: Auth.currentUser.phoneNumber,
      photoUrl: Auth.currentUser.photoURL
    }
  } else {
    currentUser.set({ id: 0 })
  }
})
