import mongoose from 'mongoose'
const Schema = mongoose.Schema

const animeSchema = new Schema({
  animeTitle: {type: String, required: true},
  animeId: Number,
  coverImage: String,
  collectedBy: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

const Anime = mongoose.model('Anime', animeSchema)

export {
  Anime
}