import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { BoardRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.singleTable;
    // get boardId from path parameters
    const boardId = event.pathParameters.boardId;
    // query dynamo for a specific board
    const board = await Dynamo.get<BoardRecord>({
      tableName,
      pkValue: boardId,
    });
    // filter out private boards using the isPublic property
    const responseData = boards.map(({pk, sk, ...rest}) => rest).filter((board) => board.isPublic);

    return formatJSONResponse({ body: responseData });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};
