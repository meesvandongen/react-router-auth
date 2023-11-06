import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
  Navigate,
  useLoaderData,
} from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { getSomething } from "./api";
import { useMemo } from "react";
import { ofetch } from "ofetch";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <AuthenticatedRouter /> : <UnauthenticatedRouter />;
}

function About() {
  const data = useLoaderData();
  const { signoutRedirect, user } = useAuth();

  return (
    <div>
      <button
        onClick={() => {
          signoutRedirect();
        }}
      >
        logout
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

function AuthenticatedRouter() {
  const { user } = useAuth();

  const fetchInstance = useMemo(() => {
    if (!user) {
      throw new Error("User is not authenticated");
    }
    return ofetch.create({
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    });
  }, [user]);

  const authenticatedRoutes: RouteObject[] = [
    {
      path: "/about",
      element: <About />,
      loader: () => getSomething(fetchInstance),
    },
    {
      path: "*",
      element: <Navigate to="/about" />,
    },
  ];

  const router = createBrowserRouter(authenticatedRoutes);

  return <RouterProvider router={router}></RouterProvider>;
}

function UnauthenticatedRouter() {
  const { signinRedirect } = useAuth();

  const unauthenticatedRoutes: RouteObject[] = [
    {
      path: "/",
      element: (
        <button
          onClick={() => {
            signinRedirect();
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
  ];

  const router = createBrowserRouter(unauthenticatedRoutes);

  return <RouterProvider router={router}></RouterProvider>;
}
