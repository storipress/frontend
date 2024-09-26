import { Array, Boolean, Function, HashMap, HashSet, Option, Tuple, identity, pipe } from 'effect'
import type { StageQueryResult, TypesenseArticleDocument } from '../definition'
import * as ArticleIndex from './ArticleIndex'
import * as InsertedChain from './InsertedChain'
import { ErrorKind, invariant } from './errors'
import { getLocalId } from '.'
import { useDebugLog } from '~/composables'

export interface BasicDocument {
  id: string
  updated_at: number
}

export interface WithIndex<Document extends BasicDocument = TypesenseArticleDocument> {
  index: ArticleIndex.ArticleIndex
  document: Document
}

export interface WithPivot<Document extends BasicDocument = TypesenseArticleDocument> extends WithIndex<Document> {
  pivot: string
}

export interface LocalDocumentItem<Document extends BasicDocument> {
  stage: number
  index: number
  document: Document
}

/**
 * Local cache store
 */
export interface LocalDocument<Document extends BasicDocument = TypesenseArticleDocument> {
  // insert chain is specific for insert operation
  inserted: InsertedChain.InsertedChain<Document>

  // article id -> Document
  modified: HashMap.HashMap<string, Document>

  // article id -> updated_at
  deleted: HashMap.HashMap<string, number>
}

const debug = useDebugLog('LocalDocument')

export function empty<Document extends BasicDocument = TypesenseArticleDocument>(): LocalDocument<Document> {
  return {
    inserted: InsertedChain.empty(),
    modified: HashMap.empty(),
    deleted: HashMap.empty(),
  }
}

/**
 * Combine `LocalDocument` with `StageQueryResult[]`
 *
 * @param local
 * @param source
 * @returns combined `StageQueryResult[]`
 */
export function combineWithSource<Document extends BasicDocument = TypesenseArticleDocument>(
  local: LocalDocument<Document>,
  source: StageQueryResult[],
) {
  // insert and deleted could affect stage length
  const affectLengthSet = pipe(HashMap.keySet(local.inserted.byId), HashSet.union(HashMap.keySet(local.deleted)))

  // we will ignore all the data which also available in local, here we collect all the local documents
  const inLocal = pipe(affectLengthSet, HashSet.union(HashMap.keySet(local.modified)))

  return pipe(
    source,
    Array.map((queryResult, stage) => {
      let includedArticles = 0

      const flattenDocument = queryResult.hitsPerPage.flat(1)
      const mergedWithInserted = pipe(
        flattenDocument,
        Array.map((document, index) => Tuple.make(index, document)),
        Array.flatMap(([index, doc]) => {
          // If current document is modified -> choose modified version
          // If current document is not modified -> return current document if not in local record
          // In local record means:
          // 1. It's move to another stage
          // 2. It's deleted
          const document = pipe(
            HashMap.get(local.modified, doc.id),
            Option.orElse(() => (HashSet.has(inLocal, doc.id) ? Option.none() : Option.some(doc))),
          )

          const prepareInserted = InsertedChain.getChainByIndex(local.inserted, ArticleIndex.make(stage, index))

          includedArticles += Array.length(prepareInserted)

          return [
            // Put all inserted document before current index
            // Here we actually priority `inserted` operation over `deleted`, so it's ok if we delete then insert
            ...prepareInserted,
            // Put current document
            ...Option.toArray(document),
          ]
        }),
      )

      // Find all documents that's not inserted yet
      const remainingInserted = InsertedChain.getRemainingAfter<Document>(
        local.inserted,
        ArticleIndex.make(stage, flattenDocument.length),
      )

      const documents = [...mergedWithInserted, ...remainingInserted]
      // This will include document that is insert to same stage
      // As `includedArticles` will also include those article, we will cause duplicate
      const excludedDocuments = pipe(
        HashSet.fromIterable(Array.map(flattenDocument, (x) => x.id)),
        HashSet.intersection(affectLengthSet),
        HashSet.size,
      )
      // Compute final total amount, we use the total from Typesense as it's the expected total length
      // If the total length is incorrect, it will break infinite scrolling
      const mergedTotal = queryResult.total + includedArticles + remainingInserted.length - excludedDocuments

      invariant(documents.length <= mergedTotal, ErrorKind.IncorrectLocalArticleLength)

      return {
        ...queryResult,
        total: mergedTotal,
        hitsPerPage: Array.chunksOf(documents, 10),
      }
    }),
  )
}

export function remove<Document extends BasicDocument = TypesenseArticleDocument>(
  self: LocalDocument<Document>,
  document: Document,
): LocalDocument<Document> {
  return {
    inserted: InsertedChain.remove(self.inserted, document.id),
    modified: HashMap.remove(self.modified, document.id),
    deleted: HashMap.remove(self.deleted, document.id),
  }
}

export function removeOutdated<Document extends BasicDocument = TypesenseArticleDocument>(
  self: LocalDocument<Document>,
  source: StageQueryResult[],
): LocalDocument<Document> {
  for (const queryResult of source) {
    for (const page of queryResult.hitsPerPage) {
      for (const document of page) {
        self = removeAllIfNewer(self, document)
      }
    }
  }
  return self
}

function removeAllIfNewer<Document extends BasicDocument = TypesenseArticleDocument>(
  local: LocalDocument<Document>,
  document: BasicDocument,
): LocalDocument<Document> {
  local = {
    ...local,
    inserted: InsertedChain.modifyAt(local.inserted, document.id, (local) => {
      return pipe(
        Option.some(local),
        Option.filter((local) => local.updated_at > document.updated_at),
      )
    }),
  }
  local = removeIfNewer(local, 'modified', (item) => item.updated_at, document)
  local = removeIfNewer(local, 'deleted', (item) => item, document)
  return local
}

function removeIfNewer<K extends 'modified' | 'deleted', Document extends BasicDocument = TypesenseArticleDocument>(
  local: LocalDocument<Document>,
  key: K,
  getUpdateTime: (value: HashMap.HashMap.Value<LocalDocument<Document>[K]>) => number,
  document: BasicDocument,
) {
  type ValueType = HashMap.HashMap.Value<LocalDocument<Document>[K]>
  return pipe(
    HashMap.get(local[key] as HashMap.HashMap<string, unknown>, document.id),
    Option.filter((item) => getUpdateTime(item as ValueType) <= document.updated_at),
    Option.map((): LocalDocument<Document> => {
      debug('removeOutdated outdated', document)
      const removed = HashMap.remove(
        local[key] as HashMap.HashMap<string, unknown>,
        document.id,
      ) as unknown as ValueType
      return {
        ...local,
        [key]: removed,
      }
    }),
    Option.getOrElse(() => local),
  )
}

/**
 * Insert document to local cache before specific pivot
 *
 * @group Insert
 * @notice If modify this function, make sure check the `Insert` group function as well
 * @returns updated local cache
 */
function _insertBefore<Document extends BasicDocument = TypesenseArticleDocument>(
  local: LocalDocument<Document>,
  { document, pivot, index }: WithPivot<Document>,
): LocalDocument<Document> {
  debug('insertBefore', document, index, pivot)
  return {
    deleted: local.deleted,
    ...applyModifyToInsert(
      {
        inserted: InsertedChain.insertBefore(local.inserted, {
          document,
          index,
          pivot: Option.some(pivot),
        }),
        modified: local.modified,
      },
      document,
    ),
  }
}

/**
 * Insert document to local cache before specific pivot
 *
 * @group Insert
 * @notice If modify this function, make sure check the `Insert` group function as well
 * @returns updated local cache
 */
export const insertBefore = Function.dual(2, _insertBefore) as {
  <Document extends BasicDocument = TypesenseArticleDocument>(
    local: LocalDocument<Document>,
    document: WithPivot<Document>,
  ): LocalDocument<Document>
  <Document extends BasicDocument = TypesenseArticleDocument>(
    document: WithPivot<Document>,
  ): (local: LocalDocument<Document>) => LocalDocument<Document>
}

/**
 * Insert document to local cache
 *
 * @group Insert
 * @notice If modify this function, make sure check the `Insert` group function as well
 * @returns updated local cache
 */
function _insert<Document extends BasicDocument = TypesenseArticleDocument>(
  local: LocalDocument<Document>,
  { document, index }: WithIndex<Document>,
): LocalDocument<Document> {
  debug('insert', document, index)
  return {
    ...local,
    ...applyModifyToInsert(
      {
        inserted: InsertedChain.insertBefore(local.inserted, {
          document,
          index,
          pivot: Option.none(),
        }),
        modified: local.modified,
      },
      document,
    ),
  }
}

/**
 * Insert document to local cache
 *
 * @group Insert
 * @notice If modify this function, make sure check the `Insert` group function as well
 * @returns updated local cache
 */
export const insert = Function.dual(2, _insert) as {
  <Document extends BasicDocument = TypesenseArticleDocument>(
    local: LocalDocument<Document>,
    document: WithIndex<Document>,
  ): LocalDocument<Document>
  <Document extends BasicDocument = TypesenseArticleDocument>(
    document: WithIndex<Document>,
  ): (local: LocalDocument<Document>) => LocalDocument<Document>
}

export interface InsertManyInput<Document extends BasicDocument = TypesenseArticleDocument> {
  documents: Document[]
  index: ArticleIndex.ArticleIndex
}

/**
 * Insert many document to same position
 *
 * @group Insert
 * @notice If modify this function, make sure check the `Insert` group function as well
 * @param self local cache
 * @param input documents prepare to insert and insert position
 * @param input.documents documents prepare to insert
 * @param input.index insert position
 * @returns updated local cache
 */
function _insertMany<Document extends BasicDocument = TypesenseArticleDocument>(
  self: LocalDocument<Document>,
  { documents, index }: InsertManyInput<Document>,
): LocalDocument<Document> {
  return Array.reduce(documents, self, (self, item) => {
    return _insert(self, {
      document: item,
      index,
    })
  })
}

/**
 * Insert many document to same position
 *
 * @group Insert
 * @notice If modify this function, make sure check the `Insert` group function as well
 * @param self local cache
 * @param input documents prepare to insert and insert position
 * @param input.documents documents prepare to insert
 * @param input.index insert position
 * @returns updated local cache
 */
export const insertMany = Function.dual(2, _insertMany) as {
  <Document extends BasicDocument = TypesenseArticleDocument>(
    self: LocalDocument<Document>,
    documents: InsertManyInput<Document>,
  ): LocalDocument<Document>
  <Document extends BasicDocument = TypesenseArticleDocument>(
    documents: InsertManyInput<Document>,
  ): (self: LocalDocument<Document>) => LocalDocument<Document>
}

function _update<Document extends BasicDocument>(
  local: LocalDocument<Document>,
  document: Document,
): LocalDocument<Document> {
  debug('update', document)

  if (HashMap.has(local.inserted.byId, document.id)) {
    return {
      ...local,
      // If it's already in local document, we need to modify the local version instead of add a modify record
      inserted: InsertedChain.modifyAt(local.inserted, document.id, () =>
        Option.some({
          ...document,
        }),
      ),
    }
  }

  return {
    ...local,
    modified: HashMap.set(local.modified, document.id, document),
  }
}

export const update = Function.dual(2, _update) as {
  <Document extends BasicDocument = TypesenseArticleDocument>(
    local: LocalDocument<Document>,
    document: Document,
  ): LocalDocument<Document>
  <Document extends BasicDocument = TypesenseArticleDocument>(
    document: Document,
  ): (local: LocalDocument<Document>) => LocalDocument<Document>
}

function _delete<Document extends BasicDocument = TypesenseArticleDocument>(
  local: LocalDocument<Document>,
  document: Document,
): LocalDocument<Document> {
  debug('delete', document)
  return {
    // in delete, we also need to remove modified record
    inserted: InsertedChain.remove(local.inserted, document.id),
    modified: HashMap.remove(local.modified, document.id),
    deleted: HashMap.set(local.deleted, document.id, document.updated_at),
  }
}

const delete_ = Function.dual(2, _delete) as {
  <Document extends BasicDocument = TypesenseArticleDocument>(
    local: LocalDocument<Document>,
    document: Document,
  ): LocalDocument<Document>
  <Document extends BasicDocument = TypesenseArticleDocument>(
    document: Document,
  ): (local: LocalDocument<Document>) => LocalDocument<Document>
}

export { delete_ as delete }

export function createWith<Document extends BasicDocument>(
  self: LocalDocument<Document>,
  { document, index }: WithIndex<Document>,
): [string, LocalDocument<Document>] {
  const localId = getLocalId()
  const local = insert(self, {
    document: {
      ...document,
      id: localId,
    },
    index,
  })

  return [localId, local]
}

export function updateId<Document extends BasicDocument>(
  self: LocalDocument<Document>,
  oldId: string,
  newId: string,
): LocalDocument<Document> {
  return {
    inserted: InsertedChain.updateId(self.inserted, oldId, newId),
    modified: updateMapId(self.modified, oldId, newId, (x) => ({
      ...x,
      id: newId,
    })),
    deleted: updateMapId(self.deleted, oldId, newId),
  }
}

function updateMapId<Value>(
  map: HashMap.HashMap<string, Value>,
  oldId: string,
  newId: string,
  withNewId: (value: Value) => Value = identity,
): HashMap.HashMap<string, Value> {
  const value = HashMap.get(map, oldId)

  if (Option.isNone(value)) {
    return map
  }

  return pipe(map, HashMap.remove(oldId), HashMap.set(newId, withNewId(value.value)))
}

type Restorable<Document extends BasicDocument> = [
  local: LocalDocument<Document>,
  restore: (self: LocalDocument<Document>) => LocalDocument<Document>,
]

/**
 * Create restorable changes
 *
 * ! This function can't not undo insert operation
 *
 * @param self
 * @param action
 * @returns
 */
export function withRestore<Document extends BasicDocument = TypesenseArticleDocument>(
  self: LocalDocument<Document>,
  action: (local: LocalDocument<Document>) => LocalDocument<Document>,
): Restorable<Document> {
  const changed = action(empty())
  const original = self
  // here we use closure trick to remember changed values before and after
  const restore = (self: LocalDocument<Document>): LocalDocument<Document> => {
    return {
      inserted: self.inserted,
      modified: restoreMap(self.modified, original.modified, changed.modified),
      deleted: restoreMap(self.deleted, original.deleted, changed.deleted),
    }
  }

  const applied: LocalDocument<Document> = {
    inserted: self.inserted,
    modified: HashMap.union(self.modified, changed.modified),
    deleted: HashMap.union(self.deleted, changed.deleted),
  }

  return [applied, restore]
}

/**
 * Move article to another place and return a restore function
 *
 * @group Insert
 * @notice If modify this function, make sure check the `Insert` group function as well
 * @param self
 * @param documentWithOrigin
 * @returns updated local cache
 */
export function moveWithRestore<Document extends BasicDocument = TypesenseArticleDocument>(
  self: LocalDocument<Document>,
  documentWithOrigin: InsertedChain.WithOriginPosition<Document>,
): Restorable<Document> {
  const [inserted, restore] = InsertedChain.moveWithRestore(self.inserted, documentWithOrigin)
  const _restore = (self: LocalDocument<Document>): LocalDocument<Document> => {
    return {
      inserted: restore(self.inserted),
      modified: self.modified,
      deleted: self.deleted,
    }
  }

  return [
    {
      deleted: self.deleted,
      ...applyModifyToInsert(
        {
          inserted,
          modified: self.modified,
        },
        documentWithOrigin.document,
      ),
    },
    _restore,
  ]
}

function restoreMap<Value>(
  current: HashMap.HashMap<string, Value>,
  original: HashMap.HashMap<string, Value>,
  changed: HashMap.HashMap<string, Value>,
): HashMap.HashMap<string, Value> {
  return pipe(
    current,
    HashMap.filterMap((value, key) =>
      Boolean.match(HashMap.has(changed, key), {
        // we have modified, revert to original
        onTrue: () => HashMap.get(original, key),
        onFalse: () => Option.some(value),
      }),
    ),
  )
}

/**
 * This function will check if there already have a local modified when inserting
 * If found, it will apply the local modified on the new inserted value
 * @internal
 */
function applyModifyToInsert<Document extends BasicDocument = TypesenseArticleDocument>(
  self: Pick<LocalDocument<Document>, 'inserted' | 'modified'>,
  inserted: Document,
): Pick<LocalDocument<Document>, 'inserted' | 'modified'> {
  if (HashMap.has(self.modified, inserted.id)) {
    return {
      modified: HashMap.remove(self.modified, inserted.id),
      // If it's already in local document, we need to modify the local version instead of add a modify record
      inserted: InsertedChain.modifyAt(self.inserted, inserted.id, () =>
        Option.some({
          ...inserted,
        }),
      ),
    }
  }

  // If not found, do nothing
  return self
}
