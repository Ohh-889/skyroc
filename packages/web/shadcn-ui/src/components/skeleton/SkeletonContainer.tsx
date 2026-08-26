'use client';

import React, {
  type CSSProperties,
  Children,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement
} from 'react';
import { cn } from '@skyroc/utils';
import { skeletonContainerVariants, skeletonItemVariants } from './skeleton-variants';
import type { SkeletonAnimation, SkeletonContainerProps } from './types';

// Tags that should be treated as text containers
const TEXT_TAGS = new Set([
  'p',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'label',
  'strong',
  'em',
  'b',
  'i',
  'u',
  'small',
  'mark',
  'del',
  'ins',
  'sub',
  'sup',
  'code',
  'pre',
  'blockquote',
  'cite',
  'q'
]);

// Tags that should be treated as media/visual elements
const MEDIA_TAGS = new Set([
  'img',
  'picture',
  'video',
  'audio',
  'canvas',
  'svg',
  'iframe',
  'embed',
  'object'
]);

// Tags that should preserve their structure (layout containers)
const LAYOUT_TAGS = new Set([
  'div',
  'section',
  'article',
  'main',
  'aside',
  'header',
  'footer',
  'nav',
  'ul',
  'ol',
  'li',
  'dl',
  'dt',
  'dd',
  'figure',
  'figcaption',
  'form',
  'fieldset',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td'
]);

// Tags that should be hidden during loading (includes component displayNames)
const INTERACTIVE_TAGS = new Set([
  'button',
  'buttonui',
  'input',
  'inputui',
  'select',
  'selectui',
  'textarea',
  'textareaui',
  'checkbox',
  'checkboxui',
  'radio',
  'radioui',
  'switch',
  'switchui',
  'toggle',
  'toggleui'
]);

// Check if element type is a React component (not a native HTML tag)
function isReactComponent(type: any): boolean {
  // Native HTML tags are strings
  if (typeof type === 'string') {
    return false;
  }

  // Function components or class components
  if (typeof type === 'function') {
    return true;
  }

  // Check for special React types (lazy, forwardRef, memo, etc.)
  if (type && typeof type === 'object') {
    const typeOf = type.$$typeof;
    if (typeOf) {
      const typeString = typeOf.toString();
      // react.lazy, react.forward_ref, react.memo, etc.
      if (
        typeString.includes('react.lazy')
        || typeString.includes('react.forward_ref')
        || typeString.includes('react.memo')
      ) {
        return true;
      }
    }
  }

  return false;
}

// Get element tag name from React element
function getElementTag(element: ReactElement): string {
  const type = element.type;

  // Native HTML tags
  if (typeof type === 'string') {
    return type.toLowerCase();
  }

  // For React components, check displayName or name
  if (typeof type === 'function') {
    const name = (type as any).displayName || (type as any).name || '';
    return name.toLowerCase();
  }

  // For lazy/forwardRef/memo components, try to get the underlying component name
  if (type && typeof type === 'object') {
    // Check for displayName on the type object
    if ((type as any).displayName) {
      return (type as any).displayName.toLowerCase();
    }

    // For lazy components, the name might be in _payload
    if ((type as any)._payload?.value?.displayName) {
      return (type as any)._payload.value.displayName.toLowerCase();
    }

    // Return a marker for React components
    return '__react_component__';
  }

  return '';
}

// Check if element should be excluded by key
function shouldExclude(
  element: ReactElement,
  excludeKeys: string[]
): boolean {
  // Check if element's key is in the exclude list
  if (element.key && excludeKeys.includes(String(element.key))) {
    return true;
  }

  return false;
}

// Check if node is pure text
function isTextNode(node: ReactNode): boolean {
  return typeof node === 'string' || typeof node === 'number';
}

// Check if children contain only text
function hasOnlyTextChildren(children: ReactNode): boolean {
  const childArray = Children.toArray(children);
  return childArray.every(child => isTextNode(child));
}

// Extract style info for skeleton sizing
function extractStyles(props: Record<string, any>): CSSProperties {
  const styles: CSSProperties = {};
  const { style = {} } = props;

  // Copy explicit styles
  if (style.width)
    styles.width = style.width;
  if (style.height)
    styles.height = style.height;
  if (style.minWidth)
    styles.minWidth = style.minWidth;
  if (style.minHeight)
    styles.minHeight = style.minHeight;
  if (style.maxWidth)
    styles.maxWidth = style.maxWidth;
  if (style.maxHeight)
    styles.maxHeight = style.maxHeight;
  if (style.aspectRatio)
    styles.aspectRatio = style.aspectRatio;
  if (style.flex)
    styles.flex = style.flex;
  if (style.flexGrow)
    styles.flexGrow = style.flexGrow;
  if (style.flexShrink)
    styles.flexShrink = style.flexShrink;
  if (style.flexBasis)
    styles.flexBasis = style.flexBasis;
  if (style.gridArea)
    styles.gridArea = style.gridArea;
  if (style.gridColumn)
    styles.gridColumn = style.gridColumn;
  if (style.gridRow)
    styles.gridRow = style.gridRow;

  return styles;
}

// Estimate text width based on content length (rough calculation)
function estimateTextWidth(text: string): string {
  const length = text.length;
  // Use em units for better scaling with font size
  // Average character width is about 0.5em for most fonts
  const estimatedEm = Math.max(3, Math.min(length * 0.6, 20));
  return `${estimatedEm}em`;
}

// Create skeleton element for text
// eslint-disable-next-line max-params
function createTextSkeleton(
  animation: SkeletonAnimation,
  skeletonColor?: string,
  skeletonRadius?: string,
  extraClassName?: string,
  textContent?: string
): ReactElement {
  const style: CSSProperties = {};
  if (skeletonColor)
    style.backgroundColor = skeletonColor;
  if (skeletonRadius)
    style.borderRadius = skeletonRadius;

  // If we have text content, estimate width based on it
  if (textContent) {
    style.width = estimateTextWidth(textContent);
  }

  return (
    <span
      className={cn(skeletonItemVariants({ animation, type: 'text' }), extraClassName)}
      data-slot="skeleton-text"
      style={style}
    />
  );
}

// Create skeleton element for media
// eslint-disable-next-line max-params
function createMediaSkeleton(
  props: Record<string, any>,
  animation: SkeletonAnimation,
  skeletonColor?: string,
  skeletonRadius?: string
): ReactElement {
  const extractedStyles = extractStyles(props);
  const style: CSSProperties = {
    ...extractedStyles
  };

  if (skeletonColor)
    style.backgroundColor = skeletonColor;
  if (skeletonRadius)
    style.borderRadius = skeletonRadius;

  // For images, try to preserve aspect ratio
  const { className = '', height, width } = props;
  if (width && height) {
    style.width = typeof width === 'number' ? `${width}px` : width;
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      className={cn(skeletonItemVariants({ animation, type: 'media' }), className)}
      data-slot="skeleton-media"
      style={style}
    />
  );
}

interface SkeletonizeOptions {
  animation: SkeletonAnimation;
  currentDepth?: number;
  depth: number;
  excludeKeys: string[];
  skeletonColor?: string;
  skeletonRadius?: string;
}

// Main function to convert children to skeleton
function skeletonizeChildren(
  children: ReactNode,
  options: SkeletonizeOptions
): ReactNode {
  const {
    animation,
    currentDepth = 0,
    depth,
    excludeKeys,
    skeletonColor,
    skeletonRadius
  } = options;

  // Depth limit reached
  if (currentDepth > depth) {
    return children;
  }

  return Children.map(children, (child, index) => {
    // Handle text nodes
    if (isTextNode(child)) {
      const textContent = String(child);
      return createTextSkeleton(animation, skeletonColor, skeletonRadius, undefined, textContent);
    }

    // Handle null/undefined
    if (!child) {
      return null;
    }

    // Handle React elements
    if (isValidElement(child)) {
      const element = child as ReactElement;
      const props = element.props as Record<string, any>;
      const tag = getElementTag(element);

      // Check if should be excluded by key
      if (shouldExclude(element, excludeKeys)) {
        // Return element with exclude marker so CSS doesn't affect it
        return cloneElement(element as ReactElement<any>, {
          'data-skeleton-exclude': true
        });
      }

      // Check if it's a React component (not native HTML tag)
      // React components should be replaced directly with skeleton block
      if (isReactComponent(element.type)) {
        // Get text content for width estimation if available
        const textContent = hasOnlyTextChildren(props.children)
          ? Children.toArray(props.children).filter(isTextNode).map(c => String(c)).join('')
          : '';

        return (
          <span
            className={cn(skeletonItemVariants({ animation, type: 'interactive' }), props.className)}
            data-slot="skeleton-component"
            key={index}
            style={textContent ? { width: estimateTextWidth(textContent) } : extractStyles(props)}
          />
        );
      }

      // Handle media elements (native HTML tags)
      if (MEDIA_TAGS.has(tag)) {
        return React.cloneElement(
          createMediaSkeleton(props, animation, skeletonColor, skeletonRadius),
          { key: index }
        );
      }

      // Handle interactive elements (native HTML tags like button, input)
      if (INTERACTIVE_TAGS.has(tag)) {
        // Get text content for width estimation if available
        const textContent = hasOnlyTextChildren(props.children)
          ? Children.toArray(props.children).filter(isTextNode).map(c => String(c)).join('')
          : '';

        return (
          <span
            className={cn(skeletonItemVariants({ animation, type: 'interactive' }), props.className)}
            data-slot="skeleton-interactive"
            key={index}
            style={textContent ? { width: estimateTextWidth(textContent) } : extractStyles(props)}
          />
        );
      }

      // Handle text elements
      if (TEXT_TAGS.has(tag)) {
        // If has only text children, replace content
        if (hasOnlyTextChildren(props.children)) {
          const extractedStyles = extractStyles(props);
          const style: CSSProperties = {
            ...extractedStyles
          };

          // Get text content for width estimation
          const textContent = Children.toArray(props.children)
            .filter(isTextNode)
            .map(c => String(c))
            .join('');

          return cloneElement(element as ReactElement<any>, {
            key: index,
            className: cn(props.className),
            style,
            children: createTextSkeleton(animation, skeletonColor, skeletonRadius, undefined, textContent)
          });
        }

        // Otherwise, recursively process children
        return cloneElement(element as ReactElement<any>, {
          key: index,
          children: skeletonizeChildren(props.children, {
            ...options,
            currentDepth: currentDepth + 1
          })
        });
      }

      // Handle layout containers - preserve structure, process children
      if (LAYOUT_TAGS.has(tag)) {
        // If layout element has no children, treat it as a visual block (like avatar placeholder)
        if (!props.children) {
          return (
            <div
              className={cn(skeletonItemVariants({ animation, type: 'media' }), props.className)}
              data-slot="skeleton-media"
              key={index}
              style={extractStyles(props)}
            />
          );
        }

        return cloneElement(element as ReactElement<any>, {
          key: index,
          children: skeletonizeChildren(props.children, {
            ...options,
            currentDepth: currentDepth + 1
          })
        });
      }

      // Default: try to process children if exists
      if (props.children) {
        return cloneElement(element as ReactElement<any>, {
          key: index,
          children: skeletonizeChildren(props.children, {
            ...options,
            currentDepth: currentDepth + 1
          })
        });
      }

      // No children - create a skeleton block
      return (
        <span
          className={cn(skeletonItemVariants({ animation, type: 'media' }), props.className)}
          data-slot="skeleton-block"
          key={index}
          style={extractStyles(props)}
        />
      );
    }

    // Return other nodes as-is
    return child;
  });
}

const SkeletonContainerUI = (props: SkeletonContainerProps) => {
  const {
    animation = 'pulse',
    children,
    className,
    depth = Infinity,
    excludeKeys = [],
    loading = false,
    skeletonColor,
    skeletonRadius,
    ...rest
  } = props;

  const mergedCls = cn(skeletonContainerVariants({ loading: true }), className);

  // If not loading, render children normally
  if (!loading) {
    return children;
  }

  // Convert children to skeleton
  const skeletonizedChildren = skeletonizeChildren(children, {
    animation,
    excludeKeys,
    depth,
    skeletonColor,
    skeletonRadius
  });

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={mergedCls}
      data-loading="true"
      data-slot="skeleton-container"
      {...rest}
    >
      {skeletonizedChildren}
    </div>
  );
};

export default SkeletonContainerUI;
