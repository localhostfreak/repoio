import { defineField, defineType } from "sanity";

export type BackgroundEffect = 'hearts' | 'petals' | 'stars' | 'none';

export interface Landing {
  _type: 'landing';
  title: string;
  message: string;
  backgroundEffect: BackgroundEffect;
}

export const landingSchema = defineType({
    name: 'landing',
    title: 'Landing Page',
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'string'
      }),
      defineField({
        name: 'message',
        title: 'Message',
        type: 'text'
      }),
      defineField({
        name: 'backgroundEffect',
        title: 'Background Effect',
        type: 'string',
        options: {
          list: [
            { title: 'Hearts', value: 'hearts' },
            { title: 'Petals', value: 'petals' },
            { title: 'Stars', value: 'stars' },
            { title: 'None', value: 'none' }
          ]
        }
      })
    ]
  })
