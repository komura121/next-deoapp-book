import { db } from "../../services/api/firebase";
import { getDoc, doc, collection, query, where, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set limit to handle large file uploads
    },
  },
};

const handler = async (req, res) => {
  const {
    method,
    query: { uid },
    body,
  } = req;

  try {
    if (method === "GET") {
      const userDoc = await getDoc(doc(db, "users", uid));
      const userData = userDoc.exists() ? userDoc.data() : null;

      const booksSnapshot = await getDocs(query(collection(db, "books"), where("uid", "==", uid)));
      const booksList = booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      return res.status(200).json({ user: userData, books: booksList });
    }

    if (method === "POST") {
      const { newBookName, coverImageFile, userName, topicBook, user } = body;
      if (!newBookName.trim() || !coverImageFile) return res.status(400).json({ error: "Invalid data" });

      const storageRef = ref(getStorage(), `covers/${coverImageFile.name}`);
      const imageBuffer = Buffer.from(coverImageFile.data, "base64");
      await uploadBytes(storageRef, imageBuffer);
      const imageUrl = await getDownloadURL(storageRef);

      const newBook = {
        heading: newBookName,
        coverImg: imageUrl,
        text: "Lorem",
        deskripsi: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: "",
        label: "",
        category: "",
        status: "on Proses",
        topic: topicBook,
        pemilik: userName,
        uid: JSON.parse(user).uid,
      };

      const docRef = await addDoc(collection(db, "books"), newBook);
      return res.status(201).json({ id: docRef.id, ...newBook });
    }

    if (method === "DELETE") {
      const { bookId } = body;
      if (!bookId) return res.status(400).json({ error: "Invalid data" });

      await deleteDoc(doc(db, "books", bookId));
      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
