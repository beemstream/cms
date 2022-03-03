import { list } from '@keystone-6/core';
import {
    image, relationship, select, text, timestamp, checkbox
} from '@keystone-6/core/fields';
import { isAuthenticated } from './access';
import { document } from '@keystone-6/fields-document';
import path from 'path';
import { componentBlocks } from './component-blocks';

export const DeveloperReviewsSchema = {
  DeveloperReview: list({
      access: { operation: { create: isAuthenticated(), update: isAuthenticated(), delete: isAuthenticated() } },
    fields: {
      title: text({ validation: { isRequired: true } }),
      // Having the status here will make it easy for us to choose whether to display
      // posts on a live site.
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        // We want to make sure new posts start off as a draft when they are created
        defaultValue: 'draft',
        // fields also have the ability to configure their appearance in the Admin UI
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      // The document field can be used for making highly editable content. Check out our
      // guide on the document field https://keystonejs.com/docs/guides/document-fields#how-to-use-document-fields
      // for more information
      content: document({
          ui: {
              views: path.join(__dirname, './component-blocks')
          },
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        componentBlocks
      }),
      publishDate: timestamp(),
      // Here is the link from post => author.
      // We've configured its UI display quite a lot to make the experience of editing posts better.
      author: relationship({
        ref: 'User.developer_reviews',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email'] },
        },
      }),
      // We also link posts to tags. This is a many <=> many linking.
      tags: relationship({
        ref: 'DeveloperTag.developer_reviews',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),
      likes: relationship({
        ref: 'DeveloperLike.developer_reviews',
        ui: {
          displayMode: 'cards',
          cardFields: [],
          inlineEdit: { fields: [] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: [] },
        },
        many: true,
      }),
      comments: relationship({
        ref: 'DeveloperComment.developer_reviews',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'comment'],
          inlineEdit: { fields: ['name', 'comment'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name', 'comment'] },
        },
        many: true,
      }),
      socials: relationship({
        ref: 'DeveloperSocial.developer_reviews',
        ui: {
          displayMode: 'cards',
          cardFields: ['twitch', 'twitter', 'discord'],
          inlineEdit: { fields: ['twitch', 'twitter', 'discord'] },
          inlineCreate: { fields: ['twitch', 'twitter', 'discord'] },
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
  }),
  DeveloperSocial: list({
      fields: {
          twitch: text(),
          twitter: text(),
          discord: text(),
          developer_reviews: relationship({ ref: 'DeveloperReview.socials', many: false }),
      },
  }),
  DeveloperTag: list({
    access: { operation: { create: isAuthenticated(), update: isAuthenticated(), delete: isAuthenticated() } },
    fields: {
      name: text(),
      developer_reviews: relationship({ ref: 'DeveloperReview.tags', many: true }),
    },
  }),
  DeveloperComment: list({
    ui: {
      isHidden: true,
    },
      access: {
          operation: {
              update: isAuthenticated(),
              delete: isAuthenticated() 
          }
      },
    fields: {
      name: text({ validation: { isRequired: true } }),
      comment: text({ validation: { isRequired: true } }),
      developer_reviews: relationship({ ref: 'DeveloperReview.comments', many: true }),
    },
  }),
  DeveloperLike: list({
    ui: {
      isHidden: true,
    },
      fields: {
          user_id: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
          liked: checkbox(),
          developer_reviews: relationship({ ref: 'DeveloperReview.likes', many: true }),
      }
  })
}
