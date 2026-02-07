import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/config/firebase";
import { BookmarkedShow } from "@/app/store/bookmarkSlice";

const BOOKMARKS_COLLECTION = "bookmarks";

// Authentication operations
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("❌ Google sign-in failed:", error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("❌ Sign out failed:", error);
    throw error;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Bookmark operations (Firebase version)
export async function addBookmarkToFirebase(
  userId: string,
  show: BookmarkedShow,
) {
  try {
    const exists = await checkBookmarkExists(userId, show);
    if (exists) {
      //   console.log("Bookmark already exists, not adding duplicate.");
      return;
    }
    const bookmarksRef = collection(db, BOOKMARKS_COLLECTION);

    await addDoc(bookmarksRef, {
      userId: userId,
      id: show.id,
      type: show.type,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Failed to add bookmark to Firebase:", error);
    throw error;
  }
}

export async function deleteBookmarkFromFirebase(
  user: User,
  show: BookmarkedShow,
) {
  try {
    const bookmarksRef = collection(db, BOOKMARKS_COLLECTION);

    const q = query(
      bookmarksRef,
      where("userId", "==", user.uid),
      where("id", "==", show.id),
      where("type", "==", show.type),
    );

    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db, BOOKMARKS_COLLECTION, docSnapshot.id)),
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("❌ Failed to delete bookmark from Firebase:", error);
    throw error;
  }
}

export async function getBookmarksFromFirebase(
  userId: string,
): Promise<BookmarkedShow[]> {
  try {
    const bookmarksCollectionRef = collection(db, BOOKMARKS_COLLECTION);
    const q = query(bookmarksCollectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt;
      return {
        id: data.id,
        type: data.type,
        ...data,
        createdAt,
      } as BookmarkedShow;
    });
  } catch (error) {
    console.error("❌ Failed to get bookmarks from Firebase:", error);
    throw error;
  }
}
export async function saveBookmarksToFirebase(
  userId: string,
  shows: BookmarkedShow[],
): Promise<void> {
  try {
    // console.log(` Saving ${shows.length} bookmarks to Firebase`);

    // Get existing bookmarks to avoid duplicates
    const currentCloudBookmarks = await getBookmarksFromFirebase(userId);
    // A slightly cleaner way to write the filter in Option 1
    const currentCloudKeys = new Set(
      currentCloudBookmarks.map((b) => `${b.id}-${b.type}`),
    );

    // Only save shows that DON'T exist in the set we just fetched
    const newFilteredLocalBookmarkedShow = shows.filter(
      (b) => !currentCloudKeys.has(`${b.id}-${b.type}`),
    );
    if (newFilteredLocalBookmarkedShow.length === 0) {
      // console.log('No new bookmarks to save');
      return;
    }

    // Add all new bookmarks
    const bookmarksRef = collection(db, BOOKMARKS_COLLECTION);
    const addPromises = newFilteredLocalBookmarkedShow.map((show) => {
      return addDoc(bookmarksRef, {
        ...show,
        userId,
        createdAt: serverTimestamp(),
      });
    });

    await Promise.all(addPromises);
    console.log(
      `✅ Saved ${newFilteredLocalBookmarkedShow.length} new bookmarks`,
    );
  } catch (error) {
    console.error("❌ Migration save failed:", error);
    throw error;
  }
}
export async function clearAllFirebaseBookmarks(userId: string) {
  const q = query(collection(db, "bookmarks"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletePromises);
}

/**
 * Helper: Check if a bookmark already exists
 */
async function checkBookmarkExists(
  userId: string,
  show: BookmarkedShow,
): Promise<boolean> {
  try {
    const bookmarksRef = collection(db, BOOKMARKS_COLLECTION);
    const q = query(
      bookmarksRef,
      where("userId", "==", userId),
      where("id", "==", show.id),
      where("type", "==", show.type),
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("❌ Failed to check bookmark existence:", error);
    return false;
  }
}
