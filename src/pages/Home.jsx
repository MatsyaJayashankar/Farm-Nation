import BlogScroll3D from "../components/BlogScroll3D";
import DynamicTitle from "../components/DynamicTitle";
import { blogs } from "../data/data";

export const Home = () => {
  return (
    <>
      <h1></h1>
      <BlogScroll3D blogs={blogs} />
      <DynamicTitle blogs={blogs} />
    </>
  );
};
