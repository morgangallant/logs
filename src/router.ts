/**
 * Generator function for helper methods that is used to check if a request uses
 * a particular HTTP method, like a GET or a POST.
 * @param method The HTTP method to match.
 */
const Method = (method: string) => (req: Request) =>
  req.method.toLowerCase() === method.toLowerCase()

const Connect = Method('connect')
const Delete = Method('delete')
const Get = Method('get')
const Head = Method('head')
const Options = Method('options')
const Patch = Method('patch')
const Post = Method('post')
const Put = Method('put')
const Trace = Method('trace')

/**
 * Generator function to check if a request path matches a regular expression.
 * @param regexp The regular expression used to match paths.
 */
const Path = (regexp: string) => (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname
  const match = path.match(regexp) || []
  return match[0] === path
}

/**
 * A MatcherFunc is used to filter and match requests.
 */
type MatcherFunc = (req: Request) => boolean

/**
 * A Handler is used to handle requests to a given route.
 */
type Handler = (req: Request) => Promise<Response>

/**
 * A Router is used to choose a handler function given the parameters of the
 * incoming HTTP request. Each handler is associated with a given matcher
 * function which checks the incoming request path and method.
 */
class Router {
  routes: {
    params: {
      method: MatcherFunc
      matcher: MatcherFunc
    }
    handler: Handler
  }[]

  constructor() {
    this.routes = []
  }

  handle(
    matcher: {
      method: MatcherFunc
      matcher: MatcherFunc
    },
    handler: Handler,
  ) {
    this.routes.push({
      params: matcher,
      handler: handler,
    })
    return this
  }

  connect(url: string, handler: Handler) {
    return this.handle(
      {
        method: Connect,
        matcher: Path(url),
      },
      handler,
    )
  }

  delete(url: string, handler: Handler) {
    return this.handle(
      {
        method: Delete,
        matcher: Path(url),
      },
      handler,
    )
  }

  get(url: string, handler: Handler) {
    return this.handle(
      {
        method: Get,
        matcher: Path(url),
      },
      handler,
    )
  }

  head(url: string, handler: Handler) {
    return this.handle(
      {
        method: Head,
        matcher: Path(url),
      },
      handler,
    )
  }

  options(url: string, handler: Handler) {
    return this.handle(
      {
        method: Options,
        matcher: Path(url),
      },
      handler,
    )
  }

  patch(url: string, handler: Handler) {
    return this.handle(
      {
        method: Patch,
        matcher: Path(url),
      },
      handler,
    )
  }

  post(url: string, handler: Handler) {
    return this.handle(
      {
        method: Post,
        matcher: Path(url),
      },
      handler,
    )
  }

  put(url: string, handler: Handler) {
    return this.handle(
      {
        method: Put,
        matcher: Path(url),
      },
      handler,
    )
  }

  trace(url: string, handler: Handler) {
    return this.handle(
      {
        method: Trace,
        matcher: Path(url),
      },
      handler,
    )
  }

  /**
   * Route an incoming request according to the configured rules. If no matching
   * route is found, a 404 error will be returned.
   * @param req The incoming request object to route to a handler.
   */
  route(req: Request) {
    const route = this.routes.find(
      (r) => r.params.method(req) && r.params.matcher(req),
    )
    if (route) {
      return route.handler(req)
    }
    return new Response('404 not found', {
      status: 404,
      statusText: 'not found',
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}

export { Router }
