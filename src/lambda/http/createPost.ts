import 'source-map-support/register';
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreatePostRequest } from '../../requests/CreatePostRequest';
import { createPost } from '../../businessLogic/postLogic';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let attachmentUrl: string;
  const newPost: CreatePostRequest = JSON.parse(event.body);
  const groupId = event.pathParameters.groupId

  console.log('groupId ', groupId)

  if (JSON.parse(event.body).attachmentUrl) {
    attachmentUrl = JSON.parse(event.body).attachmentUrl;
  }

  try {
    const createdPost = await createPost(newPost, groupId, attachmentUrl);
    console.log('createdPost ', createdPost);
  
    const item = createdPost;
    delete item.groupId;
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item
      })
    }
  } catch (e) {
    logger.error('Error creating post: ', { error: e });

    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: `Error creating post: ${e}`
      })
    }
  }
}
