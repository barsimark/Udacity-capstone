import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdatePostRequest } from '../../requests/UpdatePostRequest';
import { updatePost } from '../../businessLogic/postLogic';
import { createLogger } from '../../utils/logger';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId;
  const groupId = event.pathParameters.groupId
  const updatedPost: UpdatePostRequest = JSON.parse(event.body)

  try {
    const result = await updatePost(postId, groupId, updatedPost);
    console.log('result ', result);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        updatedPost: updatedPost
      })
    }
  } catch (e) {
    logger.error('Failed to update post', { error: e });

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: e
      })
    }
  }
}
