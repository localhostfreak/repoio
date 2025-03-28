import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'loveLetter',
  title: 'Love Letter',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'object',
      fields: [
        { name: 'primaryColor', type: 'string', title: 'Primary Color' },
        { name: 'fontFamily', type: 'string', title: 'Font Family' },
        { name: 'animation', type: 'string', title: 'Animation' }
      ]
    }),
    defineField({
      name: 'effects',
      title: 'Effects',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'isPrivate',
      title: 'Private Letter',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'animations',
      title: 'Animations',
      type: 'object',
      fields: [
        {
          name: 'openingEffect',
          type: 'string',
          options: {
            list: ['fold', 'fade', 'butterfly', 'hearts']
          }
        },
        {
          name: 'backgroundEffect',
          type: 'string',
          options: {
            list: ['particles', 'petals', 'stars', 'none']
          }
        }
      ]
    })
  ]
});
