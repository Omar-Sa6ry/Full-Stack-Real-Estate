import axios from 'axios'
import { base_url } from '../../constant/base_url'
import { config } from '../../utils/ConfigAxios'

const addEstate = async data => {
  const response = await axios.post(
    `${base_url}estate/create-estate`,
    data,
    config
  )
  return response.data
}

const getUserEstates = async () => {
  const response = await axios.get(`${base_url}estate/all-estates-user`, config)
  return response.data
}

const getEmailOfOwner = async id => {
  const response = await axios.get(`${base_url}estate/user/${id}`, config)
  if (response) {
    return response.data
  }
}

const getEstates = async query => {
  const response = await axios.get(`${base_url}estate/search-estates?${query}`)
  if (response) {
    return await response?.data
  }
}

const getAllEstates = async () => {
  const response = await axios.get(`${base_url}estate/all-estates`)
  return response.data
}

const removeState = async id => {
  const response = await axios.delete(`${base_url}estate/${id}`, config)
  return response.data
}

const getestate = async id => {
  const response = await axios.get(`${base_url}estate/${id}`)
  return response.data
}

const putEstate = async data => {
  const response = await axios.put(
    `${base_url}estate/${data.id}`,
    {
      name: data?.estateData?.name,
      description: data?.estateData?.description,
      beds: data?.estateData?.beds,
      baths: data?.estateData?.baths,
      parking: data?.estateData?.parking,
      address: data?.estateData?.address,
      offer: data?.estateData?.offer,
      type: data?.estateData?.type,
      regularPrice: data?.estateData?.regularPrice,
      furnished: data?.estateData?.furnished,
      images: data?.estateData?.images,
      discountPrice: data?.estateData?.discountPrice
    },
    config
  )
  return response.data
}

const estateService = {
  addEstate,
  getUserEstates,
  removeState,
  getEmailOfOwner,
  getEstates,
  getestate,
  getAllEstates,
  putEstate
}

export default estateService
