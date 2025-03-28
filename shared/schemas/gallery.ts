// Import required dependencies from Sanity
import { defineType, defineField, defineArrayMember } from 'sanity';

// Document schemas
export const color = defineType({
    name: 'color',
    title: 'Color',
    type: 'color', // Provided by the plugin
    options: {
      disableAlpha: true, // Optional: Disable alpha channel if not needed
    },
  });


export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'A short caption for the photo'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A longer description of the photo, its context, or story'
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: [
          'blurhash',
          'lqip',
          'palette',
          'exif',
          'location'
        ]
      },
      description: 'Upload or select an image',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'When was this photo taken?'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint',
      description: 'Where was this photo taken?'
    }),
    defineField({
      name: 'locationName',
      title: 'Location Name',
      type: 'string',
      description: 'The name of the location (e.g. "Eiffel Tower, Paris")'
    }),
    defineField({
      name: 'camera',
      title: 'Camera',
      type: 'string',
      description: 'What camera was used to take this photo?'
    }),
    defineField({
      name: 'isFavorite',
      title: 'Favorite',
      type: 'boolean',
      description: 'Mark this photo as a favorite',
      initialValue: false
    }),
    defineField({
      name: 'isPrivate',
      title: 'Private',
      type: 'boolean',
      description: 'Mark this photo as private (only visible to you)',
      initialValue: false
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'tag' }]
        })
      ],
      description: 'Tags to categorize this photo'
    }),
    defineField({
      name: 'people',
      title: 'People',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'person' }]
        })
      ],
      description: 'People tagged in this photo'
    }),
    defineField({
      name: 'exif',
      title: 'EXIF Data',
      type: 'exif',
      description: 'Technical details extracted from the image'
    }),
    defineField({
      name: 'palette',
      title: 'Color Palette',
      type: 'colorPalette',
      description: 'Main colors extracted from the image'
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'dimension',
      description: 'Width and height of the image'
    }),
    defineField({
      name: 'voiceNote',
      title: 'Voice Note',
      type: 'voiceNote',
      description: 'Attach a voice note to this photo'
    }),
    defineField({
      name: 'uploadedBy',
      title: 'Uploaded By',
      type: 'reference',
      to: [{ type: 'profile' }],
      description: 'Who uploaded this photo'
    }),
    defineField({
      name: 'aiMetadata',
      title: 'AI Metadata',
      type: 'aiMetadata',
      description: 'AI-generated metadata for this photo'
    }),
    defineField({
      name: 'editHistory',
      title: 'Edit History',
      type: 'array',
      of: [defineArrayMember({ type: 'editHistory' })],
      description: 'History of edits made to this photo'
    }),
    defineField({
      name: 'shareSettings',
      title: 'Share Settings',
      type: 'shareSettings',
      description: 'Settings for sharing this photo'
    })
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'locationName',
      media: 'image'
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || 'Untitled Photo',
        subtitle: subtitle || '',
        media
      };
    }
  },
  orderings: [
    {
      title: 'Date Taken',
      name: 'dateTaken',
      by: [{ field: 'date', direction: 'desc' }]
    },
    {
      title: 'Upload Date',
      name: 'uploadDate',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: 'Caption',
      name: 'caption',
      by: [{ field: 'caption', direction: 'asc' }]
    }
  ]
});

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'photo' }]
        })
      ]
    }),
    defineField({
      name: 'isPrivate',
      title: 'Private',
      type: 'boolean',
      description: 'Make this collection private',
      initialValue: false
    }),
    defineField({
      name: 'dateRange',
      title: 'Date Range',
      type: 'object',
      fields: [
        defineField({
          name: 'start',
          title: 'Start Date',
          type: 'date'
        }),
        defineField({
          name: 'end',
          title: 'End Date',
          type: 'date'
        })
      ]
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }]
    }),
    defineField({
      name: 'createdBy',
      title: 'Created By',
      type: 'reference',
      to: [{ type: 'profile' }]
    }),
    defineField({
      name: 'shareSettings',
      title: 'Share Settings',
      type: 'shareSettings'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'coverImage'
    }
  }
});

export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'color'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name (e.g., "heart", "beach", "food")'
    }),
    defineField({
      name: 'count',
      title: 'Count',
      type: 'number',
      description: 'Number of photos with this tag',
      readOnly: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'count'
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle} photos` : '0 photos'
      };
    }
  }
});

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string'
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: ({ document }) => {
          return {
            filter: '_id != $id',
            params: {
              id: document._id.replace(/^drafts\./, '')
            }
          };
        }
      }
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'parent.name'
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Child of: ${subtitle}` : 'Top-level category'
      };
    }
  }
});

export const album = defineType({
  name: 'album',
  title: 'Album',
  type: 'document',
  description: 'An album is a curated collection of photos with a narrative structure',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'items',
      title: 'Album Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'photo',
              title: 'Photo',
              type: 'reference',
              to: [{ type: 'photo' }]
            }),
            defineField({
              name: 'caption',
              title: 'Custom Caption',
              type: 'string',
              description: 'Override the photo caption for this album'
            }),
            defineField({
              name: 'description',
              title: 'Custom Description',
              type: 'text'
            }),
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string'
            })
          ]
        })
      ]
    }),
    // Add missing fields
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        { 
          type: 'string',
          options: {
            list: [
              { title: 'Vacation', value: 'vacation' },
              { title: 'Date Night', value: 'dateNight' },
              { title: 'Anniversary', value: 'anniversary' },
              { title: 'First Meeting', value: 'firstMeeting' },
              { title: 'Holidays', value: 'holidays' },
              { title: 'Special Moments', value: 'specialMoments' }
            ]
          }
        }
      ]
    }),
    defineField({
      name: 'effects',
      title: 'Visual Effects',
      type: 'array',
      of: [
        { 
          type: 'string',
          options: {
            list: [
              { title: 'Heart Frame', value: 'heartFrame' },
              { title: 'Soft Glow', value: 'softGlow' },
              { title: 'Vintage Filter', value: 'vintageFilter' },
              { title: 'Polaroid Style', value: 'polaroid' },
              { title: 'Floating Hearts', value: 'floatingHearts' }
            ]
          }
        }
      ]
    }),
    defineField({
      name: 'isPrivate',
      title: 'Private',
      type: 'boolean',
      description: 'Restrict this album to specific viewers listed in "Shared With".',
      initialValue: false,
    }),
    defineField({
      name: 'sharedWith',
      title: 'Shared With',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Email addresses or user IDs who can view this album if private (max 50 unique entries).',
      options: {
        layout: 'tags',
      },
      validation: (Rule) =>
        Rule.unique()
          .max(50)
          .custom((items) =>
            items && items.every((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item))
              ? true
              : 'All entries must be valid email addresses',
          ),
    }),
    defineField({
      name: 'theme',
      title: 'Album Theme',
      type: 'object',
      fields: [
        { 
          name: 'color',
          title: 'Theme Color',
          type: 'string',
          options: {
            list: [
              { title: 'Romantic Red', value: '#FF6B6B' },
              { title: 'Passionate Pink', value: '#FF85A2' },
              { title: 'Dreamy Lavender', value: '#C5A3FF' },
              { title: 'Ocean Blue', value: '#45B3E0' },
              { title: 'Forest Green', value: '#4CAF50' },
              { title: 'Sunset Orange', value: '#FF9966' }
            ]
          }
        },
        { name: 'font', title: 'Font Family', type: 'string' },
        { name: 'layout', title: 'Layout Style', type: 'string' }
      ]
    }),
    defineField({
      name: 'dateRange',
      title: 'Date Range',
      type: 'object',
      fields: [
        { name: 'from', type: 'date', title: 'From' },
        { name: 'to', type: 'date', title: 'To' }
      ]
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      itemsCount: 'items.length',
    },
    prepare({ title, media, itemsCount }: { title?: string; media?: any; itemsCount?: number }) {
      const count = itemsCount ?? 0;
      return {
        title: title || 'Untitled Album',
        media,
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
      };
    },
  },
});

export const profile = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: rule => rule.email()
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text'
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Admin', value: 'admin' },
          { title: 'Editor', value: 'editor' },
          { title: 'Contributor', value: 'contributor' },
          { title: 'Viewer', value: 'viewer' }
        ]
      },
      initialValue: 'contributor'
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Website', value: 'website' }
                ]
              }
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: rule => rule.uri()
            })
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url'
            }
          }
        })
      ]
    }),
    defineField({
      name: 'preferences',
      title: 'Preferences',
      type: 'object',
      fields: [
        defineField({
          name: 'theme',
          title: 'Theme',
          type: 'string',
          options: {
            list: [
              { title: 'Light', value: 'light' },
              { title: 'Dark', value: 'dark' },
              { title: 'System', value: 'system' }
            ]
          },
          initialValue: 'system'
        }),
        defineField({
          name: 'emailNotifications',
          title: 'Email Notifications',
          type: 'boolean',
          initialValue: true
        }),
        defineField({
          name: 'defaultPrivacy',
          title: 'Default Privacy',
          type: 'string',
          options: {
            list: [
              { title: 'Public', value: 'public' },
              { title: 'Private', value: 'private' }
            ]
          },
          initialValue: 'private'
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar'
    }
  }
});

export const search = defineType({
  name: 'search',
  title: 'Search',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Search Term',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Recent', value: 'recent' },
          { title: 'Saved', value: 'saved' }
        ]
      },
      initialValue: 'recent'
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'profile' }]
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: rule => rule.required()
    }),
    defineField({
      name: 'filters',
      title: 'Filters',
      type: 'object',
      fields: [
        defineField({
          name: 'tags',
          title: 'Tags',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'reference', 
              to: [{ type: 'tag' }]
            })
          ]
        }),
        defineField({
          name: 'dateFrom',
          title: 'Date From',
          type: 'date'
        }),
        defineField({
          name: 'dateTo',
          title: 'Date To',
          type: 'date'
        }),
        defineField({
          name: 'favorites',
          title: 'Favorites Only',
          type: 'boolean',
          initialValue: false
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'term',
      subtitle: 'type',
      date: 'timestamp'
    },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle} - ${new Date(date).toLocaleDateString()}`
      };
    }
  }
});

export const log = defineType({
  name: 'log',
  title: 'Log',
  type: 'document',
  fields: [
    defineField({
      name: 'logType',
      title: 'Log Type',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Error', value: 'error' }
        ]
      }
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'text'
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: rule => rule.required()
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'profile' }]
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Which part of the application generated this log'
    })
  ],
  preview: {
    select: {
      title: 'message',
      subtitle: 'logType',
      date: 'timestamp'
    },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle?.toUpperCase()} - ${new Date(date).toLocaleString()}`
      };
    }
  }
});

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'relationship',
      title: 'Relationship',
      type: 'string',
      options: {
        list: [
          { title: 'Family', value: 'family' },
          { title: 'Friend', value: 'friend' },
          { title: 'Colleague', value: 'colleague' },
          { title: 'Acquaintance', value: 'acquaintance' },
          { title: 'Other', value: 'other' }
        ]
      }
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'relationship',
      media: 'image'
    }
  }
});

// Object type schemas
export const exif = defineType({
  name: 'exif',
  title: 'EXIF Data',
  type: 'object',
  fields: [
    defineField({
      name: 'make',
      title: 'Camera Make',
      type: 'string'
    }),
    defineField({
      name: 'model',
      title: 'Camera Model',
      type: 'string'
    }),
    defineField({
      name: 'focalLength',
      title: 'Focal Length',
      type: 'number'
    }),
    defineField({
      name: 'aperture',
      title: 'Aperture',
      type: 'string'
    }),
    defineField({
      name: 'shutterSpeed',
      title: 'Shutter Speed',
      type: 'string'
    }),
    defineField({
      name: 'iso',
      title: 'ISO',
      type: 'number'
    }),
    defineField({
      name: 'exposureCompensation',
      title: 'Exposure Compensation',
      type: 'string'
    }),
    defineField({
      name: 'flash',
      title: 'Flash',
      type: 'boolean'
    }),
    defineField({
      name: 'lensModel',
      title: 'Lens Model',
      type: 'string'
    }),
    defineField({
      name: 'exposureMode',
      title: 'Exposure Mode',
      type: 'string'
    })
  ]
});

export const gps = defineType({
  name: 'gps',
  title: 'GPS Data',
  type: 'object',
  fields: [
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number'
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number'
    }),
    defineField({
      name: 'altitude',
      title: 'Altitude',
      type: 'number'
    })
  ]
});

export const colorPalette = defineType({
  name: 'colorPalette',
  title: 'Color Palette',
  type: 'object',
  fields: [
    defineField({
      name: 'dominant',
      title: 'Dominant Color',
      type: 'color'
    }),
    defineField({
      name: 'vibrant',
      title: 'Vibrant Color',
      type: 'color'
    }),
    defineField({
      name: 'muted',
      title: 'Muted Color',
      type: 'color'
    }),
    defineField({
      name: 'darkVibrant',
      title: 'Dark Vibrant Color',
      type: 'color'
    }),
    defineField({
      name: 'lightVibrant',
      title: 'Light Vibrant Color',
      type: 'color'
    }),
    defineField({
      name: 'darkMuted',
      title: 'Dark Muted Color',
      type: 'color'
    }),
    defineField({
      name: 'lightMuted',
      title: 'Light Muted Color',
      type: 'color'
    })
  ]
});

export const dimension = defineType({
  name: 'dimension',
  title: 'Dimensions',
  type: 'object',
  fields: [
    defineField({
      name: 'width',
      title: 'Width',
      type: 'number'
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'number'
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'number'
    })
  ]
});

export const voiceNote = defineType({
  name: 'voiceNote',
  title: 'Voice Note',
  type: 'object',
  fields: [
    defineField({
      name: 'audio',
      title: 'Audio File',
      type: 'file',
      options: {
        accept: 'audio/*'
      }
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number'
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'text',
      description: 'Text transcript of the voice note'
    }),
    defineField({
      name: 'recordedAt',
      title: 'Recorded At',
      type: 'datetime'
    })
  ]
});

export const editHistory = defineType({
  name: 'editHistory',
  title: 'Edit History',
  type: 'object',
  fields: [
    defineField({
      name: 'editedBy',
      title: 'Edited By',
      type: 'reference',
      to: [{ type: 'profile' }]
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'changes',
      title: 'Changes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'field',
              title: 'Field',
              type: 'string'
            }),
            defineField({
              name: 'oldValue',
              title: 'Old Value',
              type: 'string'
            }),
            defineField({
              name: 'newValue',
              title: 'New Value',
              type: 'string'
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Brief description of the edit'
    })
  ],
  preview: {
    select: {
      title: 'description',
      subtitle: 'timestamp'
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Edit',
        subtitle: subtitle ? new Date(subtitle).toLocaleString() : ''
      };
    }
  }
});

export const collageLayout = defineType({
  name: 'collageLayout',
  title: 'Collage Layout',
  type: 'object',
  fields: [
    defineField({
      name: 'template',
      title: 'Template',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Mosaic', value: 'mosaic' },
          { title: 'Scattered', value: 'scattered' },
          { title: 'Timeline', value: 'timeline' },
          { title: 'Custom', value: 'custom' }
        ]
      }
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'photo',
              title: 'Photo',
              type: 'reference',
              to: [{ type: 'photo' }]
            }),
            defineField({
              name: 'position',
              title: 'Position',
              type: 'object',
              fields: [
                defineField({ name: 'x', title: 'X Position', type: 'number' }),
                defineField({ name: 'y', title: 'Y Position', type: 'number' }),
                defineField({ name: 'width', title: 'Width', type: 'number' }),
                defineField({ name: 'height', title: 'Height', type: 'number' }),
                defineField({ name: 'rotation', title: 'Rotation', type: 'number' })
              ]
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'color'
    }),
    defineField({
      name: 'spacing',
      title: 'Spacing',
      type: 'number'
    })
  ]
});

export const shareSettings = defineType({
  name: 'shareSettings',
  title: 'Share Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'isPublic',
      title: 'Public',
      type: 'boolean',
      description: 'Is this content publicly accessible?',
      initialValue: false
    }),
    defineField({
      name: 'shareLink',
      title: 'Share Link',
      type: 'slug',
      description: 'Custom link for sharing'
    }),
    defineField({
      name: 'passwordProtected',
      title: 'Password Protected',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: ({ parent }) => !parent?.passwordProtected
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'When this share link expires (leave empty for no expiration)'
    }),
    defineField({
      name: 'allowDownload',
      title: 'Allow Download',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'sharedWith',
      title: 'Shared With',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          validation: rule => rule.email()
        })
      ],
      description: 'Email addresses of specific people who can access this content'
    })
  ]
});

export const aiMetadata = defineType({
  name: 'aiMetadata',
  title: 'AI Metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'description',
      title: 'AI Description',
      type: 'text',
      description: 'AI-generated description of the image'
    }),
    defineField({
      name: 'suggestedTags',
      title: 'Suggested Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'AI-suggested tags for the image'
    }),
    defineField({
      name: 'detectedObjects',
      title: 'Detected Objects',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string'
            }),
            defineField({
              name: 'confidence',
              title: 'Confidence',
              type: 'number'
            }),
            defineField({
              name: 'boundingBox',
              title: 'Bounding Box',
              type: 'object',
              fields: [
                defineField({ name: 'x', title: 'X', type: 'number' }),
                defineField({ name: 'y', title: 'Y', type: 'number' }),
                defineField({ name: 'width', title: 'Width', type: 'number' }),
                defineField({ name: 'height', title: 'Height', type: 'number' })
              ]
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'detectedFaces',
      title: 'Detected Faces',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'person',
              title: 'Person',
              type: 'reference',
              to: [{ type: 'person' }]
            }),
            defineField({
              name: 'confidence',
              title: 'Confidence',
              type: 'number'
            }),
            defineField({
              name: 'boundingBox',
              title: 'Bounding Box',
              type: 'object',
              fields: [
                defineField({ name: 'x', title: 'X', type: 'number' }),
                defineField({ name: 'y', title: 'Y', type: 'number' }),
                defineField({ name: 'width', title: 'Width', type: 'number' }),
                defineField({ name: 'height', title: 'Height', type: 'number' })
              ]
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'similarityScore',
      title: 'Similarity Score',
      type: 'number',
      description: 'Embedding vector similarity score for search'
    })
  ]
});