import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import { updateAttachmentUrl } from '../../businessLogic/postLogic';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger';

const logger = createLogger('http');

const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const bucketName = process.env.ATTACHMENTS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId;
  const groupId = event.pathParameters.groupId
  const url = getUploadUrl(postId);
  const attachmentUrl = `https://${process.env.ATTACHMENTS_S3_BUCKET}.s3.amazonaws.com/${postId}.png`;

  try {
    const result = await updateAttachmentUrl(groupId, postId, attachmentUrl);
    console.log('update attachments url result ', result);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  } catch (e) {
    logger.error('An error occurred updating an attachmentUrl', { error: e });
  }


}

function getUploadUrl(postId: string) {
  logger.info('generating signed upload url...');
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: `${postId}.png`,
    Expires: urlExpiration
  })
}
