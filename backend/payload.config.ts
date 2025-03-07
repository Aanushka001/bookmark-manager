import { CollectionConfig, Access } from "payload";

const isLoggedIn: Access = ({ req }) => !!req.user;

const Bookmarks: CollectionConfig = {
  slug: "bookmarks",
  auth: false, // No individual auth, handled by Clerk
  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
    },
    {
      name: "userId",
      type: "text",
      required: true, // To associate bookmarks with users
    },
  ],
};

export default Bookmarks;
