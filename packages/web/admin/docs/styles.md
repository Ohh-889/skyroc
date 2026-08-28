# @shell/styles

Shared global CSS assets for Skyroc admin web applications.

```ts
import '@shell/styles/global.css';
```

## Exports

| Export                        | Purpose                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `@shell/styles/global.css`    | Admin app global style entry. Includes reset and NProgress styles. |
| `@shell/styles/reset.css`     | Browser reset and base element normalization.                      |
| `@shell/styles/nprogress.css` | NProgress bar and spinner styles.                                  |

The package only owns CSS assets. Runtime setup such as `setupNProgress()` stays in `@shell/runtime`, and the host app should import these styles explicitly from its asset entry.
