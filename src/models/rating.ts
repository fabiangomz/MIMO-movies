import { Rating, RatingAttributes, Movie, User } from "../db";

export const RatingModel = {
  get model(): typeof Rating {
    return Rating;
  },

  async findById(id: number): Promise<Rating | null> {
    return this.model.findByPk(id);
  },

  async findByIdAndMovieId(
    id: number,
    movieId: number
  ): Promise<Rating | null> {
    return this.model.findOne({
      where: { id, movieId },
    });
  },

  async findByUserAndMovie(
    userId: number,
    movieId: number
  ): Promise<Rating | null> {
    return this.model.findOne({
      where: { userId, movieId },
    });
  },

  async findAllByMovieId(
    movieId: number,
    pagination?: { page: number; limit: number }
  ): Promise<{ rows: Rating[]; count: number }> {
    const options: { where: object; limit?: number; offset?: number } = {
      where: { movieId },
    };

    if (pagination) {
      const offset = (pagination.page - 1) * pagination.limit;
      options.limit = pagination.limit;
      options.offset = offset;
    }

    return this.model.findAndCountAll(options);
  },

  async create(rating: RatingAttributes): Promise<Rating> {
    return this.model.create(rating);
  },

  async update(
    id: number,
    data: Partial<RatingAttributes>
  ): Promise<[number]> {
    return this.model.update(data, {
      where: { id },
    });
  },

  async delete(id: number): Promise<number> {
    return this.model.destroy({
      where: { id },
    });
  },
};

