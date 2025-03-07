// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig, Access } from 'payload'; // Import Access type
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import Bookmarks from './collections/Bookmarks'; // Import Bookmarks collection

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Access control function for authentication
const isAuthenticated: Access = ({ req }) => {
  const authHeader = req.headers.get('authorization'); // Use get method to access headers
  if (!authHeader) return false;

  const token = authHeader.split(' ')[1];
  if (!token) return false;

  return true; // Token is present, allow access
};

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    {
      ...Bookmarks,
      access: {
        read: isAuthenticated,
        create: isAuthenticated,
        update: isAuthenticated,
        delete: isAuthenticated,
      },
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
});