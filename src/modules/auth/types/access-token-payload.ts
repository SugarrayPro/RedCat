import { Role } from '../enums/role.enum';
import { UUID } from 'crypto';

export interface AccessTokenPayload {
  id: UUID;
  email: string;
  roles: Role[];
}
