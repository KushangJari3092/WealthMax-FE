/* eslint-disable no-unused-vars */
import "./styles/global.css";
import Layout from "./components/common/Layout";
import Routes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

function App() {
  // const dispatch = useDispatch();

  

  return (
    <>
      <BrowserRouter>
        {/* <Layout> */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes />
        {/* </Layout> */}
      </BrowserRouter>
    </>
  );
}

export default App;
