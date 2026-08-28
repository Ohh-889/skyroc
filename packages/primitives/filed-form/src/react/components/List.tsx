'use client';

/* eslint-disable no-plusplus */

/**
 * List component for managing dynamic array fields in forms Provides array operations and renders items with stable
 * keys
 */

import type { AllPathsKeys, ArrayElementValue, ArrayKeys } from '@skyroc/utils/type';
import React, { useEffect, useRef, useState } from 'react';
import type { InternalFormInstance, ListRenderItem } from '../hooks/FieldContext';
import { useFieldContext } from '../hooks/FieldContext';

/** Props interface for List component Manages dynamic array fields with CRUD operations */
export type ListProps<Values = any, K extends ArrayKeys<Values> & string = ArrayKeys<Values> & string> = {
  /** Render function that receives fields array and operation helpers */
  children: (
    /** Array of field items with stable keys for rendering */
    fields: ListRenderItem[],
    /** Object containing array manipulation operations */
    ops: {
      /** Insert new item at specified index */
      insert: (index: number, item: ArrayElementValue<Values, K>) => void;
      /** Move item from one index to another */
      move: (from: number, to: number) => void;
      /** Remove item at specified index */
      remove: (index: number) => void;
      /** Replace item at index with new value */
      replace: (index: number, val: ArrayElementValue<Values, K>) => void;
      /** Swap positions of two items */
      swap: (i: number, j: number) => void;
    }
  ) => React.ReactNode;

  /** Default array value for initialization */
  initialValue?: ArrayElementValue<Values, K>[];

  /** Field name path pointing to array field in form */
  name: K;

  /** Whether to preserve field state when component unmounts */
  preserve?: boolean;
};

/**
 * List component for managing dynamic array fields in forms Provides stable keys for array items and comprehensive
 * array operations
 *
 * @example
 *   ```tsx
 *   // Basic dynamic list with add/remove functionality
 *   <Form initialValues={{ users: [{ name: '', email: '' }] }}>
 *   <List name="users">
 *   {(fields, { add, remove }) => (
 *   <>
 *   {fields.map(field => (
 *   <div
 *   key={field.key}
 *   className="user-item"
 *   >
 *   <Field name={`${field.name}.name`}>
 *   <Input placeholder="Name" />
 *   </Field>
 *   <Field name={`${field.name}.email`}>
 *   <Input placeholder="Email" />
 *   </Field>
 *   <button onClick={() => remove(field.name)}>Remove</button>
 *   </div>
 *   ))}
 *   <button onClick={() => add({ name: '', email: '' })}>Add User</button>
 *   </>
 *   )}
 *   </List>
 *   </Form>;
 *   ```
 *
 * @example
 *   ```tsx
 *   // Advanced list with all operations (move, swap, replace)
 *   <List
 *   name="tasks"
 *   initialValue={[]}
 *   >
 *   {(fields, { add, remove, move, swap, replace }) => (
 *   <div className="task-list">
 *   {fields.map((field, index) => (
 *   <div
 *   key={field.key}
 *   className="task-item"
 *   >
 *   <Field name={`${field.name}.title`}>
 *   <Input placeholder="Task title" />
 *   </Field>
 *   <Field name={`${field.name}.priority`}>
 *   <Select>
 *   <option value="low">Low</option>
 *   <option value="medium">Medium</option>
 *   <option value="high">High</option>
 *   </Select>
 *   </Field>
 *
 *   <div className="task-actions">
 *   <button onClick={() => remove(index)}>Delete</button>
 *   <button
 *   onClick={() => move(index, index - 1)}
 *   disabled={index === 0}
 *   >
 *   Move Up
 *   </button>
 *   <button
 *   onClick={() => move(index, index + 1)}
 *   disabled={index === fields.length - 1}
 *   >
 *   Move Down
 *   </button>
 *   <button
 *   onClick={() => swap(index, index + 1)}
 *   disabled={index === fields.length - 1}
 *   >
 *   Swap Down
 *   </button>
 *   <button onClick={() => replace(index, { title: 'New Task', priority: 'medium' })}>Replace</button>
 *   </div>
 *   </div>
 *   ))}
 *
 *   <button onClick={() => add({ title: '', priority: 'medium' })}>Add Task</button>
 *   </div>
 *   )}
 *   </List>;
 *   ```
 *
 * @example
 *   ```tsx
 *   // Nested lists for complex data structures
 *   <Form initialValues={{ departments: [] }}>
 *   <List name="departments">
 *   {(deptFields, deptOps) => (
 *   <>
 *   {deptFields.map(deptField => (
 *   <div
 *   key={deptField.key}
 *   className="department"
 *   >
 *   <Field name={`${deptField.name}.name`}>
 *   <Input placeholder="Department Name" />
 *   </Field>
 *
 *   <List name={`${deptField.name}.employees`}>
 *   {(empFields, empOps) => (
 *   <>
 *   {empFields.map(empField => (
 *   <div
 *   key={empField.key}
 *   className="employee"
 *   >
 *   <Field name={`${empField.name}.name`}>
 *   <Input placeholder="Employee Name" />
 *   </Field>
 *   <Field name={`${empField.name}.position`}>
 *   <Input placeholder="Position" />
 *   </Field>
 *   <button onClick={() => empOps.remove(empField.name)}>Remove Employee</button>
 *   </div>
 *   ))}
 *   <button onClick={() => empOps.add({ name: '', position: '' })}>Add Employee</button>
 *   </>
 *   )}
 *   </List>
 *
 *   <button onClick={() => deptOps.remove(deptField.name)}>Remove Department</button>
 *   </div>
 *   ))}
 *   <button onClick={() => deptOps.add({ name: '', employees: [] })}>Add Department</button>
 *   </>
 *   )}
 *   </List>
 *   </Form>;
 *   ```
 */
function List<Values = any>(props: ListProps<Values>) {
  // Destructure props with default values
  const { children, initialValue, name, preserve = true } = props;

  // Get form context to access array operations
  const fieldContext = useFieldContext<Values>();

  // Extract array operations and internal hooks
  const { arrayOp, getInternalHooks, isDisabled, isHidden } = fieldContext as unknown as InternalFormInstance<Values>;

  const fieldIsHidden = isHidden(name as AllPathsKeys<Values>);
  const fieldIsDisabled = isDisabled(name as AllPathsKeys<Values>);

  // Get methods for array field management
  const { getArrayFields, registerField } = getInternalHooks();

  // State for forcing re-renders when array changes
  const [_, forceUpdate] = useState({});

  // Get current array fields with stable keys
  const fields = getArrayFields(name, initialValue, fieldIsDisabled);

  // Reference to cleanup function for field registration
  const unregisterRef = useRef<() => void>(null);

  function registerListField() {
    unregisterRef.current = registerField({
      changeValue: () => {
        // Force re-render when array field changes
        forceUpdate({});
      },
      initialValue,
      name,
      preserve
    });
  }

  // Register field entity if not already registered
  if (!unregisterRef.current) {
    registerListField();
  }

  // Cleanup field registration when component unmounts
  useEffect(() => {
    if (!unregisterRef.current) {
      registerListField();
    }

    return () => {
      unregisterRef.current?.();
      unregisterRef.current = null;
    };
  }, []);

  if (fieldIsHidden) return null;

  // Render children with fields and array operations
  return <>{children(fields, arrayOp(name))}</>;
}

export default List;
