"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatedPostStub = void 0;
const Mongoose = require("mongoose");
const mockObjectId = new Mongoose.Types.ObjectId();
const mockDate = '2016-05-18T16:00:00Z';
const CreatedPostStub = (categoryId) => {
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
exports.CreatedPostStub = CreatedPostStub;
//# sourceMappingURL=post.stub.js.map