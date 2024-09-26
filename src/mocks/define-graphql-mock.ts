import type { TypedDocumentNode } from '@apollo/client/core'
import { getOperationDefinition, getOperationName } from '@apollo/client/utilities'
import { OperationTypeNode } from 'graphql'
import type { GraphQLContext, GraphQLHandler, GraphQLRequest, ResponseComposition } from 'msw'
import { graphql } from 'msw'
import invariant from 'tiny-invariant'

export interface MockHandler<QueryOutput extends Record<string, any> = any, Variables extends Record<string, any> = any>
  extends GraphQLHandler<GraphQLRequest<Variables>> {
  doc: TypedDocumentNode<QueryOutput, Variables>
  resolveOutput: (req: GraphQLRequest<Variables>) => QueryOutput
}

export function defineGraphQLMock<QueryOutput extends Record<string, any>, Variables extends Record<string, any>>(
  doc: TypedDocumentNode<QueryOutput, Variables>,
  data: QueryOutput | ((req: GraphQLRequest<Variables>) => QueryOutput),
  sendResponse: (
    output: QueryOutput,
    res: ResponseComposition<any>,
    ctx: GraphQLContext<Record<string, any>>,
  ) => ReturnType<ResponseComposition<any>> = (output, res, ctx) => res(ctx.data(output)),
): MockHandler<QueryOutput, Variables> {
  const name = getOperationName(doc)
  const opDef = getOperationDefinition(doc)
  invariant(name, 'cannot mock query without name')
  invariant(opDef, 'cannot mock query without operation definition')
  invariant(opDef.operation !== OperationTypeNode.SUBSCRIPTION, 'cannot mock subscription')

  const queryType = opDef.operation === OperationTypeNode.QUERY ? 'query' : 'mutation'

  const handler: GraphQLHandler<GraphQLRequest<Variables>> & {
    doc: TypedDocumentNode<QueryOutput, Variables>
    resolveOutput: (req: GraphQLRequest<Variables>) => QueryOutput
  } = graphql[queryType](name, (req, res, ctx) => {
    return sendResponse(typeof data === 'function' ? data(req as GraphQLRequest<Variables>) : data, res, ctx)
  }) as any

  handler.doc = doc
  handler.resolveOutput = (req: GraphQLRequest<Variables>) => {
    return typeof data === 'function' ? data(req as GraphQLRequest<Variables>) : data
  }

  return handler
}
