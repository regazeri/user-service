import { DataNotFoundException, InternalServerException } from 'common-panel';
import { AbstractRepository, EntityRepository } from 'typeorm';

import { User } from '../entities';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  /**
   * Create a new user
   * @param user The new user entity
   * @returns All fields of the new created user
   */
  async registerByEmail(user: User): Promise<User> {
    try {
      const insertResult = await this.repository.insert(user);
      const newUserId: string = insertResult.identifiers[0].id;
      return this.repository.findOne(newUserId);
    } catch (error) {
      throw new InternalServerException();
    }
  }

  /**
   * Update some fields of the user
   * @param user a partial list of user fields
   * @returns All fields of the new created user
   */
  async updateUser(
    user: Partial<User>,
    filter: { id: string } | { email: string },
  ): Promise<User> {
    const oldUser = await this.repository.findOne(filter);
    if (!oldUser) {
      throw new DataNotFoundException('user');
    }
    await this.repository.update(filter, user);
    return this.repository.findOne(filter);
  }

  /**
   * Delete a user
   * @param id The user ID
   */
  async deleteUser(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Check if an email address belongs to a user
   * @param email The email address
   * @returns true if exist
   */
  async isEmailExist(email: string): Promise<boolean> {
    return (await this.repository.findOne({ email })) !== undefined;
  }
}
