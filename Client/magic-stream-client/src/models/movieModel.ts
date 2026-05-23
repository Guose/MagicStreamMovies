import type { Genre } from "./genre"
import type { Ranking } from "./ranking"

export interface MovieModel {
    _id: string
    imdb_id: string
    title: string
    poster_path: string
    youtube_id: string
    admin_review: string
    ranking: Ranking
    genres: Genre[]
}