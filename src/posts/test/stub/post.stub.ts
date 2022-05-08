import { PostDto } from '../../dto/post.dto';
import * as Mongoose from 'mongoose';
import { CategoryStub } from '../../../categories/test/stub/category.stub';
import { CreatePostDto } from '../../dto/create-post.dto';

const mockDate = '2016-05-18T16:00:00Z';

export const PostStub = (slug = 'le-slug'): Omit<PostDto, 'authUserLiked'> => {
  const mockObjectId = new Mongoose.Types.ObjectId();
  return {
    _id: mockObjectId,
    desc: 'une desc',
    sourceLink: 'https://lien.fr',
    title: 'le titre',
    sourceName: 'nom de la source',
    createdAt: mockDate,
    likes: 0,
    updatedAt: mockDate,
    slug,
    categories: [CategoryStub()],
    picture: '',
    comments: [],
  };
};

export const CreatePostStub = (slug = 'le-slug'): CreatePostDto => {
  return {
    desc: 'une desc',
    sourceLink: 'https://lien.fr',
    title: 'le titre',
    sourceName: 'nom de la source',
    slug,
    categories: [CategoryStub()._id],
  };
};
