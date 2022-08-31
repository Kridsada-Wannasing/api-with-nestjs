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

  async search(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title', 'paragraphs']);
    }

    const body = await this.elasticsearchService.search<PostSearchBody>({
      index: this.index,
      from: offset,
      size: limit,
      query: {
        bool: {
          should: {
            multi_match: {
              query: text,
              fields: ['title', 'paragraphs'],
            },
          },
          filter: {
            range: {
              id: {
                gt: startId,
              },
            },
          },
        },
      },
      sort: 'asc',
    });

    const count = body.hits.total;
    const hits = body.hits.hits;
    const results = hits.map((item) => item._source);
    return {
      count: startId ? separateCount : count,
      results,
    };
  }

  async count(query: string, fields: string[]) {
    const body = await this.elasticsearchService.count({
      index: this.index,
      query: {
        multi_match: {
          query,
          fields,
        },
      },
    });
    return body.count;
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
