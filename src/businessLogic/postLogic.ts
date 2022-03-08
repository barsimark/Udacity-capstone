import * as uuid from 'uuid'
import { PostAccess } from "../dataLayer/postAccess";
import { PostItem } from "../models/PostItem";
import { CreatePostRequest } from "../requests/CreatePostRequest";
import { UpdatePostRequest } from '../requests/UpdatePostRequest';

const postAccess = new PostAccess();

export async function getAllPosts(groupId) {
    return await (await postAccess.getPosts(groupId)).result;
}


export async function createPost(createPostRequest: CreatePostRequest, groupId: string, attachmentUrl?): Promise<PostItem> {
    const itemId = uuid.v4();

    const request: PostItem = {
        groupId: groupId,
        postId: itemId,
        name: createPostRequest.name,
    };

    if (attachmentUrl) {
        request.attachmentUrl = attachmentUrl;
    }

    const result = await postAccess.createPost(request);
    return result.post;
}

export async function deletePost(groupId, postId: string) {
    const result = await postAccess.deletePost(groupId, postId);
    return (await result).postId;
}

export async function updatePost(postId, groupId, postUpdate: UpdatePostRequest) {
    const result = await postAccess.updatePost(postId, groupId, postUpdate);
    return result.post;
}

export async function updateAttachmentUrl(groupId, postId, attachmentUrl) {
    return await postAccess.updateAttachmentUrl(groupId, postId, attachmentUrl);
}