import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "@/app/store/bookmarkSlice";
import { RootState } from "@/app/store";
import { BookmarkedShow } from "@/app/store/bookmarkSlice";
import { useAuth } from "./useAuth";
import { addBookmarkToFirebase, deleteBookmarkFromFirebase } from "../lib/firebaseStorage";

export function useBookmarkActions() {
  const dispatch = useDispatch();
const { user } = useAuth();
  const bookmarks = useSelector(
    (state: RootState) => state.bookmark.bookmarks
  );

  function isBookmarked(item: BookmarkedShow) {
    return bookmarks.some(
      (b:BookmarkedShow) => b.id === item.id && b.type === item.type
    );
  }

  // Inside useBookmarkActions.ts
async function toggleBookmark(item: BookmarkedShow, pressed: boolean) {
  if (pressed) {
    dispatch(addBookmark(item));
    if (user) await addBookmarkToFirebase(user.uid, item); // PERSIST TO CLOUD
  } else {
    dispatch(removeBookmark(item));
    if (user) await deleteBookmarkFromFirebase(user, item); // PERSIST TO CLOUD
  }
}

  return {
    isBookmarked,
    toggleBookmark,
  };
}
