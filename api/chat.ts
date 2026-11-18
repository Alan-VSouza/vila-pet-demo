import { atender } from '../shared/agente.js'

export const maxDuration = 30

export function POST(req: Request) {
  return atender(req)
}
