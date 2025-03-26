import { landingSchema, audioType, birthdayCardSchema, loveLetterSchema } from '../../attached_assets/land';
import { albumSchema, galleryItemSchema, audioMessageSchema } from '../../shared/sanity-schemas.js';

// Export all schema types for easy import in other files
export const schemas = {
  landing: landingSchema,
  audio: audioType,
  birthdayCard: birthdayCardSchema,
  loveLetter: loveLetterSchema,
  album: albumSchema,
  galleryItem: galleryItemSchema,
  audioMessage: audioMessageSchema
};

// Type-safe helpers for working with schemas
export function getSchemaName(schema: any): string {
  return schema.name;
}

export function getSchemaFields(schema: any): any[] {
  return schema.fields || [];
}

export function isDocumentSchema(schema: any): boolean {
  return schema.type === 'document';
}

export function isObjectSchema(schema: any): boolean {
  return schema.type === 'object';
}