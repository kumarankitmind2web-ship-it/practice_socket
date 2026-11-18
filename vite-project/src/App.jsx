import AuthPage from "./features/auth/AuthPage";
import {ToastContainer} from "react-toastify";
import {Routes, Route} from "react-router-dom";
import PrivateRoutes from "./routes/ProtectedRoute";
import Chat from "./features/chat/chat";
import PublicRoutes from "./routes/PublicRoute";

function App() {
    return (
        <>
            <ToastContainer />
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/" element={<Chat />} />
                </Route>
                <Route element={<PublicRoutes />}>
                    <Route path="/auth" element={<AuthPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
