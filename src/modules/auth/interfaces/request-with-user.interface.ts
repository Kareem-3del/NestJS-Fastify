import { FastifyRequest } from 'fastify';
import { User } from '../../users/entities/user.entity';

interface RequestWithUser extends FastifyRequest {
  user: User;
}
export default RequestWithUser;
