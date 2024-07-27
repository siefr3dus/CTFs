import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePostDto, ResponseDto } from 'src/common/dto';
import { Post, PostDocument, UserDocument } from 'src/common/schemas';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) { }

  async getAllPost(id: Types.ObjectId): Promise<PostDocument[]> {
    const posts = await this.postModel.find({ user: new Types.ObjectId(id) });

    return posts;
  }

  async getPostById(id: Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel.findById(id);
    if (!post) throw new HttpException('No Post', 404);

    return post;
  }

  async createPost(
    data: CreatePostDto,
    user: UserDocument,
  ): Promise<ResponseDto> {
    const post = new this.postModel({
      ...data,
      user: new Types.ObjectId(user._id),
    });

    await post.save();
    return { status: 200, message: 'Post Saved.' };
  }

  async editPost(
    id: Types.ObjectId,
    data: CreatePostDto,
  ): Promise<ResponseDto> {
    const post = await this.getPostById(id);
    post.title = data.title;
    post.content = data.content;
    await post.save();

    return { status: 200, message: 'Post Saved.' };
  }
}
