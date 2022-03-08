import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PostUpdate } from '../models/PostUpdate';
import { PostItem } from '../models/PostItem';

const XAWS = AWSXRay.captureAWS(AWS);

export class PostAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly postsTable = process.env.POSTS_TABLE,
        private readonly postIndex = process.env.POSTS_ID_INDEX
        ) {}

    async createPost(post: PostItem) {
        console.log('Posts table ', this.postsTable);

        const result = await this.docClient.put({
            TableName: this.postsTable,
            Item: post
        }).promise();

        console.log('result ', result);
        return { result, post: post}
    }

    async deletePost(groupId, postId: any) {
        const result = await this.docClient.delete({ TableName: this.postsTable, Key: { postId: postId, groupId: groupId } })
        .promise();
        console.log('result ', result);

        return { postId: postId, result}
    }

    async updatePost(postId, groupId, postUpdate: PostUpdate) {
        const request = {
            TableName: this.postsTable,
            Key: {
                groupId: groupId,
                postId: postId
            },
            ProjectionExpression: '#c',
            ExpressionAttributeNames: {"#c": "name"},
            UpdateExpression: 'set #c=:a',
            ExpressionAttributeValues: {
                ":a": postUpdate.name
            },
            ReturnValues: 'UPDATED_NEW'
        };

        const result = await this.docClient.update(request).promise();
        console.log('result ', result);

        return {post: postUpdate, result};
    }

    async getPosts(groupId) {
        const result = await this.docClient.query({ 
            TableName: this.postsTable,
            IndexName: this.postIndex,
            KeyConditionExpression: 'groupId = :groupId',
            ExpressionAttributeValues: {
                ':groupId': groupId
            }
        }).promise();
        console.log('result ', result);

        return {groupId: groupId, result};
    }

    async updateAttachmentUrl(groupId, postId, attachmentUrl: string) {
        const request = {
            TableName: this.postsTable,
            Key: {
                groupId: groupId,
                postId: postId
            },
            UpdateExpression: 'set attachmentUrl=:a',
            ExpressionAttributeValues: {
                ":a": attachmentUrl
            },
            ReturnValues: 'UPDATED_NEW'
        };

        const result = await this.docClient.update(request).promise();
        console.log('result ', result);
        return result;
    }
} 
