import { BarLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      style={{
        margin: "auto",
        width: "100%",
        position: "absolute",
        left: "50%",
        top: "0%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <BarLoader color="yellowgreen" width="100" height="4" />
      <BarLoader color="yellowgreen" width="100" height="4" />
      <BarLoader color="yellowgreen" width="100" height="4" />
    </div>
  );
};

export default Loader;
