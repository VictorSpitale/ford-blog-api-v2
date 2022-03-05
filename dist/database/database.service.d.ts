import { Connection } from 'mongoose';
export declare class DatabaseService {
    private readonly connection;
    constructor(connection: Connection);
    getDbHandle(): Connection;
}
