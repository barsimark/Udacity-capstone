import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deletePost } from '../../businessLogic/postLogic';
import { createLogger } from '../../utils/logger';

const logger = createLogger('http');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let result;
  const postId = event.pathParameters.postId;
  const groupId = event.pathParameters.groupId;
  console.log('postId ', postId);
  console.log('groupId', groupId)

  try {
    result = await deletePost(groupId, postId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        msg: `Post ${result} deleted successfully!`
      })
    }
    
  } catch (e) {
    console.log('Error: ', e);
    logger.error('Failed to delete post', {error: e});
    
    return {
      statusCode: 404,
      body: JSON.stringify({
        msg: 'Failed to delete post.',
        error: e
      })
    }
  }
}
