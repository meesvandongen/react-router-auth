import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
  Navigate,
  useLoaderData,
} from "react-router-dom";
import { getSomething } from "./api";
import { useMemo } from "react";
import { ofetch } from "ofetch";
import { useOidc, useOidcUser, useOidcAccessToken } from "@axa-fr/react-oidc";
import { OidcClient } from "@axa-fr/oidc-client";

export default function App() {
  const { isAuthenticated } = useOidc();

  return isAuthenticated ? <AuthenticatedRouter /> : <UnauthenticatedRouter />;
}

function About() {
  const data = useLoaderData();
  const { logout } = useOidc();
  const { oidcUser } = useOidcUser();
  const { accessTokenPayload } = useOidcAccessToken();

  return (
    <div>
      <button
        onClick={() => {
          logout();
        }}
      >
        logout
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(oidcUser, null, 2)}</pre>
      <pre>{JSON.stringify(accessTokenPayload, null, 2)}</pre>
    </div>
  );
}

function AuthenticatedRouter() {
  const fetchInstance = useMemo(() => {
    return ofetch.create({
      onRequest: async ({ options }) => {
        const client = OidcClient.get();
        const token = (await client.getValidTokenAsync()).tokens.accessToken;
        if (token) {
          options.headers = new Headers(options.headers);
          options.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    });
  }, []);

  const authenticatedRoutes: RouteObject[] = useMemo(
    () => [
      {
        path: "/about",
        element: <About />,
        loader: () => getSomething(fetchInstance),
      },
      {
        path: "*",
        element: <Navigate to="/about" />,
      },
    ],
    [fetchInstance]
  );

  const router = createBrowserRouter(authenticatedRoutes);

  return <RouterProvider router={router}></RouterProvider>;
}

function UnauthenticatedRouter() {
  const { login } = useOidc();

  const unauthenticatedRoutes: RouteObject[] = useMemo(
    () => [
      {
        path: "/",
        element: (
          <button
            onClick={() => {
              login();
            }}
          >
            login
          </button>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
    [login]
  );

  const router = createBrowserRouter(unauthenticatedRoutes);

  return <RouterProvider router={router}></RouterProvider>;
}
