import { create } from "zustand";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, addDoc, collection } from "firebase/firestore";
import { db, auth, storage } from "../api/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";

const usePageStore = create((set) => ({
  newBooks: [],
  newBookName: "",
  coverImageUrl: "https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png",
  coverImageFile: null,
  user: null,
  userName: "",
  isLoading: false,
  email: "",
  password: "",
  showPassword: false,
  error: "",
  chapters: new Map(),
  newChapter: null,
  description: null,
  bookId: "",
  bookHeading: "",
  currentIndex: "",

  // Actions
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  setNewBooks: (newBooks) => set({ newBooks }),
  setNewBookName: (newBookName) => set({ newBookName }),
  setCoverImageUrl: (coverImageUrl) => set({ coverImageUrl }),
  setCoverImageFile: (coverImageFile) => set({ coverImageFile }),
  setUser: (user) => set({ user }),
  setUserName: (userName) => set({ userName }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setShowPassword: (showPassword) => set({ showPassword }),
  setChapters: (chapters) => set({ chapters }),
  setNewChapter: (newChapter) => set({ newChapter }),
  setDescription: (description) => set({ description }),
  setBookParams: (bookId, bookHeading) => set({ bookId, bookHeading }),

  fetchBookData: async (bookId) => {
    if (!bookId) {
      console.error("Book ID is undefined.");
      return;
    }

    try {
      const bookRef = doc(db, "books", bookId);
      const bookSnap = await getDoc(bookRef);

      if (bookSnap.exists()) {
        const bookData = bookSnap.data();
        if (bookData.coverImg) {
          set({ coverImageUrl: bookData.coverImg });
        } else {
          console.error("Cover image data not found in the book data.");
        }
        if (bookData.chapters) {
          set({ chapters: new Map(Object.entries(bookData.chapters)) });
        } else {
          console.error("Chapters data not found in the book data.");
        }
      } else {
        console.error("Book document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  },

  handleAddBook: async () => {
    const { newBookName, coverImageFile, userName, user, setNewBooks, setNewBookName, setCoverImageFile } = usePageStore.getState();

    if (newBookName.trim() !== "" && coverImageFile) {
      const storageRef = ref(storage, `covers/${coverImageFile.name}`);
      await uploadBytes(storageRef, coverImageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const newBook = {
        heading: newBookName,
        coverImg: imageUrl,
        text: "Lorem",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: "",
        label: "",
        category: "",
        owner: userName,
        uid: user.uid,
      };

      try {
        const docRef = await addDoc(collection(db, "books"), newBook);
        newBook.id = docRef.id;
        setNewBooks((prevBooks) => [...prevBooks, newBook]);
        setNewBookName("");
        setCoverImageFile(null);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  },

  handleChangeImage: async (e, bookId, closeImageBox) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `covers/${file.name}`);

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);
      set({ coverImageUrl: downloadURL });

      closeImageBox(); // Ensure closeImageBox is passed as a parameter
      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        coverImg: downloadURL,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  },

  signOut: async () => {
    try {
      await auth.signOut();
      console.log("Signed out successfully");
      Router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  },

  handleDeleteBook: async (bookId) => {
    const { newBooks, setNewBooks } = usePageStore.getState();

    try {
      await deleteDoc(doc(db, "books", bookId));
      setNewBooks(newBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  },
}));

export default usePageStore;
