import CreateCommentDto from '../../dto/create-comment.dto';
import User from '../../../users/user.entity';

export class CreateCommentCommand {
  constructor(
    public readonly comment: CreateCommentDto,
    public readonly author: User,
  ) {}
}
