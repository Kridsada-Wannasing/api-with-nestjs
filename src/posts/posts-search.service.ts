import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostSearchBody } from './interface/post-search.interface';
import Post from './post.entity';

@Injectable()
export class PostsSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index<PostSearchBody>({
      index: this.index,
      document: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    });
  }

  async search(text: string) {
    const body = await this.elasticsearchService.search<PostSearchBody>({
      index: this.index,
      query: {
        multi_match: {
          query: text,
          fields: ['title', 'content'],
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      query: {
        match: {
          id: postId,
        },
      },
    });
  }

  async update(post: Post) {
    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.author.id,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      query: {
        match: {
          id: post.id,
        },
      },
      script: {
        source: script,
      },
    });
  }
}
