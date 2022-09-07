import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  content: string;

  @Field()
  title: string;

  @Field(() => [String])
  paragraphs: string[];
}
