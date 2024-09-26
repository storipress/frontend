import { Hono } from 'hono'
import { sapling } from './sapling'

const app = new Hono()

app.route('/sapling', sapling)

export default app
