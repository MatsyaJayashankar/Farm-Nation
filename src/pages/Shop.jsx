import { useEffect, useState } from "react";
import { Products } from "../components/Products";
import { Search } from "../components/Search";
import { Filter } from "../components/filter";
//import { addDataToCollection } from "../redux/products.slice";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import Loader from "../components/Loader";

export const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  //lets add data to firebase using addDatatocollection
  //filteredProducts will be used to store the products that are fetched from firebase
  useEffect(() => {
    //addDataToCollection();
    const fetchProducts = async () => {
      setLoading(true);
       const docSnap = await getDocs(collection(db,'farm-products'));
       const data = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       setFilteredProducts(data);
       console.log(data);
    }
    fetchProducts();
    setLoading(false);
  }, []);

  if(loading) {
    return <Loader/>
  }
  return (
    <>
      <h1>SHOP</h1>

      <Search
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
      />
      <Filter setFilteredProducts={setFilteredProducts} />

      <Products products={filteredProducts} />
    </>
  );
};
