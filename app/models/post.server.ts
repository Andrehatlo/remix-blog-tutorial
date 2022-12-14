import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";

// GET POST
export async function getPost(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
}

// GET POSTS
export async function getPosts() {
    return prisma.post.findMany();
}

// GET SPECIFIC POST DATA
export async function getPostListings() {
    return prisma.post.findMany({
        select: {
            slug: true,
            title: true,
        }
    });
};

// CREATE POST
export async function createPost(post: Pick<Post, 'slug' | 'title' | 'markdown'>){
    return prisma.post.create({data: post});
}

// UPDATE POST
export async function updatePost(
    slug: string, 
    post: Pick<Post, 'slug' | 'title' | 'markdown'>
    ){
    return prisma.post.update({data: post, where: {slug}});
}

export async function deletePost(slug: string){
    return prisma.post.delete({ where: { slug } }); 
}

// export 

// // DELETE POST
// export async function deletePost(slug: string) {
//     return prisma.post.delete({where: { slug }})
// }
