"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedComment = exports.CreatePostStub = exports.PostStub = exports.commentMockedId = void 0;
const Mongoose = require("mongoose");
const category_stub_1 = require("../../../categories/test/stub/category.stub");
const user_stub_1 = require("../../../users/test/stub/user.stub");
const mockDate = '2016-05-18T16:00:00Z';
exports.commentMockedId = new Mongoose.Types.ObjectId();
const PostStub = (slug = 'le-slug') => {
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
        categories: [(0, category_stub_1.CategoryStub)()],
        picture: '',
        comments: [],
    };
};
exports.PostStub = PostStub;
const CreatePostStub = (slug = 'le-slug') => {
    return {
        desc: 'une desc',
        sourceLink: 'https://lien.fr',
        title: 'le titre',
        sourceName: 'nom de la source',
        slug,
        categories: [(0, category_stub_1.CategoryStub)()._id],
    };
};
exports.CreatePostStub = CreatePostStub;
const mockedComment = () => {
    return {
        comment: 'comment',
        _id: exports.commentMockedId,
        commenter: {
            pseudo: (0, user_stub_1.UserStub)().pseudo,
            _id: (0, user_stub_1.UserStub)()._id,
        },
        updatedAt: 1,
        createdAt: 1,
    };
};
exports.mockedComment = mockedComment;
//# sourceMappingURL=post.stub.js.map