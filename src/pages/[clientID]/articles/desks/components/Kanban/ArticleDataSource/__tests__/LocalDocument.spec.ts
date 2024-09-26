import { describe, expect, it } from 'vitest'
import { HashMap, Option, pipe } from 'effect'
import * as LocalDocument from '../LocalDocument'
import { emptyArticle } from '../../_test-helpers'
import type { BasicDocument } from '../LocalDocument'
import type { StageQueryResult, TypesenseArticleDocument } from '../../definition'
import * as ArticleIndex from '../ArticleIndex'

describe('insert', () => {
  it('should insert', () => {
    const local = LocalDocument.empty<LocalDocument.BasicDocument>()

    expect(
      LocalDocument.insert(local, {
        document: {
          id: '1',
          updated_at: 0,
        },
        index: ArticleIndex.refine([0, 1]),
      }),
    ).toMatchInlineSnapshot(`
      {
        "deleted": {
          "_id": "HashMap",
          "values": [],
        },
        "inserted": {
          "byId": {
            "_id": "HashMap",
            "values": [
              [
                "1",
                {
                  "_next": {
                    "_id": "Option",
                    "_tag": "Some",
                    "value": {
                      "_next": {
                        "_id": "Option",
                        "_tag": "None",
                      },
                      "_previous": {
                        "_id": "Option",
                        "_tag": "Some",
                        "value": [Circular],
                      },
                      "_tag": "PositionNode",
                      "pos": [
                        0,
                        1,
                      ],
                    },
                  },
                  "_previous": {
                    "_id": "Option",
                    "_tag": "None",
                  },
                  "_tag": "DocumentNode",
                  "document": {
                    "id": "1",
                    "updated_at": 0,
                  },
                },
              ],
            ],
          },
          "byStage": {
            "_id": "HashMap",
            "values": [
              [
                0,
                {
                  "_id": "HashMap",
                  "values": [
                    [
                      1,
                      {
                        "_next": {
                          "_id": "Option",
                          "_tag": "None",
                        },
                        "_previous": {
                          "_id": "Option",
                          "_tag": "Some",
                          "value": {
                            "_next": {
                              "_id": "Option",
                              "_tag": "Some",
                              "value": [Circular],
                            },
                            "_previous": {
                              "_id": "Option",
                              "_tag": "None",
                            },
                            "_tag": "DocumentNode",
                            "document": {
                              "id": "1",
                              "updated_at": 0,
                            },
                          },
                        },
                        "_tag": "PositionNode",
                        "pos": [
                          0,
                          1,
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        },
        "modified": {
          "_id": "HashMap",
          "values": [],
        },
      }
    `)

    expect(
      LocalDocument.insert(local, {
        document: {
          id: '2',
          updated_at: 0,
        },
        index: ArticleIndex.refine([0, 1]),
      }),
    ).toMatchInlineSnapshot(`
      {
        "deleted": {
          "_id": "HashMap",
          "values": [],
        },
        "inserted": {
          "byId": {
            "_id": "HashMap",
            "values": [
              [
                "2",
                {
                  "_next": {
                    "_id": "Option",
                    "_tag": "Some",
                    "value": {
                      "_next": {
                        "_id": "Option",
                        "_tag": "None",
                      },
                      "_previous": {
                        "_id": "Option",
                        "_tag": "Some",
                        "value": [Circular],
                      },
                      "_tag": "PositionNode",
                      "pos": [
                        0,
                        1,
                      ],
                    },
                  },
                  "_previous": {
                    "_id": "Option",
                    "_tag": "None",
                  },
                  "_tag": "DocumentNode",
                  "document": {
                    "id": "2",
                    "updated_at": 0,
                  },
                },
              ],
            ],
          },
          "byStage": {
            "_id": "HashMap",
            "values": [
              [
                0,
                {
                  "_id": "HashMap",
                  "values": [
                    [
                      1,
                      {
                        "_next": {
                          "_id": "Option",
                          "_tag": "None",
                        },
                        "_previous": {
                          "_id": "Option",
                          "_tag": "Some",
                          "value": {
                            "_next": {
                              "_id": "Option",
                              "_tag": "Some",
                              "value": [Circular],
                            },
                            "_previous": {
                              "_id": "Option",
                              "_tag": "None",
                            },
                            "_tag": "DocumentNode",
                            "document": {
                              "id": "2",
                              "updated_at": 0,
                            },
                          },
                        },
                        "_tag": "PositionNode",
                        "pos": [
                          0,
                          1,
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        },
        "modified": {
          "_id": "HashMap",
          "values": [],
        },
      }
    `)
  })
})

describe('delete', () => {
  it('should delete', () => {
    const local = pipe(
      LocalDocument.empty<LocalDocument.BasicDocument>(),
      LocalDocument.insert({
        index: ArticleIndex.refine([0, 1]),
        document: {
          id: '1',
          updated_at: 0,
        },
      }),
    )

    expect(
      LocalDocument.delete(local, {
        id: '1',
        updated_at: 0,
      }),
    ).toMatchInlineSnapshot(`
      {
        "deleted": {
          "_id": "HashMap",
          "values": [
            [
              "1",
              0,
            ],
          ],
        },
        "inserted": {
          "byId": {
            "_id": "HashMap",
            "values": [],
          },
          "byStage": {
            "_id": "HashMap",
            "values": [
              [
                0,
                {
                  "_id": "HashMap",
                  "values": [
                    [
                      1,
                      {
                        "_next": {
                          "_id": "Option",
                          "_tag": "None",
                        },
                        "_previous": {
                          "_id": "Option",
                          "_tag": "None",
                        },
                        "_tag": "PositionNode",
                        "pos": [
                          0,
                          1,
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        },
        "modified": {
          "_id": "HashMap",
          "values": [],
        },
      }
    `)
  })
})

describe('update', () => {
  it('should update', () => {
    const local = pipe(
      LocalDocument.empty<LocalDocument.BasicDocument>(),
      LocalDocument.insert({
        index: ArticleIndex.refine([0, 1]),
        document: {
          id: '1',
          updated_at: 0,
        },
      }),
    )

    expect(
      LocalDocument.update(local, {
        id: '2',
        updated_at: 100,
      }),
    ).toMatchInlineSnapshot(`
      {
        "deleted": {
          "_id": "HashMap",
          "values": [],
        },
        "inserted": {
          "byId": {
            "_id": "HashMap",
            "values": [
              [
                "1",
                {
                  "_next": {
                    "_id": "Option",
                    "_tag": "Some",
                    "value": {
                      "_next": {
                        "_id": "Option",
                        "_tag": "None",
                      },
                      "_previous": {
                        "_id": "Option",
                        "_tag": "Some",
                        "value": [Circular],
                      },
                      "_tag": "PositionNode",
                      "pos": [
                        0,
                        1,
                      ],
                    },
                  },
                  "_previous": {
                    "_id": "Option",
                    "_tag": "None",
                  },
                  "_tag": "DocumentNode",
                  "document": {
                    "id": "1",
                    "updated_at": 0,
                  },
                },
              ],
            ],
          },
          "byStage": {
            "_id": "HashMap",
            "values": [
              [
                0,
                {
                  "_id": "HashMap",
                  "values": [
                    [
                      1,
                      {
                        "_next": {
                          "_id": "Option",
                          "_tag": "None",
                        },
                        "_previous": {
                          "_id": "Option",
                          "_tag": "Some",
                          "value": {
                            "_next": {
                              "_id": "Option",
                              "_tag": "Some",
                              "value": [Circular],
                            },
                            "_previous": {
                              "_id": "Option",
                              "_tag": "None",
                            },
                            "_tag": "DocumentNode",
                            "document": {
                              "id": "1",
                              "updated_at": 0,
                            },
                          },
                        },
                        "_tag": "PositionNode",
                        "pos": [
                          0,
                          1,
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        },
        "modified": {
          "_id": "HashMap",
          "values": [
            [
              "2",
              {
                "id": "2",
                "updated_at": 100,
              },
            ],
          ],
        },
      }
    `)
  })

  it('should update if already exists in local', () => {
    const local = pipe(
      LocalDocument.empty<LocalDocument.BasicDocument>(),
      LocalDocument.insert({
        index: ArticleIndex.refine([0, 1]),
        document: {
          id: '1',
          updated_at: 0,
        },
      }),
    )

    expect(
      LocalDocument.update(local, {
        id: '1',
        updated_at: 100,
      }),
    ).toMatchInlineSnapshot(`
      {
        "deleted": {
          "_id": "HashMap",
          "values": [],
        },
        "inserted": {
          "byId": {
            "_id": "HashMap",
            "values": [
              [
                "1",
                {
                  "_next": {
                    "_id": "Option",
                    "_tag": "Some",
                    "value": {
                      "_next": {
                        "_id": "Option",
                        "_tag": "None",
                      },
                      "_previous": {
                        "_id": "Option",
                        "_tag": "Some",
                        "value": [Circular],
                      },
                      "_tag": "PositionNode",
                      "pos": [
                        0,
                        1,
                      ],
                    },
                  },
                  "_previous": {
                    "_id": "Option",
                    "_tag": "None",
                  },
                  "_tag": "DocumentNode",
                  "document": {
                    "id": "1",
                    "updated_at": 100,
                  },
                },
              ],
            ],
          },
          "byStage": {
            "_id": "HashMap",
            "values": [
              [
                0,
                {
                  "_id": "HashMap",
                  "values": [
                    [
                      1,
                      {
                        "_next": {
                          "_id": "Option",
                          "_tag": "None",
                        },
                        "_previous": {
                          "_id": "Option",
                          "_tag": "Some",
                          "value": {
                            "_next": {
                              "_id": "Option",
                              "_tag": "Some",
                              "value": [Circular],
                            },
                            "_previous": {
                              "_id": "Option",
                              "_tag": "None",
                            },
                            "_tag": "DocumentNode",
                            "document": {
                              "id": "1",
                              "updated_at": 100,
                            },
                          },
                        },
                        "_tag": "PositionNode",
                        "pos": [
                          0,
                          1,
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        },
        "modified": {
          "_id": "HashMap",
          "values": [],
        },
      }
    `)
  })
})

describe('combineWithSource', () => {
  it('should combine with inserted', () => {
    const local = pipe(
      LocalDocument.empty(),
      LocalDocument.insert({
        index: ArticleIndex.refine([0, 0]),
        document: {
          ...emptyArticle,
          id: '2',
        },
      }),
    )

    expect(
      LocalDocument.combineWithSource(local, [
        {
          query: {
            q: '',
            query_by: 'title',
            page: 1,
          },
          total: 1,
          stageKey: '1-default',
          hitsPerPage: [
            [
              {
                ...emptyArticle,
                id: '1',
              },
            ],
          ],
        },
      ]),
    ).toMatchSnapshot()
  })

  it('should combine with deleted', () => {
    const local = pipe(
      LocalDocument.empty(),
      LocalDocument.delete({
        ...emptyArticle,
        id: '1',
      }),
    )

    expect(
      LocalDocument.combineWithSource(local, [
        {
          query: {
            q: '',
            query_by: 'title',
            page: 1,
          },
          total: 1,
          stageKey: '1-default',
          hitsPerPage: [
            [
              {
                ...emptyArticle,
                id: '1',
              },
            ],
          ],
        },
      ]),
    ).toMatchSnapshot()
  })

  it('should combine with update', () => {
    const local = pipe(
      LocalDocument.empty(),
      LocalDocument.update({
        ...emptyArticle,
        title: 'New title',
        id: '1',
      }),
    )

    expect(
      LocalDocument.combineWithSource(local, [
        {
          query: {
            q: '',
            query_by: 'title',
            page: 1,
          },
          total: 1,
          stageKey: '1-default',
          hitsPerPage: [
            [
              {
                ...emptyArticle,
                id: '1',
              },
            ],
          ],
        },
      ]),
    ).toMatchSnapshot()
  })

  it('should handle move across stage', () => {
    const local = pipe(
      LocalDocument.empty(),
      LocalDocument.insert({
        index: ArticleIndex.refine([1, 0]),
        document: {
          ...emptyArticle,
          title: 'Move article',
          id: '1',
        },
      }),
    )

    expect(
      LocalDocument.combineWithSource(local, [
        {
          query: {
            q: '',
            query_by: 'title',
            page: 1,
          },
          total: 1,
          stageKey: '1-default',
          hitsPerPage: [
            [
              {
                ...emptyArticle,
                id: '1',
              },
            ],
          ],
        },
        {
          query: {
            q: '',
            query_by: 'title',
            page: 1,
          },
          total: 1,
          stageKey: '2-default',
          hitsPerPage: [
            [
              {
                ...emptyArticle,
                id: '2',
              },
            ],
          ],
        },
      ]),
    ).toMatchSnapshot()
  })
})

describe('removeOutdated', () => {
  it('should remove outdated documents', () => {
    const local: LocalDocument.LocalDocument<BasicDocument> = pipe(
      LocalDocument.empty(),
      LocalDocument.insert({
        index: ArticleIndex.refine([0, 0]),
        document: {
          id: '1',
          updated_at: 1000,
        },
      }),
      LocalDocument.update({
        id: '2',
        updated_at: 2000,
      }),
      LocalDocument.delete({
        id: '3',
        updated_at: 3000,
      }),
    )

    const source1: StageQueryResult[] = [
      {
        query: {
          q: '',
          query_by: 'title',
          page: 1,
        },
        total: 1,
        stageKey: '1-default',
        hitsPerPage: [
          [
            {
              id: '1',
              updated_at: 2000,
            } as unknown as TypesenseArticleDocument,
            {
              id: '2',
              updated_at: 3000,
            } as unknown as TypesenseArticleDocument,
            {
              id: '3',
              updated_at: 4000,
            } as unknown as TypesenseArticleDocument,
          ],
        ],
      },
    ]

    const result1 = LocalDocument.removeOutdated(local, source1)

    expect(HashMap.isEmpty(result1.inserted.byId)).toBe(true)
    expect(HashMap.isEmpty(result1.modified)).toBe(true)
    expect(HashMap.isEmpty(result1.deleted)).toBe(true)

    const source2: StageQueryResult[] = [
      {
        query: {
          q: '',
          query_by: 'title',
          page: 1,
        },
        total: 1,
        stageKey: '1-default',
        hitsPerPage: [
          [
            {
              id: '1',
              updated_at: 2000,
            } as unknown as TypesenseArticleDocument,
            {
              id: '2',
              updated_at: 1000,
            } as unknown as TypesenseArticleDocument,
            {
              id: '3',
              updated_at: 4000,
            } as unknown as TypesenseArticleDocument,
          ],
        ],
      },
    ]

    const result2 = LocalDocument.removeOutdated(local, source2)

    expect(HashMap.isEmpty(result2.inserted.byId)).toBe(true)
    expect(HashMap.isEmpty(result2.modified)).toBe(false)
    expect(HashMap.isEmpty(result2.deleted)).toBe(true)

    const source3: StageQueryResult[] = [
      {
        query: {
          q: '',
          query_by: 'title',
          page: 1,
        },
        total: 1,
        stageKey: '1-default',
        hitsPerPage: [
          [
            {
              id: '1',
              updated_at: 2000,
            } as unknown as TypesenseArticleDocument,
            {
              id: '2',
              updated_at: 1000,
            } as unknown as TypesenseArticleDocument,
            {
              id: '3',
              updated_at: 2000,
            } as unknown as TypesenseArticleDocument,
          ],
        ],
      },
    ]

    const result3 = LocalDocument.removeOutdated(local, source3)

    expect(HashMap.isEmpty(result3.inserted.byId)).toBe(true)
    expect(HashMap.isEmpty(result3.modified)).toBe(false)
    expect(HashMap.isEmpty(result3.deleted)).toBe(false)

    const source4: StageQueryResult[] = [
      {
        query: {
          q: '',
          query_by: 'title',
          page: 1,
        },
        total: 1,
        stageKey: '1-default',
        hitsPerPage: [
          [
            {
              id: '1',
              updated_at: 500,
            } as unknown as TypesenseArticleDocument,
            {
              id: '2',
              updated_at: 1000,
            } as unknown as TypesenseArticleDocument,
            {
              id: '3',
              updated_at: 2000,
            } as unknown as TypesenseArticleDocument,
          ],
        ],
      },
    ]

    const result4 = LocalDocument.removeOutdated(local, source4)

    expect(HashMap.isEmpty(result4.inserted.byId)).toBe(false)
    expect(HashMap.isEmpty(result4.modified)).toBe(false)
    expect(HashMap.isEmpty(result4.deleted)).toBe(false)
  })
})

describe('updateId', () => {
  it('should update id', () => {
    const local: LocalDocument.LocalDocument<BasicDocument> = pipe(
      LocalDocument.empty(),
      LocalDocument.insert({
        index: ArticleIndex.refine([0, 0]),
        document: {
          id: 'foo',
          updated_at: 1000,
        },
      }),
    )

    const result = LocalDocument.updateId(local, 'foo', 'bar')

    expect(result).toMatchInlineSnapshot(`
      {
        "deleted": {
          "_id": "HashMap",
          "values": [],
        },
        "inserted": {
          "byId": {
            "_id": "HashMap",
            "values": [
              [
                "bar",
                {
                  "_next": {
                    "_id": "Option",
                    "_tag": "Some",
                    "value": {
                      "_next": {
                        "_id": "Option",
                        "_tag": "None",
                      },
                      "_previous": {
                        "_id": "Option",
                        "_tag": "Some",
                        "value": [Circular],
                      },
                      "_tag": "PositionNode",
                      "pos": [
                        0,
                        0,
                      ],
                    },
                  },
                  "_previous": {
                    "_id": "Option",
                    "_tag": "None",
                  },
                  "_tag": "DocumentNode",
                  "document": {
                    "id": "bar",
                    "updated_at": 1000,
                  },
                },
              ],
            ],
          },
          "byStage": {
            "_id": "HashMap",
            "values": [
              [
                0,
                {
                  "_id": "HashMap",
                  "values": [
                    [
                      0,
                      {
                        "_next": {
                          "_id": "Option",
                          "_tag": "None",
                        },
                        "_previous": {
                          "_id": "Option",
                          "_tag": "Some",
                          "value": {
                            "_next": {
                              "_id": "Option",
                              "_tag": "Some",
                              "value": [Circular],
                            },
                            "_previous": {
                              "_id": "Option",
                              "_tag": "None",
                            },
                            "_tag": "DocumentNode",
                            "document": {
                              "id": "bar",
                              "updated_at": 1000,
                            },
                          },
                        },
                        "_tag": "PositionNode",
                        "pos": [
                          0,
                          0,
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        },
        "modified": {
          "_id": "HashMap",
          "values": [],
        },
      }
    `)
  })
})

describe('moveWithRestore', () => {
  it('can move article and then restore', () => {
    const local = pipe(
      LocalDocument.empty(),
      LocalDocument.insert({
        index: ArticleIndex.refine([0, 0]),
        document: {
          id: '1',
          updated_at: 1000,
        },
      }),
    )

    const [nextLocal, restore] = LocalDocument.moveWithRestore(local, {
      index: ArticleIndex.refine([1, 0]),
      origin: ArticleIndex.refine([0, 0]),
      pivot: Option.none(),
      document: {
        id: '1',
        updated_at: 2000,
      },
    })

    expect(nextLocal).toMatchSnapshot()

    expect(restore(nextLocal)).toMatchSnapshot()
  })
})

// https://storipress-media.atlassian.net/browse/SPMVP-7392
describe('[SPMVP-7392] move article after modify', () => {
  it('can move article after modify', () => {
    const local = pipe(
      LocalDocument.empty(),
      LocalDocument.update({
        ...emptyArticle,
        id: '1',
        title: 'updated',
        updated_at: 1000,
      }),
      LocalDocument.insert({
        index: ArticleIndex.refine([1, 0]),
        document: {
          ...emptyArticle,
          id: '1',
          title: 'updated',
          updated_at: 2000,
        },
      }),
    )

    expect(() => {
      LocalDocument.combineWithSource(local, [
        {
          query: {
            q: '',
            query_by: 'title',
            page: 1,
          },
          total: 1,
          stageKey: '1-default',
          hitsPerPage: [
            [
              {
                ...emptyArticle,
                updated_at: 0,
                title: 'origin',
                id: '1',
              },
            ],
          ],
        },
      ])
    }).not.toThrow()
  })

  it('can move article with moveWithRestore after modify', () => {
    const local = pipe(
      LocalDocument.empty(),
      LocalDocument.update({
        ...emptyArticle,
        id: '1',
        title: 'updated',
        updated_at: 1000,
      }),
    )
    const [moved, restore] = LocalDocument.moveWithRestore(local, {
      index: ArticleIndex.refine([1, 0]),
      origin: ArticleIndex.refine([0, 0]),
      pivot: Option.none(),
      document: {
        ...emptyArticle,
        id: '1',
        title: 'updated',
        updated_at: 2000,
      },
    })

    expect(restore).toBeInstanceOf(Function)
    expect(() => {
      LocalDocument.combineWithSource(moved, [
        {
          query: {
            q: '',
            query_by: 'title',
            page: 1,
          },
          total: 1,
          stageKey: '1-default',
          hitsPerPage: [
            [
              {
                ...emptyArticle,
                updated_at: 0,
                title: 'origin',
                id: '1',
              },
            ],
          ],
        },
      ])
    }).not.toThrow()
  })
})
