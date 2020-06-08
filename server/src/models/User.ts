import {BaseEntity, Column, Entity, ObjectIdColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {IsString, MaxLength} from 'class-validator'

import {ObjectID} from "mongodb";

@Entity("users")
@ObjectType()
export class User extends BaseEntity {
    @Field(() => ID)
    @ObjectIdColumn()
    _id: ObjectID;

    @Field(() => String)
    @Column()
    @IsString()
    @MaxLength(128)
    email: string;

    // db only
    @Column()
    hashedPassword: string;
}