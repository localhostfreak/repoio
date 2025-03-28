
import { SchemaTypeDefinition } from 'sanity';
import { album } from './schemas/gallery';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [album],
};

export default schema;
