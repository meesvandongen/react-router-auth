import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "react-oidc-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider
      authority={import.meta.env.VITE_AUTH_URI}
      automaticSilentRenew={true}
      client_id="cmf-portal"
      post_logout_redirect_uri={`${document.location.origin}/`}
      redirect_uri={window.location.origin}
      response_type="code"
      scope="openid profile"
      onSigninCallback={() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }}
      onRemoveUser={() => {
        alert("User removed");
      }}
    >
      <div>react-oidc-context</div>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
