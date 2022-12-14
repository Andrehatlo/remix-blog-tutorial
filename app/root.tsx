import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import styles from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { getEnv } from "./env.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>,
  ENV: ReturnType<typeof getEnv>,
}

export async function loader({ request }: LoaderArgs) {
  console.log(ENV)
  return json({
    user: await getUser(request),
    ENV: getEnv(),
  });
}

export default function App() {
  const data = useLoaderData();
  console.log(ENV);
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML = {{__html: `window.ENV = ${JSON.stringify(data.ENV)}`}}/>
        <LiveReload />
      </body>
    </html>
  );
}
