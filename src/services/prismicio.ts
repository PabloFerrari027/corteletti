import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'

export const createClient = (config: any) => {
  const client = prismic.createClient(process.env.PRISMICIO_KEY!, {
    ...config
  })

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req
  })

  return client
}
