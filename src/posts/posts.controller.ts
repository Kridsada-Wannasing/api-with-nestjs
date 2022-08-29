import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import PostsService from './posts.service';
import CreatePostDto from './dto/create-post.dto';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { ExceptionsLoggerFilter } from 'src/utils/exceptions-logger.filter';
import FindOneParams from 'src/utils/find-one-params';
import UpdatePostDto from './dto/update-post.dto';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';

@Controller('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query('search') search: string) {
    if (search) {
      return this.postsService.searchForPosts(search);
    }
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  @UseFilters(ExceptionsLoggerFilter)
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    this.postsService.deletePost(Number(id));
  }
}
