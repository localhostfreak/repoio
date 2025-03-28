
import { SchemaTypeDefinition } from 'sanity';
import { albumSchema, galleryItemSchema, audioMessageSchema } from './sanity-schemas';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [albumSchema, galleryItemSchema, audioMessageSchema],
};

export default schema;
