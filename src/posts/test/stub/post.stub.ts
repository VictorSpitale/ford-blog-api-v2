import { PostDto } from '../../dto/post.dto';
import * as Mongoose from 'mongoose';

const mockObjectId = new Mongoose.Types.ObjectId();
const mockDate = '2016-05-18T16:00:00Z';

export const CreatedPostStub = (categoryId): PostDto => {
  return {
    _id: mockObjectId,
    desc: 'une desc',
    sourceLink: 'https://lien.fr',
    title: 'le titre',
    sourceName: 'nom de la source',
    authUserLiked: false,
    comments: [],
    createdAt: mockDate,
    likes: 0,
    updatedAt: mockDate,
    slug: 'le-slug',
    categories: [
      {
        name: 'sport',
        _id: categoryId,
      },
    ],
  };
};
