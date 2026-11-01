# Design guides

Read these before creating or changing UI: layout, components, colors, fonts, icons or branding assets.

- [Visual identity](visual-identity.md): brand decisions, the V mark, icons and proposals not yet applied
- [Styling](styling.md): visual contracts, tokens, component layout and CSS conventions
- [Colors](colors.md): exact implemented palette values for the Light and Dark profiles
- [CSS audit](css-audit.md): unused values and the refactor map for the active bundle

[Frontend conventions](../frontend.md) cover UI configuration and behavior.

## UI review checklist

Check each changed screen in the running preview (`task site:up`) against the [styling guide](styling.md), at desktop and phone widths, in Light and Dark:

- **Spacing:** gaps between buttons, panes and rows use the shared layout gap (`--site-layout-gap`, 8px by default); visible gaps stay equal instead of adding up. See [geometry and typography](styling.md#geometry-and-typography).
- **Alignment:** controls line up with their neighbors as the [local contracts](styling.md#local-contracts) describe, for example Home with the leading sidebar action and the preferences/search group with the outline. Icons and labels sit in the shared control slots and stay vertically centered.
- **Sizes:** buttons keep the shared control height (`--site-control-height`), icon size and radius (`--site-radius`); round controls use the round-control tokens.
- **Text:** labels wrap or truncate without overlapping other controls; navigation uses IBM Plex Sans at 14px.
- **Colors:** foreground and surface pairs come from the [palette](colors.md) and stay readable in both profiles.
- **States:** hover, focus and current states are visible and do not shift the layout.
- **Resizing:** controls stay anchored when panes resize or collapse and when the window narrows.
