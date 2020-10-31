import { Router } from './router'

/**
 * HandleRequest routes an incoming request to the appropriate
 * handler, in addition to writing logs and handling errors.
 * @param request
 */
const handleRequest = async (req: Request): Promise<Response> => {
  const router = new Router()
  try {
    return await router.route(req)
  } catch (except) {
    // TODO: Add Sentry Logging.
    return new Response(except.message || 'An error occured!', {
      status: 500,
    })
  }
}

/**
 * The entry point of the script for incoming web requests.
 */
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
