import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import User from '../users/user.entity';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { CreatePostInput } from './inputs/post.input';
import { Post } from './models/post.model';
import PostsService from './posts.service';
import PostsLoaders from './loaders/posts.loaders';
import { GraphQLResolveInfo } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private postsService: PostsService,
    private postsLoaders: PostsLoaders,
  ) {}

  @Query(() => [Post])
  async posts(@Info() info: GraphQLResolveInfo) {
    // with join query but always fetch authors
    // const posts = await this.postsService.getPostsWithAuthors();

    const parsedInfo = parseResolveInfo(info) as ResolveTree;
    const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
      parsedInfo,
      info.returnType,
    );

    const posts =
      'author' in simplifiedInfo.fields
        ? await this.postsService.getPostsWithAuthors()
        : await this.postsService.getPosts();

    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    return this.postsService.createPost(createPostInput, context.req.user);
  }

  @ResolveField('author', () => User)
  async getAuthor(@Parent() post: Post) {
    const { authorId } = post;

    return this.postsLoaders.batchAuthors.load(authorId);
  }
}
