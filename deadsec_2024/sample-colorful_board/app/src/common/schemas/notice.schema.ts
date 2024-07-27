import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoticeDocument = Notice & Document;

const options: SchemaOptions = {
    timestamps: false,
    versionKey: false,
};

@Schema(options)
export class Notice {
    @Prop({
        required: true,
    })
    title: string;

    @Prop({
        required: true,
    })
    content: string;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
