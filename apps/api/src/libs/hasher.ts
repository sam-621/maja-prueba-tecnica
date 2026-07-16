import * as bcrypt from 'bcrypt';

class Hasher {
  async hash(str: string) {
    const salt = await this.generateSalt();

    return bcrypt.hash(str, salt);
  }

  async compare(str: string, hash: string) {
    return await bcrypt.compare(str, hash);
  }

  private async generateSalt() {
    return await bcrypt.genSalt();
  }
}

export const hasher = new Hasher();
