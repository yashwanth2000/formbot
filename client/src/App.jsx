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
import EditForm from "./components/Form/EditForm/EditForm.jsx";
import { FormProvider } from "./utils/FormContext";
import EditTheme from "./components/Form/EditForm/EditTheme.jsx";
import EditResponse from "./components/Form/EditForm/EditResponse.jsx";

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
            <Route path="/edit/:id" element={<EditForm />} />
            <Route path="/editTheme/:id" element={<EditTheme />} />
            <Route path="/editAnalytics/:id" element={<EditResponse />} />
          </Route>
          <Route path="/share/:formId" element={<ShareForm />} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  );
};

export default App;
