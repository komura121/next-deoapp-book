import { create } from "zustand";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import { useStore } from "zustand";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { getStorage, ref } from "../api/firebase";
import { uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

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
  booksId: "",
  booksHeading: "",
  currentIndex: "",

  //   action
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
  setShowPassword: (showPassword) => ({ showPassword }),
  setChapters: (chapters) => set({ chapters }),
  setNewChapter: (newChapter) => set({ newChapter }),
  setDescription: (description) => set(description),
  setBooksParams: (booksId, booksHeading) => set({ booksId, booksHeading }),

  fetchBookData: async (booksId) => {
    if (!booksId) {
      console.error("Book ID is undefined.");
      return;
    }

    try {
      const bookRef = doc(db, "books", booksId);
      const bookSnap = await getDoc(bookRef);

      if (bookSnap.exists()) {
        const bookData = bookSnap.data();
        if (bookData && bookData.coverImg) {
          set({ coverImageUrl: bookData.coverImg });
        } else {
          console.error("Cover image data not found in the book data.");
        }
        if (bookData && bookData.chapters) {
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
      const storage = getStorage();
      const storageRef = ref(storage, `covers/${coverImageFile.name}`);
      await uploadBytes(storageRef, coverImageFile);
      const imageUrl = await getDownloadURL(storageRef);

      const newBooks = {
        heading: newBookName,
        coverImg: imageUrl,
        text: "Lorem",
        deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: "",
        label: "",
        category: "",
        pemilik: userName,
        uid: user.uid,
      };

      try {
        const docRef = await addDoc(collection(db, "books"), newBooks);
        newBooks.id = docRef.id;
        setNewBooks((prevBooks) => [...prevBooks, newBooks]);
        setNewBookName("");
        setCoverImageFile(null);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  },
  handleChangeImage: async (e, booksId, closeImageBox) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `covers/${file.name}`);

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);
      set({ coverImageUrl: downloadURL });

      closeImageBox(); // You need to pass closeImageBox as a parameter
      const bookRef = doc(db, "books", booksId);
      await updateDoc(bookRef, {
        coverImg: downloadURL,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  },

  handleAccordionClicked: (chapterId, booksId, booksHeading, navigate) => {
    navigate(`/project/${booksId}/${booksHeading}/${chapterId}`);
  },

  signOut: async (navigate) => {
    try {
      await auth.signOut(); // Melakukan logout dengan Firebase Authentication
      console.log("Signed out successfully");
      navigate("/login");
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
