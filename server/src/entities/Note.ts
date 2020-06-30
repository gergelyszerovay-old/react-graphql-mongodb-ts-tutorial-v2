import {BaseEntity, Column, Entity, ObjectIdColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {IsString, MaxLength} from 'class-validator'
import {Tag} from "./Tag";

import {ObjectID} from 'mongodb';


@Entity("notes")
@ObjectType()
export class Note extends BaseEntity {
    @Field(() => ID)
    @ObjectIdColumn()
    _id: ObjectID;

    @Field(() => String)
    @Column()
    @IsString()
    @MaxLength(128)
    title: string;

    @Field(() => String)
    @Column()
    @IsString()
    @MaxLength(10000)
    text: string;

    @Field(() => String)
    @Column()
    @IsString()
    userId: ObjectID;

    // db only
    @Column()
    tagIds: ObjectID[];

    // graphql only
    @Field(() => [Tag])
    tags!: Tag[];

}
