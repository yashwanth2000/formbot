import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import "./App.css";
import Home from "./components/Form/Home/Home";
import PrivateRoute from "./utils/PrivateRoute";
import Settings from "./components/Form/Settings/Settings";
import Flow from "./components/Form/CreateForm/Flow";
import Theme from "./components/Form/CreateForm/Theme";
import Response from "./components/Form/CreateForm/Response";
import ShareForm from "./components/Form/ShareForm/ShareForm";
import FolderView from "./components/Form/Home/FolderView";
import { FormProvider } from "./utils/FormContext";

const App = () => {
  return (
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/folder/:id" element={<FolderView />} />
            <Route path="/flow" element={<Flow />} />
            <Route path="/theme" element={<Theme />} />
            <Route path="/analytics" element={<Response />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/share/:formId" element={<ShareForm />} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  );
};

export default App;
