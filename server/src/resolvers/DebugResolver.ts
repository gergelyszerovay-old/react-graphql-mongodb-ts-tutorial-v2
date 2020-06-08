import {getMongoRepository} from "typeorm";

import {User} from "../entities/User";
import {Tag} from "../entities/Tag";
import {Note} from "../entities/Note";

import {ObjectID} from "mongodb";
import {Mutation, Resolver} from "type-graphql";

import * as bcrypt from "bcryptjs";

const LoadDemoData = async () => {
    const userRepository = getMongoRepository(User);
    await userRepository.deleteMany({});

    const tagRepository = getMongoRepository(Tag);
    await tagRepository.deleteMany({});

    const noteRepository = getMongoRepository(Note);
    await noteRepository.deleteMany({});

    const user1: User = await User.create({
        _id: new ObjectID('0000000000000000' + '1000' + '1001'),
        email: 'user1@example.com',
        hashedPassword: await bcrypt.hash('user1@example.com', 10)
    }).save()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user2: User = await User.create({
        _id: new ObjectID('0000000000000000' + '1000' + '1002'),
        email: 'user2@example.com',
        hashedPassword: await bcrypt.hash('user2@example.com', 10)
    }).save()

    const user3: User = await User.create({
        _id: new ObjectID('0000000000000000' + '1000' + '1003'),
        email: 'user3@example.com',
        hashedPassword: await bcrypt.hash('user3@example.com', 10)
    }).save()

    const tag1: Tag = await Tag.create({
        _id: new ObjectID('0000000000000000' + '2000' + '1001'),
        name: 'tag1',
        userId: user1._id
    }).save()

    const tag2: Tag = await Tag.create({
        _id: new ObjectID('0000000000000000' + '2000' + '1002'),
        name: 'tag2',
        userId: user1._id
    }).save()

    const tag3: Tag = await Tag.create({
        _id: new ObjectID('0000000000000000' + '2000' + '1003'),
        name: 'tag3',
        userId: user1._id
    }).save()

    const note1: Note = await Note.create({
        _id: new ObjectID('0000000000000000' + '3000' + '1001'),
        title: 'Note 1',
        text: 'Text 1',
        tagIds: [tag1._id, tag2._id],
        userId: user1._id
    }).save()

    const note2: Note = await Note.create({
        _id: new ObjectID('0000000000000000' + '3000' + '1002'),
        title: 'Note 2',
        text: 'Text 2',
        tagIds: [tag1._id, tag3._id],
        userId: user1._id
    }).save()

    const note3: Note = await Note.create({
        _id: new ObjectID('0000000000000000' + '3000' + '1003'),
        title: 'Note 3',
        text: 'Text 3',
        tagIds: [],
        userId: user1._id
    }).save()
}

@Resolver()
export class DebugResolver {
    @Mutation(() => Boolean)
    async LoadDemoData() {
        await LoadDemoData();
        return true;
    }
}
