import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { auth, db } from "@/utility/firebaseConfig";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ROLE_ADMIN, ROLE_USER } from "@/constants/appConstants";

export const useAuthStore = defineStore("authStore", () => {
    const user = ref(null)
    const error = ref(null)
    const isLoading = ref(false)
    const role = ref(null)
    const initialized = ref(false)

    const isAuthenticated = computed(() => user.value !== null)
    const isAdmin = computed(() => role.value === ROLE_ADMIN)

    const initilizeAuth = async () => {
        console.log('initializedAuth')

        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                user.value = firebaseUser
                initialized.value = true
            } else {
                clearUser()
            }
        })
    }

    const signUpUser = async (email, password) => {
        isLoading.value = true
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

            await setDoc(doc(db, 'users', userCredentials.user.uid), {
                email: userCredentials.user.email,
                role: ROLE_USER,
                createdAt: new Date()
            })

            clearUser()
            error.value = null
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const signInUser = async (email, password) => {
        isLoading.value = true
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)

            user.value = userCredentials.user
            role.value = ROLE_USER
            error.value = null
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const signOutUser = async () => {
        isLoading.value = true
        try {
            await signOut(auth)
            clearUser()
            error.value = null
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const clearUser = () => {
        user.value = null
        role.value = null
    }

    return {
        // states
        user,
        error,
        isLoading,
        role,
        initialized,

        // getters
        isAuthenticated,
        isAdmin,

        // actions
        signUpUser,
        signInUser,
        initilizeAuth,
        signOutUser
    }
})