import firebase from 'firebase/app'
import 'firebase/firebase-firestore'
import 'firebase/firebase-auth'
import 'firebase/firebase-functions'
import 'firebase/firebase-storage'
import { firebaseConfig } from './settings'

firebase.initializeApp(firebaseConfig)

export const Firestore = firebase.firestore()
export const Auth = firebase.auth()
export const Functions = firebase.app().functions('europe-west3')
export const Storage = firebase.storage()
