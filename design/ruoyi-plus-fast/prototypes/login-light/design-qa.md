# Design QA

## Evidence

- Source visual truth: `/Users/wangshipeng/.codex/generated_images/019fa937-8d0a-7582-8917-e0fdbeb95251/call_PZ77pBmJYa32N5dxTjaA7QAd.png`
- Source pixels: `1672 × 941`
- Normalized source: `qa/source-option-3-normalized.png`, resized to `1365 × 768`
- Implementation screenshot: `qa/implementation-desktop-final.png`
- Implementation pixels and CSS viewport: `1365 × 768`
- Device scale factor: `1` (screenshot pixels match the CSS viewport)
- State: desktop, Chinese, light theme, untouched form
- Full-view comparison: `qa/comparison-source-vs-implementation.png`
- Focused form comparison: `qa/comparison-form-focused.png`
- Responsive evidence: `qa/implementation-mobile.png`
- Additional state evidence: `qa/implementation-dark.png`

## Findings

- No remaining P0, P1, or P2 differences.
- Fonts and typography: the implementation preserves the source hierarchy, natural Chinese headline break, compact form labels, and readable small text. The system font stack is intentionally used instead of introducing a network font dependency.
- Spacing and layout rhythm: the final pass aligns the left story, form start, form width, control density, and footer rhythm with the normalized source. Minor title-width and footer-spacing differences remain within P3 polish.
- Colors and visual tokens: the cool gray surface, dark navy text, Skyroc blue primary action, subtle borders, and low-contrast supporting text match the source direction. Focus, error, dark-theme, and reduced-motion states are added without changing the untouched source state.
- Image quality and asset fidelity: the Skyroc logo uses the supplied project asset. The security illustration is a dedicated generated raster asset matching the selected concept; it is not recreated with CSS or placeholder shapes.
- Copy and content: the source Chinese copy and all required login methods are preserved. English copy is available through the language switch.
- Interaction checks: empty-submit validation, password visibility, captcha refresh, theme switch, language switch, remember-me control, and secondary-action feedback were exercised. Browser console warnings/errors: none.
- Responsive behavior: the mobile layout reflows to one column with no horizontal overflow (`390px` viewport and `390px` document width).

## Comparison history

1. Initial implementation:
   - P2: the login form sat too far right and was wider than the selected source.
   - P2: the form heading and fields did not share the source's vertical rhythm.
   - P2: the left headline wrapped after a single Chinese character.
2. Fixes:
   - Moved the form start to `44.2%` and reduced its maximum width to `500px`.
   - Rebalanced heading/form spacing at the `768px` desktop height.
   - Added an intentional Chinese line break after `让企业管理更清晰、`.
   - Shifted the generated security illustration to match the source focal point.
3. Post-fix evidence:
   - `qa/implementation-desktop-final.png`
   - `qa/comparison-source-vs-implementation.png`
   - `qa/comparison-form-focused.png`

## Follow-up polish

- P3: the generated source uses slightly wider display lettering in the login heading than the system-font implementation.
- P3: the implementation's captcha is intentionally cleaner and more legible than the mock image.

## Final result

final result: passed
