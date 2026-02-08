import {CreateTournamentDTO, Tournament, TournamentFilters, UpdateTournamentDTO} from "@/types/tournaments";
import db from "@/config/database";

export class TournamentModel {
  static tableName = 'tournaments';

  static async findAll(filters: TournamentFilters = {}): Promise<Tournament[]> {
    const query = db(this.tableName).select('*');

    const {
      year,
      month,
      status,
      country,
      city,
      coverage_type,
      limit = 50,
      offset = 0,
    } = filters;

    if (year) {
      query.whereRaw('EXTRACT(YEAR FROM start_date) = ?', [year]);
    }

    if (month) {
      query.whereRaw('EXTRACT(MONTH FROM start_date) = ?', [month]);
    }

    if (status) {
      query.where('status', status);
    }

    if (country) {
      query.where('location_country', 'ILIKE', `%${country}%`);
    }

    if (city) {
      query.where('location_city', 'ILIKE', `%${city}%`);
    }

    if (coverage_type) {
      query.where('coverage_type', coverage_type);
    }

    return query
      .orderBy('start_date', 'asc')
      .limit(limit)
      .offset(offset);
  }

  static async findById(id: number): Promise<Tournament | null> {
    return db(this.tableName)
      .where('id', id)
      .first();
  }

  static async create(tournamentData: CreateTournamentDTO): Promise<Tournament> {
    const [tournament] = await db(this.tableName)
      .insert({
        ...tournamentData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return tournament;
  }

  static async update(
    id: number,
    tournamentData: UpdateTournamentDTO
  ): Promise<Tournament | null> {
    const [tournament] = await db(this.tableName)
      .where('id', id)
      .update({
        ...tournamentData,
        updated_at: new Date()
      })
      .returning('*');

    return tournament || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db(this.tableName)
      .where('id', id)
      .delete();

    return result > 0;
  }

  static async getByYear(year: number): Promise<Tournament[]> {
    return db(this.tableName)
      .whereRaw('EXTRACT(YEAR FROM start_date) = ?', [year])
      .orderBy('start_date', 'asc');
  }

  static async getUpcoming(limit: number = 10): Promise<Tournament[]> {
    return db(this.tableName)
      .where('start_date', '>=', new Date())
      .where('status', 'planned')
      .orderBy('start_date', 'asc')
      .limit(limit);
  }
}