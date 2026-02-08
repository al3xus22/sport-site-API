export interface Tournament {
  id: number;
  title: string;
  description: string | null;
  start_date: Date;
  end_date: Date | null;
  location_city: string;
  location_country: string;
  location_place: string | null;
  coverage_type: 'photo' | 'video' | 'both' | 'none';
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string | null;
  website_url: string | null;
  contact_email: string | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateTournamentDTO = Omit<
  Tournament,
  'id' | 'created_at' | 'updated_at'
>;

export type UpdateTournamentDTO = Partial<CreateTournamentDTO>;

export interface TournamentFilters {
  year?: number;
  month?: number;
  status?: Tournament['status'];
  country?: string;
  city?: string;
  coverage_type?: Tournament['coverage_type'];
  limit?: number;
  offset?: number;
}