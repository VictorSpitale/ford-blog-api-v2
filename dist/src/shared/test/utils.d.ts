import { Connection } from 'mongoose';
export declare const clearDatabase: (dbConnection: Connection, collection: string) => Promise<void>;
