import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Context} from "../apollo-context.interface";
import {getMongoRepository} from "typeorm";
import {Note} from "../models/Note";
import {Tag} from "../models/Tag";

import {ObjectID} from 'mongodb';

import * as DataLoader from 'dataloader';
import {NewNoteInput} from "../inputs/NewNoteInput";
import {EditNoteInput} from "../inputs/EditNoteInput";
import {ApolloError} from "apollo-server-express";

const getTagsByIds = async (tagIds: readonly ObjectID[]) => {
    console.log('getTagsByIds:', tagIds);
    const tagRepository = getMongoRepository(Tag);

    const ret = tagRepository.find({where: {_id: {$in: tagIds}}})
        .then(rows => tagIds.map(id => {
            return rows.find(x => id.equals(x._id));
        }));

    return ret;

}

const CreateNewTags = async (userId: string, tagIds: string[]): Promise<ObjectID[]> => {
    const tagRepository = getMongoRepository(Tag);
    const tags: Tag[] = await tagRepository.find({where: {userId: {$eq: new ObjectID(userId)}}});
    const tagsById = Object.fromEntries(tags.map((tag: Tag) => ([tag._id.toHexString(), tag])))

    return Promise.all(tagIds.map(async (tagId: string) => {
        if (tagId in tagsById) {
            return new ObjectID(tagId);
        } else {
            const newTag: Tag = await Tag.create({
                name: tagId,
                userId: new ObjectID(userId)
            }).save()
            return newTag._id;
        }
    }));
}

@Resolver()
export class NoteResolver {

    @Authorized("USER")
    @Query(() => [Note])
    async Notes(@Arg("userId") userId: string, @Ctx() ctx: Context) {

        const getTagsByIdsLoader = new DataLoader(getTagsByIds);

        const noteRepository = getMongoRepository(Note);
        const notes = await noteRepository.find({where: {userId: {$eq: new ObjectID(userId)}}, order: {_id: -1}});

        return notes.map(async (note) => {
            // without Dataloader
            // return Object.assign(note, {tags: await getTagsByIds(note.tagIds.map((tagId) => new ObjectID(tagId)))})

            // with Dataloader
            return Object.assign(note, {tags: await getTagsByIdsLoader.loadMany(note.tagIds.map((tagId) => new ObjectID(tagId)))})
        });
    }

    @Authorized("USER")
    @Query(() => Note, {nullable: true})
    async SingleNote(@Arg("_id") _id: string, @Ctx() ctx: Context) {
        const noteRepository = getMongoRepository(Note);
        const notes: Note[] = await noteRepository.find({where: {_id: {$eq: new ObjectID(_id)}}});

        if (!notes.length) return null;
        if (notes[0].userId.toHexString() !== ctx.jwt.user.id) {
            throw new ApolloError("Application Error", "APPLICATION_ERROR", {
                applicationError: {
                    code: '',
                    message: 'Access denied',
                    description: ''
                }
            });
        }

        // add tags field
        return Object.assign(notes[0], {tags: await getTagsByIds(notes[0].tagIds.map((tagId) => new ObjectID(tagId)))});
    }

    @Authorized("USER")
    @Mutation(() => Boolean)
    async DeleteNote(@Arg("_id") _id: string, @Ctx() ctx: Context) {
        // const noteRepository = getMongoRepository(Note);
        // console.log(_id);
        // await noteRepository.deleteOne({where: {_id: {$eq: new ObjectID(_id)}}});
        // return true;
        const noteRepository = getMongoRepository(Note);
        const notes: Note[] = await noteRepository.find({where: {_id: {$eq: new ObjectID(_id)}}});

        if (!notes.length) return null;
        if (notes[0].userId.toHexString() !== ctx.jwt.user.id) {
            throw new ApolloError("Application Error", "APPLICATION_ERROR", {
                applicationError: {
                    code: '',
                    message: 'Access denied',
                    description: ''
                }
            });
        }

        await notes[0].remove();

        // add tags field
        // return Object.assign(notes[0], {tags: await getTagsByIds(notes[0].tagIds.map((tagId) => new ObjectID(tagId)))});

        return true;
    }

    @Authorized("USER")
    @Mutation(() => Note)
    async EditNote(@Arg("data") data: EditNoteInput, @Ctx() ctx: Context) {

        const noteRepository = getMongoRepository(Note);
        const note = await Note.findOne(data._id);

        if (!note) {
            throw new ApolloError("Application Error", "APPLICATION_ERROR", {
                applicationError: {
                    code: '',
                    message: 'Invalid note _id',
                    description: ''
                }
            });
        }

        if (note.userId.toHexString() !== ctx.jwt.user.id) {
            throw new ApolloError("Application Error", "APPLICATION_ERROR", {
                applicationError: {
                    code: '',
                    message: 'Access denied',
                    description: ''
                }
            });
        }

        const tagIds2 = await CreateNewTags(ctx.jwt.user.id, data.tagIds);

        const update = {
            title: data.title,
            text: data.text,
            tagIds: tagIds2
        };

        const updatedNote: Note = await noteRepository.save({...note, ...update});

        // add tags field
        return Object.assign(updatedNote, {tags: await getTagsByIds(updatedNote.tagIds.map((tagId) => new ObjectID(tagId)))})
    }

    @Authorized("USER")
    @Mutation(() => Note)
    async NewNote(@Arg("data") data: NewNoteInput, @Ctx() ctx: Context) {

        const tagIds2 = await CreateNewTags(ctx.jwt.user.id, data.tagIds);

        const newNote: Note = await Note.create({
            title: data.title,
            text: data.text,
            tagIds: tagIds2,
            userId: new ObjectID(ctx.jwt.user.id)
        }).save()

        // add tags field
        return Object.assign(newNote, {tags: await getTagsByIds(newNote.tagIds.map((tagId) => new ObjectID(tagId)))})
    };

}