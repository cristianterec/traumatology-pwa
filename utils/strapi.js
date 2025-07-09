import axios from 'axios'
import qs from 'qs'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` })
  }
})

export const fetchModules = async (options = {}) => {
  const queryParams = {
    populate: {
      image: { fields: ['url', 'alternativeText'] },
      video: { fields: ['url', 'alternativeText'] }
    },
    pagination: { page: options.page || 1, pageSize: options.pageSize || 25 },
    sort: [options.sort || 'createdAt:desc']
  }

  if (options.category || options.search) {
    queryParams.filters = {}
    if (options.category) queryParams.filters.category = { $eq: options.category }
    if (options.search) {
      queryParams.filters.$or = [
        { title: { $containsi: options.search } },
        { description: { $containsi: options.search } }
      ]
    }
  }

  const query = qs.stringify(queryParams, { encodeValuesOnly: true })
  const response = await api.get(`/modules?${query}`)
  
  return {
    data: response.data.data.map(transformModuleData),
    meta: response.data.meta
  }
}

const transformModuleData = (strapiModule) => {
  const attrs = strapiModule.attributes
  return {
    id: strapiModule.id,
    title: attrs.title,
    slug: attrs.slug,
    description: attrs.description,
    category: attrs.category,
    boneType: attrs.boneType,
    priority: attrs.priority || 'stable',
    duration: attrs.duration || 30,
    quizQuestion: attrs.quizQuestion,
    quizAnswer: attrs.quizAnswer,
    image: attrs.image?.data ? {
      url: `${STRAPI_URL}${attrs.image.data.attributes.url}`,
      alt: attrs.image.data.attributes.alternativeText
    } : null
  }
}

export default api
