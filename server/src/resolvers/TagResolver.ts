import {Arg, Authorized, Ctx, Query, Resolver} from "type-graphql";
import {Context} from "../apollo-context.interface";
import {getMongoRepository} from "typeorm";
import {Tag} from "../models/Tag";

import {ObjectID} from 'mongodb';

@Resolver()
export class TagResolver {
    @Authorized("USER")
    @Query(() => [Tag])
    async Tags(@Arg("userId") userId: string, @Ctx() ctx: Context) {
        const noteRepository = getMongoRepository(Tag);
        return await noteRepository.find({where: {userId: {$eq: new ObjectID(userId)}}});
    }
}