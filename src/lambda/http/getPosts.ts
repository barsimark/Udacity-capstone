import 'source-map-support/register'
import { getAllPosts } from '../../businessLogic/postLogic';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';

const logger = createLogger('http');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const groupId = event.pathParameters.groupId
  console.log('groupId ', groupId);

  try {
    const result = await getAllPosts(groupId);
    console.log('get all posts results ', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ items: result.Items })
    }
  } catch (err) {
    logger.error('Failed to get posts ', { error: err });

    return {
      statusCode: 404,
      body: JSON.stringify({
        msg: 'Failed to get posts.',
        error: err
      })
    }
  }
}
