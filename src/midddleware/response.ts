import { QueryParser } from '../utils/lib';

export default async (req: Record<string, any>, res: Record<string, any>) => {
  const queryParser = new QueryParser(Object.assign({}, req.query));
  const obj = req.response;
  const processor = obj.model.getProcessor();
  const response = await processor.getApiClientResponse({
    ...obj,
    queryParser,
  });
  return res.status(obj.code).json(response);
};
