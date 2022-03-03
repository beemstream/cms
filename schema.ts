import { Lists } from '.keystone/types';
import { list } from '@keystone-6/core';
import {
    image, password, relationship, select, text, timestamp, checkbox
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import path from 'path';
import { isAuthenticated } from './access';
import { componentBlocks } from './component-blocks';
import { DeveloperReviewsSchema } from './developer-reviews';

export const lists: Lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
      posts: relationship({ ref: 'Post.author', many: true, }),
      developer_reviews: relationship({ ref: 'DeveloperReview.author', many: true }),
    },
    // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
    ui: {
      listView: {
        initialColumns: ['name', 'posts'],
      },
    },
  }),
  Post: list({
      access: { operation: { create: isAuthenticated(), update: isAuthenticated(), delete: isAuthenticated() } },
    fields: {
      title: text({ validation: { isRequired: true } }),
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        defaultValue: 'draft',
        ui: {
          displayMode: 'segmented-control',
        },
      }),
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
      author: relationship({
        ref: 'User.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email'] },
        },
      }),
      tags: relationship({
        ref: 'Tag.posts',
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
        ref: 'Like.posts',
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
        ref: 'Comment.posts',
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
    },
  }),
  // Our final list is the tag list. This field is just a name and a relationship to posts
  Tag: list({
    access: { operation: { create: isAuthenticated(), update: isAuthenticated(), delete: isAuthenticated() } },
    fields: {
      name: text(),
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),
  Comment: list({
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
      posts: relationship({ ref: 'Post.comments', many: true }),
    },
  }),
  Image: list({
    ui: {
      isHidden: true,
    },
      access: { operation: { create: isAuthenticated(), update: isAuthenticated(), delete: isAuthenticated() } },
      fields: {
          name: text(),
          image: image(),
          publishDate: timestamp(),
      }
  }),
  Like: list({
    ui: {
      isHidden: true,
    },
      fields: {
          user_id: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
          liked: checkbox(),
          posts: relationship({ ref: 'Post.likes', many: true }),
      }
  }),
  ...DeveloperReviewsSchema
};
