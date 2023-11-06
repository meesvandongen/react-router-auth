import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { OidcProvider } from "@axa-fr/react-oidc";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <OidcProvider
    configuration={{
      client_id: "interactive.public.short",
      redirect_uri: window.location.origin + "/authentication/callback",
      silent_redirect_uri:
        window.location.origin + "/authentication/silent-callback",
      scope: "openid profile email api offline_access", // offline_access scope allow your client to retrieve the refresh_token
      authority: import.meta.env.VITE_AUTH_URI,
    }}
  >
    <div>axa fr</div>
    <App />
  </OidcProvider>
);
