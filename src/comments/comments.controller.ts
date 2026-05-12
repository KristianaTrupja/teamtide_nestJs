import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser, CurrentUserPayload } from '@/common/decorators/current-user.decorator';

@Controller('ideas/:ideaId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findByIdea(@Param('ideaId') ideaId: string) {
    return this.commentsService.findByIdea(ideaId);
  }

  @Post()
  create(
    @Param('ideaId') ideaId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    return this.commentsService.create(ideaId, dto, user.id);
  }
}