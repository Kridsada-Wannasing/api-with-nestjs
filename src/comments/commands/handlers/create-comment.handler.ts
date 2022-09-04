import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../../comments/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentCommand } from '../implementations/create-comment.command';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async execute(command: CreateCommentCommand): Promise<any> {
    const newPost = this.commentsRepository.create({
      ...command.comment,
      author: command.author,
    });

    await this.commentsRepository.save(newPost);
    return newPost;
  }
}
