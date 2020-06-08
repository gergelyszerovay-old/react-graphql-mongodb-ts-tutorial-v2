import {BaseEntity, Column, Entity, ObjectIdColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {IsString, MaxLength} from 'class-validator'
import {ObjectID} from "mongodb";

@Entity("tags")
@ObjectType()
export class Tag extends BaseEntity {
    @Field(() => ID)
    @ObjectIdColumn()
    _id: ObjectID;

    @Field(() => String)
    @Column()
    @IsString()
    @MaxLength(128)
    name: string;

    @Field(() => String)
    @Column()
    @IsString()
    userId: ObjectID;

}