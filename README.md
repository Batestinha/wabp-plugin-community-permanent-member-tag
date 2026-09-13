# Permanent Member Tag

Keeps the bot group member tag aligned with a configured scope value.

Standalone WABS package `official.community-permanent-member-tag` version `0.1.2`, requiring WABP core API `^0.3.1`. The archive includes its runtime dependencies and Portuguese translations. WABP owns scope configuration, enabled state, identity resolution, ephemeral state and action authorization; extracting the code preserves their identifiers and stored values.

Install through a trusted WABS registry entry. Installation and scope enablement are separate operations. The publisher signs exact archive bytes; registry branding alone does not establish trust.

For development, run `npm ci --ignore-scripts`, `npm test`, then `npm run release:archive`. Tests use fixture identities and mocked host capabilities. CI checks Node22.23.2 and24.15.0 and archive reproducibility.

`provenance.json` records the imported source history and exact SDK input. Runtime imports use the SDK contract, with no host or sibling plugin source dependency.

Runtime readiness schedules reconciliation through the host-owned job queue for currently enabled scopes. Saved tags and group exemptions continue to control every effect.
