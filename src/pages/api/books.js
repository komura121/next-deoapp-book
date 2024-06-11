import {db} from "@/services/api/firebase"
import {collection, getDocs, addDoc, doc, getDoc, where, query} from "firebase/firestore"
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'

export const config = {
    api: {

        bodyParser: true,
    },
}

const handler = async (req,res) => {
    const{method, query: {uid}, body} = req;

    try{
        switch(method) {
            case 'GET' :
                return await handleGetBooks(req,res, uid);
            case 'POST':
                return await handleAddBook(req,res,body);
            default :
            res.setHeader('Allow', ['GET','POST']);
            return res.status(405).end(`method lu salah pilih`);
            
        }

    }catch (error) {
        console.error('error bang :', error);
        return res.status(500).json({error: "yang kenak servernya bang"});
    }
};

const handleAddbook = async (req, res, body) => {
    const {newBookName, coverImageFile, userName, user} = body;

    if (!newBookname?. trim() || !coverImageFile || !userName || !user?.uid) {
        return res.status(400).json({error: 'data gajelas bang'});
    }
    const storage = getStorage();
    const storageRef = ref(storage, `covers/${coverImageFile.name}`);
    await uploadBytes(storageRef, buffer.from (coverImageFile.data, base64));
    const imageUrl = await getDownloadURL(storageRef)

    const newBook = {
        bookTitle: newBookName,
        coverImg: imageUrl,
        text: "Lorem",
        description: "",
        price: "Rp.",
        label:"",
        category:'',
        status: 'on Proses',
        author: userName,
        uid: user.uid,
    }

    const docRef = await addDoc(collection(db, 'books'), newBook);
    return res.status(201).json({id:docRef.id, ...newBook});
};

export default handler;
