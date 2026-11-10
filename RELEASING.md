# Releasing

Release only with the **Release standalone plugin** workflow (Actions, then Run workflow, with the full commit SHA on `main`), never from a workstation.

- It builds in the pinned Fedora 44 container (`zlib-ng-compat-2.3.3-3.fc44`), runs the tests, builds the archive twice, checks that it loads outside the repository, then creates `v<version>` at that commit with the archive attached. The WABS index entry points at that asset, with its SHA-256.
- The archive's tar bytes are reproducible everywhere, but its gzip bytes depend on the zlib implementation (stock zlib and zlib-ng compress differently). That is why the builder is pinned, and why `validate.yml` builds in the same container.
- For a version that is already installed somewhere, pass that archive's SHA-256 as `expected_sha256`. WABP refuses a version whose bytes change ("already names different immutable bytes"), so the release must carry exactly those bytes.
- A local `npm run release:archive` is for testing. Its output names the `zlib` it used, and it reproduces the release bytes only with the same one (Fedora 44 prints `1.3.1.zlib-ng`).
- Bump the version in `package.json`, `package-lock.json` (twice), `wa-plugin.json` and `src/manifest.ts` before releasing changed content. Anything in the package's `files` list, including `README.md`, changes the archive.

## Published before the canonical builder

`v0.1.2` (`official.community-permanent-member-tag-0.1.2.tgz`, SHA-256 `430953c62a2f38884ac736c02edb0d5f3fb62b668a9a01dbe182ab079cee3cce`) was built by the previous Ubuntu CI builder (stock zlib). It stays as published, because a version's bytes never change. A Fedora 44 build of the same commit gives `94d6da63f59d02851c0a634d7b4647e41c1613e5bf483a92a48b9ad0b997eaec` from the identical tar stream (`fcc96da1d451baa7ec4d53312a1650249555d4b0bb211841f2545d5d9010769c`). No check compares a fresh build of 0.1.2 or earlier with those assets; versions after 0.1.2 come from `release.yml`.

Earlier releases also attached a signature, `SHA256SUMS`, `validation.json` and a public key. WABP and the WABS index use only the archive and its SHA-256, so `release.yml` attaches the archive alone.
