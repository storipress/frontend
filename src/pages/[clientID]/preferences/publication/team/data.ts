export const permissionList: Record<string, Set<string>> = {
  owner: new Set([
    'suspendUpdate',
    'usersDelete',
    'adminUpdate',
    'editorUpdate',
    'authorUpdate',
    'contributorUpdate',
    'editorDesksUpdate',
    'authorDesksUpdate',
    'contributorDesksUpdate',
  ]),
  admin: new Set([
    'suspendUpdate',
    'usersDelete',
    'editorUpdate',
    'authorUpdate',
    'contributorUpdate',
    'editorDesksUpdate',
    'authorDesksUpdate',
    'contributorDesksUpdate',
  ]),
}
