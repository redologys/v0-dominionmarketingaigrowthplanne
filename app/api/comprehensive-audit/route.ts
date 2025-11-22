import handler from "../../../api/comprehensive-audit"

export const runtime = "edge"

export async function POST(request: Request) {
  return handler(request)
}
