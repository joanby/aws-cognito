import { Authenticator } from "@aws-amplify/ui-react";
import "./App.css";
import { useContext } from "react";
import { AdminPage } from "./components/AdminPage";
import { AuthContext } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { UserPage } from "./components/UserPage";
import { Home } from "./components/Home";
import { RequireAuth } from "./RequireAuth";
import { AppTemplate } from "./components/AppTemplate";
import { FourOFour } from "./components/FourOFour";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CookieStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { useNavigate, useLocation } from "react-router";

import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

// Configuramos Amplify
Amplify.configure(awsExports);

// Configurar opciones adicionales de las cookies
const cookieOptions = {
  // Dominio de la cookie
  domain: 'localhost', 

  // 30 dias expiración cookies
  expires: 30,

  // Utilizar HTTPS (true/false) 
  secure: true,

  // Este si puede ser lax/strict/none   
  sameSite: 'lax',
};


// Configuración por defecto de cookies (secure=true y no sameSate)
// cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

// Configuración personalizada de cookies
// cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage(cookieOptions));

// Si no configuramos cookies los tokens se guardan en el localStorage

const UserRoute = ({ children, ...rest }) => {
  const { isAuth } = useContext(AuthContext);

  // Guardamos ruta
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";

  
  return isAuth ? (
    <>
      <AppTemplate {...rest}>{children}</AppTemplate>
    </>
    ) : (
      <Navigate to="/login" state={{ from: location }} replace/>
    );
};



const AdminRoute = ({ children, ...rest }) => {
  const { isAuth } = useContext(AuthContext);

  // Guardamos ruta
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";


  return isAuth ? (
    <>
      <AppTemplate {...rest}>{children}</AppTemplate>
    </>
    ) : (
      <Navigate to="/login" state={{ from: location }} replace/>
    );
};



const MyRoutes = () => {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <>
      <Routes>
          {/* Authenticated Routes */}

          <Route exact path="/" element={<Layout/>}>
          <Route
            path="/admin"
            element={
              // <RequireAuth>
              <AdminRoute>
                <AdminPage/>
              </AdminRoute>
              // </RequireAuth>
            }
          />

          <Route
            path="/user"
            element={
              // <RequireAuth>
                <UserRoute>
                  <UserPage/>
                </UserRoute> 
              // </RequireAuth>
            }
          />

          {/* Unauthenticated Routes */}

          <Route path="/login" element={<Login />} />

          <Route 
            path="/home"
            element={<Home/>}
          />

          <Route 
            path="*"
            element={<FourOFour/>}
          />
          </Route>
        </Routes>
    </>
  );
}

const App = () => { 
  return (
    <Router>
        <Authenticator.Provider>
          <AuthProvider>
            <MyRoutes />
          </AuthProvider>
        </Authenticator.Provider>
    </Router>
  );
}

export default App;
