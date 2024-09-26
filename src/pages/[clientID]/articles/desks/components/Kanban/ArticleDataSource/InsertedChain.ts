import type { Predicate } from 'effect'
import { Array, Chunk, HashMap, Option, Order, identity, pipe } from 'effect'
import invariant from 'tiny-invariant'
import * as DoubleLinkedList from './DoubleLinkedList'
import type * as ArticleIndex from './ArticleIndex'

interface BasicDocument {
  id: string
}

export interface PositionNode extends DoubleLinkedList.DoubleLinkedList {
  readonly _tag: 'PositionNode'
  pos: ArticleIndex.ArticleIndex
}

export interface DocumentNode<Document extends BasicDocument = BasicDocument>
  extends DoubleLinkedList.DoubleLinkedList {
  readonly _tag: 'DocumentNode'
  document: Document
}

export type Node<Document extends BasicDocument = BasicDocument> = PositionNode | DocumentNode<Document>

export interface WithPivot<Document extends BasicDocument = BasicDocument> {
  pivot: Option.Option<string>
  index: ArticleIndex.ArticleIndex
  document: Document
}

export interface WithOriginPosition<Document extends BasicDocument = BasicDocument> extends WithPivot<Document> {
  origin: ArticleIndex.ArticleIndex
}

export interface InsertedChain<Document extends BasicDocument = BasicDocument> {
  byId: HashMap.HashMap<string, DocumentNode<Document>>
  byStage: HashMap.HashMap<number, HashMap.HashMap<number, PositionNode>>
}

/**
 * Create empty InsertedChain
 * @returns InsertedChain
 */
export function empty<Document extends BasicDocument = BasicDocument>(): InsertedChain<Document> {
  return {
    byId: HashMap.empty<string, DocumentNode<Document>>(),
    byStage: HashMap.empty<number, HashMap.HashMap<number, PositionNode>>(),
  }
}

/**
 * Get article to be inserted at specific index
 * @param self self
 * @param index the index
 * @returns articles should be inserted before the specific index
 */
export function getChainByIndex<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  index: ArticleIndex.ArticleIndex,
): Document[] {
  return pipe(
    self.byStage,
    HashMap.get(index[0]),
    Option.flatMap(HashMap.get(index[1])),
    Option.map(DoubleLinkedList.toArray<Node<Document>>),
    Option.getOrElse(() => [] as Node<Document>[]),
    Array.filter((node): node is DocumentNode<Document> => node._tag === 'DocumentNode'),
    Array.map((node) => node.document),
  )
}

/**
 * Remove specific article
 * @param self self
 * @param id article id
 * @returns InsertChain with article removed
 */
export function remove<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  id: string,
): InsertedChain<Document> {
  return pipe(
    HashMap.get(self.byId, id),
    Option.map((node) => {
      DoubleLinkedList.remove(node)
      return {
        ...self,
        byId: HashMap.remove(self.byId, id),
      }
    }),
    Option.getOrElse(() => self),
  )
}

/**
 * Get all article that is after the specific index
 * @param self self
 * @param index the index
 * @returns Article that is after the specific index (inclusive)
 */
export function getRemainingAfter<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain,
  index: ArticleIndex.ArticleIndex,
): ReadonlyArray<Document> {
  return pipe(
    self.byStage,
    HashMap.get(index[0]),
    Option.map((stageMap) =>
      pipe(
        stageMap,
        HashMap.filter((_v, i) => i >= index[1]),
        HashMap.values,
        Chunk.fromIterable,
        Chunk.sortWith(
          identity,
          Order.mapInput(Order.number, (x) => x.pos[1]),
        ),
        Chunk.flatMap((item) =>
          pipe(
            item,
            DoubleLinkedList.toArray<Node<Document>>,
            Array.filter((node): node is DocumentNode<Document> => node._tag === 'DocumentNode'),
            Array.map((node) => node.document),
            Chunk.unsafeFromArray,
          ),
        ),
        Chunk.toArray,
      ),
    ),
    Option.getOrElse(() => [] as Document[]),
  )
}

/**
 * Filter articles with predicate
 * @param self self
 * @param predicate return false will remove article
 * @returns filtered InsertedChain
 */
export function filter<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  predicate: Predicate.Predicate<Document>,
) {
  return pipe(
    self.byId,
    HashMap.values,
    Array.reduce(self, (chain, node) => {
      if (node._tag !== 'DocumentNode') {
        return chain
      }

      // It can stay
      if (predicate(node.document)) {
        return chain
      }

      return remove(chain, node.document.id)
    }),
  )
}

/**
 * Update specific node id
 * @param self self
 * @param oldId original id
 * @param newId new id
 * @returns updated result
 */
export function updateId<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  oldId: string,
  newId: string,
): InsertedChain<Document> {
  const oldDocument = HashMap.get(self.byId, oldId)
  if (Option.isNone(oldDocument)) {
    return self
  }

  const position = getPosition(oldDocument.value)
  if (Option.isNone(position)) {
    return self
  }

  return pipe(remove(self, oldId), (chain) =>
    insertBefore(chain, {
      index: position.value,
      pivot: Option.none(),

      document: {
        ...oldDocument.value.document,

        id: newId,
      },
    }),
  )
}

/**
 * Modify article or remove it
 * @param self self
 * @param id article id
 * @param update return Option.none will remove article
 * @returns modified result
 */
export function modifyAt<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  id: string,
  update: (document: Document) => Option.Option<Document>,
) {
  return pipe(
    HashMap.get(self.byId, id),
    Option.flatMap((node) => {
      const res = update(node.document)
      return Option.match(res, {
        onSome: (document) => {
          node.document = document
          return Option.some(self)
        },
        onNone: () => Option.some(remove(self, id)),
      })
    }),
    Option.getOrElse(() => self),
  )
}

/**
 * Insert article to InsertedChain, if there is pivot, it will use pivot point first, else it will fallback to index
 * @param self self
 * @param input insert position info
 * @returns updated InsertedChain
 */
export function insertBefore<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  input: WithPivot<Document>,
) {
  const updated = remove(self, input.document.id)
  return pipe(
    tryInsertBeforeWithPivot(updated, input),
    Option.getOrElse(() => insertBeforeWithStage(updated, input)),
  )
}

/**
 * Insert article with specific pivot
 * User-facing code should use `insertBefore`
 *
 * @private
 */
export function tryInsertBeforeWithPivot<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  { pivot, document }: Omit<WithPivot<Document>, 'index'>,
): Option.Option<InsertedChain<Document>> {
  return pipe(
    pivot,
    Option.flatMap((pivot) => HashMap.get(self.byId, pivot)),
    Option.map((pivotNode) => {
      const documentNode = makeDocumentNode(document)
      DoubleLinkedList.insertBefore(pivotNode, documentNode)
      return documentNode
    }),
    Option.map((documentNode) => ({
      ...self,
      byId: HashMap.set(self.byId, documentNode.document.id, documentNode),
    })),
  )
}

/**
 * Insert article to specific position, it's the fallback if `tryInsertBeforeWithPivot`
 * User-facing code should use `insertBefore`
 *
 * @private
 */
export function insertBeforeWithStage<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  { index, document }: Omit<WithPivot<Document>, 'pivot'>,
): InsertedChain<Document> {
  const documentNode = makeDocumentNode(document)
  return {
    byId: HashMap.set(self.byId, documentNode.document.id, documentNode),
    byStage: HashMap.modifyAt(self.byStage, index[0], (stageMap) => {
      return pipe(
        stageMap,
        Option.getOrElse(() => HashMap.empty<number, PositionNode>()),
        HashMap.modifyAt(index[1], (positionNode) => {
          return pipe(
            Option.getOrElse(positionNode, () => makePositionNode(index)),
            (node) => {
              invariant(Option.isNone(node._next), 'position should be tail node')
              DoubleLinkedList.insertBefore<Node<Document>>(node, documentNode)
              return node
            },
            Option.some,
          )
        }),
        Option.some,
      )
    }),
  }
}

/**
 * Move article position
 * @param self self
 * @param param1 position info
 * @param param1.document document
 * @param param1.index document index
 * @param param1.origin document original index
 * @param param1.pivot document pivot
 * @returns updated result and restore function
 */
export function moveWithRestore<Document extends BasicDocument = BasicDocument>(
  self: InsertedChain<Document>,
  { document, index, origin, pivot }: WithOriginPosition<Document>,
): [chain: InsertedChain<Document>, restore: (updated: InsertedChain<Document>) => InsertedChain<Document>] {
  const restore = (updated: InsertedChain<Document>) => {
    return pipe(remove(updated, document.id), (chain) => insertBeforeWithStage(chain, { index: origin, document }))
  }

  return [insertBefore(self, { index, document, pivot }), restore]
}

export function getPosition<Document extends BasicDocument = BasicDocument>(
  documentNode: DocumentNode<Document>,
): Option.Option<ArticleIndex.ArticleIndex> {
  return pipe(
    DoubleLinkedList.find<Node, PositionNode>(
      documentNode,
      (node): node is PositionNode => node._tag === 'PositionNode',
    ),
    Option.map((node: PositionNode) => node.pos),
  )
}

/**
 * @private
 */
export function makeDocumentNode<Document extends BasicDocument = BasicDocument>(
  document: Document,
): DocumentNode<Document> {
  return {
    _tag: 'DocumentNode',
    document,
    ...DoubleLinkedList.empty(),
  }
}

/**
 * @private
 */
export function makePositionNode(index: ArticleIndex.ArticleIndex): PositionNode {
  return {
    _tag: 'PositionNode',
    pos: index,
    ...DoubleLinkedList.empty(),
  }
}
