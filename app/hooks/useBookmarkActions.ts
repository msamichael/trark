import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "@/app/store/bookmarkSlice";
import { RootState } from "@/app/store";
import { BookmarkedShow } from "@/app/store/bookmarkSlice";

export function useBookmarkActions() {
  const dispatch = useDispatch();

  const bookmarks = useSelector(
    (state: RootState) => state.bookmark.bookmarks
  );

  function isBookmarked(item: BookmarkedShow) {
    return bookmarks.some(
      (b:BookmarkedShow) => b.id === item.id && b.type === item.type
    );
  }

  function toggleBookmark(item: BookmarkedShow, pressed: boolean) {
    if (pressed) {
      console.log('dispatching addBookmark', item)
      dispatch(addBookmark(item));
       console.log('Dispatched addBookmark');
      
    } else {
      console.log('Removing the show')
      dispatch(removeBookmark(item));
    }
  }

  return {
    isBookmarked,
    toggleBookmark,
  };
}
