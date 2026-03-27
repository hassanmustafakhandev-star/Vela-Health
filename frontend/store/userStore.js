import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';

const useUserStore = create((set, get) => ({
  profile: null,
  familyMembers: [],
  activeMember: null,
  language: 'en',

  fetchProfile: async (uid) => {
    if (!uid) return;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          profile: data,
          familyMembers: data?.familyMembers || [],
          language: data?.language || 'en',
        });
        document.documentElement.setAttribute('dir', data?.language === 'ur' ? 'rtl' : 'ltr');
      }
    } catch (e) {
      console.error('Error fetching profile', e);
    }
  },

  updateProfile: async (uid, data) => {
    try {
      // If it's a mock UID or firebase is not fully ready, update state and proceed
      if (uid.startsWith('mock-')) {
        set(state => ({ profile: { ...state.profile, ...data } }));
        return;
      }
      
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, data, { merge: true });
      set(state => ({ profile: { ...state.profile, ...data } }));
    } catch (e) {
      console.error('Error updating profile', e);
      // Fallback for local dev
      set(state => ({ profile: { ...state.profile, ...data } }));
    }
  },

  setLanguage: (lang) => {
    set({ language: lang });
    document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
  },

  setActiveMember: (member) => {
    set({ activeMember: member });
  },

  addFamilyMember: async (uid, member) => {
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, {
        familyMembers: arrayUnion(member)
      }, { merge: true });
      set(state => ({
        familyMembers: [...state.familyMembers, member]
      }));
    } catch (e) {
      console.error('Error adding family member', e);
    }
  }
}));

export default useUserStore;
