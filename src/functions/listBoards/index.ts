import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { CreateBoardBody } from 'src/types/apiTypes';
import { BoardRecord } from 'src/types/dynamo';
import { v4 as uuid } from 'uuid';
import { getUserId } from '../../libs/APIGateway';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.singleTable;
    // query dynamo for all boards
    const boards = await Dynamo.query<BoardRecord>({
      tableName,
      index: 'index1',
      pkKey: 'pk',
      pkValue: 'board',
      limit: 10,
    });
    // filter out private boards using the isPublic property
    const responseData = boards.map(({pk, sk, ...rest}) => rest).filter((board) => board.isPublic);

    return formatJSONResponse({ body: { message: 'board created', id: data.id } });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};
