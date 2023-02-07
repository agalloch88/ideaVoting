import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { CreateBoardBody } from 'src/types/apiTypes';
import { BoardRecord } from 'src/types/dynamo';
import { v4 as uuid } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body!);
    const tableName = process.env.singleTable;

    const validationError = validateBody(body);

    if (validationError) {
      return validationError;
    }

    const { name, description, isPublic = false } = body as CreateBoardBody;

    const data: BoardRecord = {
      id: uuid(),
      pk: 'board',
      sk: Date.now().toString(),
      ownerId: getUserId(event),
      boardName: name,
      description: description,
      isPublic: isPublic,
      date: Date.now(),
    }

    return formatJSONResponse({ body: { message: 'flight successfully booked' } });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};

const validateBody = (body: Record<string, any>) => {
  if (!body.name) {
    return formatJSONResponse({
      body: { message: 'name is required on body', statusCode: 400 },
    });
  }
  return;
};
function uuid(): string {
  throw new Error('Function not implemented.');
}

