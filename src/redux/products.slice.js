import { collection, getDocs, query, where, writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase-config";
//import products from "../data/data";

const addDataToCollection = async () => {
    const batch = writeBatch(db);
    products.forEach(product => {
        const docRef = doc(db, 'farm-products', product.id.toString());
        batch.set(docRef, product);
    });
    const res = await batch.commit();
}

const getProductsUsingProductIds = async (cart) => {
    const productIds = Object.keys(cart).map(Number);
    const productsSnapshot = await getDocs(
        query(
            collection(db, 'farm-products'),
            where('id', 'in', productIds)
        )
    );
    const productsData = productsSnapshot.docs.map(doc => ({
        ...doc.data(),
        date: cart?.date,
        quantity: cart[doc.data().id],
    }));
    return productsData;
}

// Fetch users cart products from firestore
const getUserCartProducts = async (uid) => {
    const docRef = doc(db, "farm-carts", uid);
    const docSnap = await getDoc(docRef);
    return { docRef, data: docSnap.data() };
};

// Simple function to format date
const convertDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
};

export {
    addDataToCollection,
    getProductsUsingProductIds,
    getUserCartProducts,
    convertDate,
};