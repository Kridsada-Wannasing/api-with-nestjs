import { Test, TestingModule } from '@nestjs/testing';
import { PostsSearchService } from './posts-search.service';

describe('PostSearchService', () => {
  let service: PostsSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsSearchService],
    }).compile();

    service = module.get<PostsSearchService>(PostsSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
