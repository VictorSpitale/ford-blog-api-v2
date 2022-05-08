"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostStub = void 0;
const Mongoose = require("mongoose");
const category_stub_1 = require("../../../categories/test/stub/category.stub");
const mockDate = '2016-05-18T16:00:00Z';
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
//# sourceMappingURL=post.stub.js.map