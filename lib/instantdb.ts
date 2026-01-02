import { init } from '@instantdb/react';

// Define your schema here
export const schema = {
    // We will infer the schema from usage, but for TypeScript we can define types if needed later.
    // InstantDB is very flexible!
};

// ---------------------------
// APP ID (Get this from instantdb.com)
// ---------------------------
const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || 'YOUR_APP_ID_HERE';

export const db = init({ appId: APP_ID });

export type Reaction = {
    id: string;
    imageId: string;
    emoji: string;
    userId: string; // We'll just generate a random one for this demo
    timestamp: number;
};

export type Comment = {
    id: string;
    imageId: string;
    text: string;
    userId: string;
    userName: string;
    userAvatar: string;
    timestamp: number;
};
