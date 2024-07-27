import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDto, ResponseDto } from 'src/common/dto';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';
import { Types } from 'mongoose';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import xss from 'xss';
import { AdminGuard } from 'src/common/guard';

const sanitizeHtml = (html: string) => {
  return DOMPurify(new JSDOM('<!DOCTYPE html>').window).sanitize(html);
};

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService
  ) { }

  @Get()
  @Render('post-main')
  async renderAllPost(@Req() request: Request) {
    const posts = await this.postService.getAllPost(request.user._id);

    return { posts: posts, user: request.user }
  }

  @Get('all')
  async getAllPost(@Req() request: Request) {
    const posts = await this.postService.getAllPost(request.user._id);

    return posts;
  }

  @Get('write')
  @Render('post-write')
  async renderNewPost(@Req() request: Request) {
    return { user: request.user };
  }

  @Post('write')
  createPost(
    @Req() request: Request,
    @Body() data: CreatePostDto,
  ): Promise<ResponseDto> {
    return this.postService.createPost(data, request.user);
  }

  @Get('/edit/:id')
  @UseGuards(AdminGuard)
  @Render('post-edit')
  async renderEdit(@Req() request: Request, @Param('id') id: Types.ObjectId) {
    const post = await this.postService.getPostById(id);
    const author = await this.userService.getUserById(post.user);
    const user = request.user;

    user.personalColor = xss(user.personalColor);
    author.personalColor = xss(author.personalColor);

    return { post: post, author: author, user: request.user };
  }

  @Post('/edit/:id')
  @UseGuards(AdminGuard)
  async editPost(@Param('id') id: Types.ObjectId, @Body() data: CreatePostDto) {
    return await this.postService.editPost(id, data);
  }

  @Get('/:id')
  @Render('post')
  async getPost(@Req() request: Request, @Param('id') id: Types.ObjectId) {
    const post = await this.postService.getPostById(id);
    const author = await this.userService.getUserById(post.user);
    const user = request.user;

    user.personalColor = xss(user.personalColor);
    author.personalColor = xss(author.personalColor);

    return { post: post, author: author, user: user };
  }

}
