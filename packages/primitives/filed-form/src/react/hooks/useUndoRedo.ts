'use client';
/**
 * Form undo/redo functionality hook Provides undo and redo capabilities for form operations including field value
 * changes and array operations
 */
import { useEffect, useState } from 'react';

import { type NamePath, deepGet, keyOfName } from '@skyroc/utils';
import type { ArrayOpAction, Middleware } from '../../form-core/middleware';

import { type FormInstance, type InternalFormInstance, useFieldContext } from './FieldContext';

/** Patch type for field value changes Records the field name, previous value, and new value for undo/redo operations */
type SetPatch = {
  /** The field name path */
  name: NamePath;
  /** The new value after the change */
  next: any;
  /** The previous value before the change */
  prev: any;
  /** Patch type identifier */
  type: 'set';
};

/** Patch type for array operations Extends ArrayOpAction with inverse operation for undo functionality */
type ArrayPatch = ArrayOpAction & {
  /** The inverse operation needed to undo this array operation */
  inverse: ArrayOpAction['args'];
};

/** Union type representing all possible patch types Used to track changes that can be undone or redone */
type Patch = SetPatch | ArrayPatch;

/**
 * Hook to provide undo/redo functionality for form operations Tracks form changes and allows users to undo/redo field
 * value changes and array operations
 *
 * @example
 *   ```tsx
 *   // Basic usage with undo/redo buttons
 *   function EditableForm() {
 *     const [form] = useForm();
 *     const { canUndo, canRedo, undo, redo } = useUndoRedo(form);
 *
 *     return (
 *       <Form
 *         form={form}
 *         initialValues={{
 *           title: 'Document Title',
 *           content: 'Document content...',
 *           tags: ['react', 'form']
 *         }}
 *       >
 *         <div className="toolbar">
 *           <button type="button" onClick={undo} disabled={!canUndo} className={`btn ${!canUndo ? 'disabled' : ''}`}>
 *             ↶ Undo
 *           </button>
 *           <button type="button" onClick={redo} disabled={!canRedo} className={`btn ${!canRedo ? 'disabled' : ''}`}>
 *             ↷ Redo
 *           </button>
 *         </div>
 *
 *         <Field name="title" rules={[{ required: true }]}>
 *           <Input placeholder="Document title" />
 *         </Field>
 *
 *         <Field name="content">
 *           <TextArea rows={6} placeholder="Document content" />
 *         </Field>
 *
 *         <List name="tags">
 *           {(fields, { add, remove }) => (
 *             <>
 *               {fields.map(field => (
 *                 <div key={field.key} className="tag-item">
 *                   <Field name={field.name}>
 *                     <Input placeholder="Tag" />
 *                   </Field>
 *                   <button onClick={() => remove(field.name)}>Remove</button>
 *                 </div>
 *               ))}
 *               <button onClick={() => add('')}>Add Tag</button>
 *             </>
 *           )}
 *         </List>
 *
 *         <button type="submit">Save Document</button>
 *       </Form>
 *     );
 *   }
 *   ```
 */
export function useUndoRedo<Values = any>(form?: FormInstance<Values>) {
  // Stack to store batches of patches for undo operations
  const [undoStack, setUndoStack] = useState<Patch[][]>([]);
  // Stack to store batches of patches for redo operations
  const [redoStack, setRedoStack] = useState<Patch[][]>([]);

  const formInstance = form || useFieldContext<Values>();

  if (!formInstance) {
    throw new Error('Can not find FormContext. Please make sure you wrap Field under Form or provide a form instance.');
  }

  // Boolean flags indicating whether undo/redo operations are available
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  // Middleware to intercept form actions and track changes for undo/redo
  const mw: Middleware<Values> =
    ({ getState }) =>
    next =>
    action => {
      // Capture the form state before the action is applied
      const stateBefore = getState();
      const batch: Patch[] = [];

      // Handle different types of form actions
      switch (action.type) {
        case 'setFieldValue': {
          // Track single field value changes
          const k = keyOfName(action.name);
          const prev = deepGet(stateBefore, k);

          batch.push({ name: k, next: action.value, prev, type: 'set' });
          break;
        }
        case 'setFieldsValue': {
          // Track multiple field value changes
          Object.entries(action.values as Record<string, unknown>).forEach(([k1, v]) => {
            const prev = deepGet(stateBefore, k1 as any);
            batch.push({ name: keyOfName(k1), next: v, prev, type: 'set' });
          });
          break;
        }
        case 'arrayOp': {
          // Track array operations (insert, remove, move, swap, replace)
          const { args, name } = action;

          const arr = (deepGet(stateBefore, name) as any[]) ?? [];

          let inverse: any = null;

          // Create inverse operations for each array operation type
          switch (args.op) {
            case 'insert':
              // Inverse of insert is remove at the same index
              inverse = { index: args.index, op: 'remove' };
              break;
            case 'remove':
              // Inverse of remove is insert the removed item back at the same index
              inverse = { index: args.index, item: arr[args.index], op: 'insert' };
              break;
            case 'move':
              // Inverse of move is move back from destination to source
              inverse = { from: args.to, op: 'move', to: args.from };
              break;
            case 'swap':
              // Inverse of swap is swap back (same operation)
              inverse = { from: args.to, op: 'swap', to: args.from };
              break;
            case 'replace':
              // Inverse of replace is replace with the original item
              inverse = { index: args.index, item: arr[args.index], op: 'replace' };
              break;
            default:
              break;
          }

          batch.push({ args, inverse, name, type: 'arrayOp' });
          break;
        }
        default:
          break;
      }

      // Execute the original action
      const ret = next(action);

      // If we tracked any changes, add them to the undo stack
      if (batch.length > 0) {
        setUndoStack(prev => [...prev, batch]);

        // Clear redo stack when a new operation is performed
        setRedoStack([]);
      }

      return ret;
    };

  /** Applies a batch of patches in the specified direction (undo or redo) */
  const applyBatch = (batch: Patch[], dir: 'redo' | 'undo') => {
    // patch 里的 path 是运行时字符串，静态上无法收敛到 AllPathsKeys<Values>，
    // 因此这里刻意退到 InternalFormInstance<any> 来访问内部 hooks。
    const context = formInstance as unknown as InternalFormInstance;

    const { arrayOp, setFieldValue, transaction } = context.getInternalHooks();

    // Use transaction to batch all changes together for better performance
    transaction(() => {
      // For undo, reverse the order of patches to apply them in reverse
      const iterate = dir === 'undo' ? [...batch].toReversed() : batch;
      for (const p of iterate) {
        if (p.type === 'set') {
          // Apply field value changes
          setFieldValue(p.name as string, dir === 'undo' ? p.prev : p.next);
        } else {
          // Apply array operations
          const use = dir === 'undo' ? p.inverse : p.args;

          arrayOp(p.name as string, use);
        }
      }
    });
  };

  /** Undoes the last batch of changes Moves the most recent batch from undo stack to redo stack */
  const undo = () => {
    setUndoStack(prev => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      const b = copy.pop()!;
      // Apply the batch in undo direction
      applyBatch(b, 'undo');
      // Move the batch to redo stack
      setRedoStack(r => {
        return [...r, b];
      });
      return copy;
    });
  };

  /** Redoes the last undone batch of changes Moves the most recent batch from redo stack to undo stack */
  const redo = () => {
    setRedoStack(prev => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      const b = copy.pop()!;
      // Apply the batch in redo direction
      applyBatch(b, 'redo');

      // Move the batch back to undo stack
      setUndoStack(u => {
        return [...u, b];
      });
      return copy;
    });
  };

  // Register the middleware with the form to start tracking changes
  useEffect(() => {
    formInstance.use(mw);
  }, []);

  return { canRedo, canUndo, redo, undo };
}
