import { Anime } from '../models/anime.js'
import axios from 'axios'


function search(req, res){
  const massagedSearch = req.body.search.split(' ').join('%20')
  axios.get(`https://api.aniapi.com/v1/anime?title=${massagedSearch}`,{
    headers: {
      'Authorization': `Bearer ${process.env.JWT}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => {
    res.render('animes/results', {
      title: 'Anime | Results',
      results: response.data.data.documents
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function show(req, res){
  axios.get(`https://api.aniapi.com/v1/anime/${req.params.id}`,{
    headers: {
      'Authorization': `Bearer ${process.env.JWT}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      Anime.findOne({ animeId: response.data.data.id})
        .populate('collectedBy')
        .populate({
          path: 'reviews',
          populate: {
            path: 'author'
          }
        })
        .then(anime => {
          res.render('animes/show', {
            title: 'Anime | Details',
            results: response.data.data,
            anime,
            userAnimes: anime?.collectedBy.some(profile => profile._id.equals(req.user.profile._id)),
            userReviewed: anime?.reviews.some(review => review.author.equals(req.user.profile._id))
          })
        })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
}

function addToList(req, res){
  Anime.findOne({ animeId: req.params.id })
    .then(anime => {
      if (anime){
        anime.collectedBy.push(req.user.profile._id)
        anime.save()
        .then(() => {
          res.redirect(`/anime/${req.params.id}`)
        })
      } else {
        req.body.collectedBy = req.user.profile._id
        Anime.create(req.body)
        .then(() => {
          res.redirect(`/anime/${req.params.id}`)
        })
      }
    })
}

function removeFromList(req, res){
  Anime.findOne({ animeId: req.params.id })
    .then(anime => {
      anime.collectedBy.remove({ _id: req.user.profile._id })
      anime.save()
        .then(() => {
          res.redirect(`/anime/${req.params.id}`)
        })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
    
}

export{
  search,
  show,
  addToList,
  removeFromList
}
