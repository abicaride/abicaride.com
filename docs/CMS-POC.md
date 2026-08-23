# Pages CMS validation report

## Goal and result

The proof of concept tested Pages CMS as an external editorial layer over the
existing Astro, Markdown and Git content model without changing Astro to suit the
CMS.

**Result: PASS.** All critical project and image tests succeeded on the isolated
`cms-poc` branch. Recommendation A — adopt Pages CMS for the existing English and
Spanish project collections — was accepted in
[ADR 006](decisions/006-pages-cms.md).

## Scope

The tested and adopted scope is existing projects only. Writing, static pages,
navigation, global settings and page-builder content remain outside Pages CMS.

The hosted service edits Git-managed files. No CMS code, authentication, backend
or runtime dependency is added to the Astro website.

## Configuration

- `.pages.yml` defines separate **Projects — English** and
  **Projects — Spanish** collections.
- The locale field is fixed and read-only within each collection.
- The Markdown `body` field maps to content after YAML frontmatter.
- Metrics and galleries remain lists of nested objects matching
  `src/content.config.ts`.
- Project images remain in `src/assets/images/projects/`.
- The media output uses `../../../assets/images/projects`, the path Astro expects
  relative to either locale's Markdown files.
- Pages CMS merge mode preserves frontmatter keys the configuration does not
  manage.

Pages CMS offers minimum and maximum constraints for number fields, but not an
integer-only option. The CMS enforces `order >= 1`; Astro remains authoritative
for integer validation of `order` and `year` during the build.

## Authentication and access

The Pages CMS GitHub App is installed for the `abicaride` account with access
limited to the `abicaride.com` repository. App installation is repository-scoped,
not branch-scoped.

Each editor signs into Pages CMS using their own GitHub account. GitHub repository
permissions and branch-protection rules determine which branches that person can
write. Abi should use her own account for editorial saves; Albert's access depends
on his existing repository permission. No ownership transfer is required.

## Test matrix

| Test | Result | Evidence |
| --- | --- | --- |
| Read existing EN project | PASS | Galaekian Green Life loaded with its current fields and narrative. |
| Read existing ES project | PASS | The Spanish counterpart loaded independently with localized content. |
| Edit frontmatter | PASS | A temporary draft flag and structured values were saved and reopened. |
| Edit Markdown | PASS | A temporary heading and sentence survived save/reload as readable Markdown. |
| Edit tags | PASS | A temporary tag survived save/reload and was then removed. |
| Edit nested metrics | PASS | `value`, `label` and optional `detail` round-tripped as one object. |
| Edit gallery | PASS | `src`, `alt` and optional `caption` round-tripped as one object. |
| Toggle draft | PASS | `draft: true` excluded only the EN project route; restoring `false` restored it. |
| Select existing image | PASS | The existing local image retained its Astro-relative path. |
| Upload new image | PASS | Pages CMS stored the file in the source-asset directory and wrote the required relative path. |
| Build after CMS commit | PASS | Astro built 29 pages with the project drafted and 30 with the uploaded image and after restoration. |
| Inspect Git diff | PASS | Content, upload, reference, cleanup and deletion commits were inspected. |
| Verify deployment-compatible commit | PASS | Pages CMS produced ordinary commits and the unchanged production build succeeded. |

Creating and deleting media files passed. Creating and deleting project entries
was intentionally not tested because no fake project was needed for the critical
criteria.

## Image findings

Existing and newly uploaded images used the required mapping:

```text
repository storage: src/assets/images/projects/cms-poc-image-test.jpg
frontmatter value:  ../../../assets/images/projects/cms-poc-image-test.jpg
```

Astro accepted the generated value through the existing Content Collection
`image()` schema and generated AVIF, WebP and JPEG outputs. The temporary gallery
reference and image were deleted through Pages CMS after validation. No test
content or asset remains in the adopted tree.

## Git findings

Each Pages CMS action created one focused commit on the selected branch:

- `7659fb1` — temporary structured-content save;
- `593a1ee` — structured-content cleanup;
- `b62cb62` — temporary image creation;
- `380f775` — uploaded-image gallery reference;
- `b35f461` — gallery reference removal;
- `39c24f8` — temporary image deletion.

The author and committer were `Albert Rodriguez Franco
<albertrfranco@gmail.com>`. Messages followed `Create`, `Update` or
`Delete <path> (via Pages CMS)`.

Content remained correct, but Pages CMS wrapped a long description, expanded an
inline tags array, removed the blank line after frontmatter and removed the final
newline. This is moderate, understandable formatting noise rather than content
corruption. The adoption branch restores the tested project file byte-for-byte.

## Architecture impact

Pages CMS adapts cleanly to Astro. Locale separation, nested data, Markdown,
drafts, existing image references and source-image uploads all worked without
schema, runtime, dependency or deployment changes.

GitHub remains the source of truth. Routine Pages CMS saves to `main` use the
existing GitHub Actions build and deployment workflow.

## Official references

- [Pages CMS configuration](https://pagescms.org/docs/configuration/)
- [Media configuration](https://pagescms.org/docs/configuration/media/)
- [Content definitions](https://pagescms.org/docs/configuration/content/)
- [Fields and Markdown body](https://pagescms.org/docs/configuration/content/fields/)
- [GitHub App setup](https://pagescms.org/docs/guides/installing/github-app/)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
