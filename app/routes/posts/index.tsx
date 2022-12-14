import type { LoaderFunction } from '@remix-run/node';
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useOptionalAdminUser } from '~/utils';
import { getPostListings} from '~/models/post.server';
import { getEnv } from '~/env.server';

type LoaderData = {
    posts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader: LoaderFunction = async () => {
    const posts  = await getPostListings();
    return json<LoaderData>({ posts }); 
}

export default function PostsRoute(){
    const { posts } = useLoaderData() as LoaderData;
    const adminUser = useOptionalAdminUser();
    
    return(
        <main>
            <h1>Posts</h1>
            {adminUser? (
            <Link to="admin" className="text-blue-600 underline">
                Admin
            </Link> ) : null }
            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link
                            to={post.slug}
                            prefetch="intent"
                            className="underline text-rose-400"
                            >
                                {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}