import { QueryParser } from '../utils/lib';
import { Request, Response } from 'express';
import { T } from '../version1/rest/types';

export default async (req: Request, res: Response) => {
  const queryParser = new QueryParser(Object.assign({}, req.query));
  const obj= req.response;
  const processor = obj.model.getProcessor(obj.model);
  const response = await processor.getApiResponse({
    ...obj,
    queryParser,
  });
  return res.status(obj.code).json(response);
};
