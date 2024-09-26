import { describe, expect, it } from 'vitest'
import { Array, HashMap, Option, pipe } from 'effect'
import { omit } from 'lodash-es'
import * as InsertedChain from '../InsertedChain'
import * as ArticleIndex from '../ArticleIndex'
import * as DoubleLinkedList from '../DoubleLinkedList'

describe('empty', () => {
  it('should create an empty InsertedChain', () => {
    const chain = InsertedChain.empty()
    expect(HashMap.isEmpty(chain.byId)).toBe(true)
    expect(HashMap.isEmpty(chain.byStage)).toBe(true)
  })
})

describe('makeDocumentNode', () => {
  it('should create a DocumentNode with the correct structure', () => {
    const document = { id: 'doc1', title: 'Test Document' }
    const node = InsertedChain.makeDocumentNode(document)

    expect(node._tag).toBe('DocumentNode')
    expect(node.document).toEqual(document)
    expect(Option.isNone(node._previous)).toBe(true)
    expect(Option.isNone(node._next)).toBe(true)
  })
})

describe('makePositionNode', () => {
  it('should create a PositionNode with the correct structure', () => {
    const positionNode = InsertedChain.makePositionNode(ArticleIndex.refine([1, 1]))

    expect(positionNode._tag).toBe('PositionNode')
    expect(positionNode.pos).toEqual([1, 1])
    expect(Option.isNone(positionNode._previous)).toBe(true)
    expect(Option.isNone(positionNode._next)).toBe(true)
  })
})

describe('insertBeforeWithStage', () => {
  it('should insert a document node at the specified stage and position', () => {
    // Initial setup
    let chain = InsertedChain.empty()
    const document1 = { id: 'doc1', title: 'Document 1' }
    const document2 = { id: 'doc2', title: 'Document 2' }

    // Define positions
    const position1 = ArticleIndex.refine([1, 1]) // Stage 1, Position 1
    const position2 = ArticleIndex.refine([1, 2]) // Stage 1, Position 2

    // Insert the first document at position1
    chain = InsertedChain.insertBeforeWithStage(chain, { index: position1, document: document1 })

    // Validate the insertion of the first document
    const stage1Documents = pipe(
      chain.byStage,
      HashMap.get(1),
      Option.getOrElse(() => HashMap.empty<number, InsertedChain.PositionNode>()),
      HashMap.get(1),
      Option.map((x) => Array.make(x)),
      Option.getOrElse(() => []),
    )
    expect(stage1Documents).toHaveLength(1)
    expect(stage1Documents[0].pos).toEqual(position1)
    expect((Option.getOrThrow(stage1Documents[0]._previous) as InsertedChain.DocumentNode).document).toEqual(document1)

    // Insert the second document at position2
    chain = InsertedChain.insertBeforeWithStage(chain, { index: position2, document: document2 })

    // Validate the insertion of the second document
    const stage2Documents = pipe(
      chain.byStage,
      HashMap.get(1),
      Option.getOrElse(() => HashMap.empty<number, InsertedChain.PositionNode>()),
      HashMap.get(2),
      Option.map((x) => Array.make(x)),
      Option.getOrElse(() => []),
    )
    expect(stage2Documents).toHaveLength(1)
    expect(stage2Documents[0].pos).toEqual(position2)
    expect((Option.getOrThrow(stage2Documents[0]._previous) as InsertedChain.DocumentNode).document).toEqual(document2)

    expect(HashMap.size(chain.byStage)).toBe(1)
    expect(pipe(chain.byStage, HashMap.get(1), Option.getOrThrow, HashMap.size)).toBe(2)
    expect(HashMap.size(chain.byId)).toBe(2)

    expect(chain).toMatchSnapshot()
  })
})

describe('tryInsertBeforeWithPivot', () => {
  it('should insert a document node before a pivot node if the pivot exists', () => {
    // Initial setup
    const chain = InsertedChain.empty()
    const pivotDocument = { id: 'pivotDoc', title: 'Pivot Document' }
    const newDocument = { id: 'newDoc', title: 'New Document' }

    // Create and add pivot node to the chain
    const pivotNode = InsertedChain.makeDocumentNode(pivotDocument)
    chain.byId = HashMap.set(chain.byId, pivotDocument.id, pivotNode)

    // Attempt to insert the new document before the pivot
    const result = InsertedChain.tryInsertBeforeWithPivot(chain, {
      pivot: Option.some(pivotDocument.id),
      document: newDocument,
    })

    // Verify that the insertion was successful
    expect(Option.isSome(result)).toBe(true)
    const updatedChain = Option.getOrThrow(result)

    // Check that the new document node is correctly inserted before the pivot
    const insertedNode = Option.getOrThrow(HashMap.get(updatedChain.byId, newDocument.id))
    expect(DoubleLinkedList.toArray(insertedNode).map((x) => x.document)).toMatchInlineSnapshot(`
      [
        {
          "id": "newDoc",
          "title": "New Document",
        },
        {
          "id": "pivotDoc",
          "title": "Pivot Document",
        },
      ]
    `)
  })

  it('should return None if the pivot node does not exist', () => {
    // Initial setup with empty chain
    const chain = InsertedChain.empty()
    const document = { id: 'newDoc', title: 'New Document' }

    // Attempt to insert before a non-existent pivot
    const result = InsertedChain.tryInsertBeforeWithPivot(chain, { pivot: Option.some('nonExistentPivot'), document })

    // Verify that the insertion did not occur
    expect(Option.isNone(result)).toBe(true)
  })
})

describe('insertBefore', () => {
  it('should insert a document before a specified pivot if the pivot exists', () => {
    // Initial setup
    let chain = InsertedChain.empty()
    const pivotDocument = { id: 'pivotDoc', title: 'Pivot Document' }
    const newDocument = { id: 'newDoc', title: 'New Document' }

    // Create and add pivot node to the chain
    const pivotNode = InsertedChain.makeDocumentNode(pivotDocument)
    chain.byId = HashMap.set(chain.byId, pivotDocument.id, pivotNode)

    // Attempt to insert the new document before the pivot
    chain = InsertedChain.insertBefore(chain, {
      pivot: Option.some(pivotDocument.id),
      index: ArticleIndex.refine([1, 1]),
      document: newDocument,
    })

    // Verify the new document is correctly inserted before the pivot
    const insertedNode = Option.getOrThrow(HashMap.get(chain.byId, newDocument.id))

    expect(DoubleLinkedList.toArray(insertedNode).map((x) => x.document)).toMatchInlineSnapshot(`
      [
        {
          "id": "newDoc",
          "title": "New Document",
        },
        {
          "id": "pivotDoc",
          "title": "Pivot Document",
        },
      ]
    `)
  })

  it('should insert a document at a specific stage and position if pivot does not exist', () => {
    // Initial setup
    let chain = InsertedChain.empty()
    const newDocument = { id: 'newDoc', title: 'New Document' }
    const stagePosition = ArticleIndex.refine([1, 1]) // Example stage and position

    // Attempt to insert the new document at the specified stage and position
    chain = InsertedChain.insertBefore(chain, {
      index: stagePosition,
      document: newDocument,
      pivot: Option.some('nonExistentPivot'),
    })

    // Verify the new document is correctly inserted at the specified stage and position
    const insertedNode = Option.getOrThrow(HashMap.get(chain.byId, newDocument.id))

    expect(DoubleLinkedList.toArray(insertedNode).map((x) => omit(x, ['_previous', '_next']))).toMatchInlineSnapshot(`
      [
        {
          "_tag": "DocumentNode",
          "document": {
            "id": "newDoc",
            "title": "New Document",
          },
        },
        {
          "_tag": "PositionNode",
          "pos": [
            1,
            1,
          ],
        },
      ]
    `)
  })

  it('can handle multiple insert chain with pivot', () => {
    const documents = Array.makeBy(3, (i) => ({
      id: `doc${i + 1}`,
      title: `Document ${i + 1}`,
    }))

    let chain = InsertedChain.empty()
    for (let i = 0; i < documents.length; i += 1) {
      chain = InsertedChain.insertBefore(chain, {
        index: ArticleIndex.refine([1, 1]),
        document: documents[i],
        pivot: Option.fromNullable(documents[i - 1]?.id),
      })
    }

    expect(pipe(chain.byId, HashMap.size)).toBe(3)
    expect(pipe(chain.byStage, HashMap.size)).toBe(1)
    expect(pipe(chain.byStage, HashMap.get(1), Option.getOrThrow, HashMap.size)).toBe(1)
    expect(
      pipe(
        chain.byStage,
        HashMap.get(1),
        Option.getOrThrow,
        HashMap.get(1),
        Option.getOrThrow,
        DoubleLinkedList.toArray<InsertedChain.Node>,
        Array.map((x) => (x as InsertedChain.DocumentNode).document),
      ),
    ).toEqual([
      // we are using insertBefore, thus, the order is reversed
      ...Array.reverse(documents),
      // PositionNode
      undefined,
    ])
  })

  it('can handle multiple insert without pivot', () => {
    const documents = Array.makeBy(3, (i) => ({
      id: `doc${i + 1}`,
      title: `Document ${i + 1}`,
    }))

    const chain = Array.reduce(documents, InsertedChain.empty(), (chain, document) =>
      InsertedChain.insertBefore(chain, {
        index: ArticleIndex.refine([1, 1]),
        document,
        pivot: Option.none(),
      }),
    )

    expect(pipe(chain.byId, HashMap.size)).toBe(3)
    expect(pipe(chain.byStage, HashMap.size)).toBe(1)
    expect(pipe(chain.byStage, HashMap.get(1), Option.getOrThrow, HashMap.size)).toBe(1)
    expect(
      pipe(
        chain.byStage,
        HashMap.get(1),
        Option.getOrThrow,
        HashMap.get(1),
        Option.getOrThrow,
        DoubleLinkedList.toArray<InsertedChain.Node>,
        Array.map((x) => (x as InsertedChain.DocumentNode).document),
      ),
    ).toEqual([
      // expect to be same order as we keep insert at the same place
      ...documents,
      // PositionNode
      undefined,
    ])
  })

  it('should handle insert a document to different position', () => {
    let chain = InsertedChain.empty()
    chain = InsertedChain.insertBefore(chain, {
      document: {
        id: '1',
      },
      index: ArticleIndex.refine([0, 0]),
      pivot: Option.none(),
    })

    chain = InsertedChain.insertBefore(chain, {
      document: {
        id: '1',
      },
      index: ArticleIndex.refine([1, 0]),
      pivot: Option.none(),
    })

    const stage0Articles = pipe(
      chain.byStage,
      HashMap.get(0),
      Option.getOrThrow,
      HashMap.get(0),
      Option.getOrThrow,
      DoubleLinkedList.toArray<InsertedChain.Node>,
      Array.filter((x): x is InsertedChain.DocumentNode => x._tag === 'DocumentNode'),
    )

    expect(stage0Articles).toHaveLength(0)

    const stage1Articles = pipe(
      chain.byStage,
      HashMap.get(1),
      Option.getOrThrow,
      HashMap.get(0),
      Option.getOrThrow,
      DoubleLinkedList.toArray<InsertedChain.Node>,
      Array.filter((x): x is InsertedChain.DocumentNode => x._tag === 'DocumentNode'),
    )

    expect(stage1Articles).toHaveLength(1)
  })
})

describe('remove', () => {
  it('should remove document from chain', () => {
    let chain = InsertedChain.empty()
    chain = InsertedChain.insertBefore(chain, {
      document: {
        id: '1',
      },
      index: ArticleIndex.refine([0, 0]),
      pivot: Option.none(),
    })

    chain = InsertedChain.remove(chain, '1')

    expect(pipe(chain.byId, HashMap.size)).toBe(0)

    const stage0Articles = pipe(
      chain.byStage,
      HashMap.get(0),
      Option.getOrThrow,
      HashMap.get(0),
      Option.getOrThrow,
      DoubleLinkedList.toArray<InsertedChain.Node>,
      Array.filter((x): x is InsertedChain.DocumentNode => x._tag === 'DocumentNode'),
    )

    expect(stage0Articles).toHaveLength(0)
  })
})

describe('getRemainingAfter', () => {
  it('should return all article after specific position', () => {
    let chain = InsertedChain.empty()
    chain = InsertedChain.insertBefore(chain, {
      document: {
        id: '1',
      },
      index: ArticleIndex.refine([0, 0]),
      pivot: Option.none(),
    })

    chain = InsertedChain.insertBefore(chain, {
      document: {
        id: '2',
      },
      index: ArticleIndex.refine([0, 1]),
      pivot: Option.none(),
    })

    const remaining = InsertedChain.getRemainingAfter(chain, ArticleIndex.refine([0, 1]))

    expect(remaining).toEqual([
      {
        id: '2',
      },
    ])
  })
})
