'use client';

import { Button, Form, FormField, Input, useForm } from '@skyroc/web-ui';

const FieldChange = () => {
  const [form] = useForm();

  return (
    <Form
      className="w-[480px] space-y-4 max-sm:w-full"
      form={form}
      onFieldsChange={changedFields => {
        /**
         * OnFieldsChange(changedFields, allFields)
         *
         * This callback is triggered whenever a field's value or meta changes. For a single keystroke, you will
         * typically see up to THREE distinct updates:
         *
         * 1. Touched + Value
         *
         * - The first interaction marks the field as touched.
         * - The value changes to the latest input.
         * - Mask bits: ChangeTag.Touched (first time only) | ChangeTag.Value | ChangeTag.Dirty
         *
         * 2. Validating (in progress)
         *
         * - Async rules start running (debounced).
         * - UI can show a spinner / "validating…" state.
         * - Mask bits: ChangeTag.Validating
         *
         * 3. Validation settled (validated)
         *
         * - Validation completes for the current value.
         * - Errors/Warnings are updated only if they actually changed.
         * - Internal `_validated` is set (the field is considered validated for the current value).
         * - Mask bits: ChangeTag.Validated | (ChangeTag.Errors if changed) | (ChangeTag.Warnings if changed)
         *
         * Notes:
         *
         * - If rules don't change results, Errors/Warnings bits won't be emitted again.
         * - Hidden/disabled fields short-circuit: old errors are cleared and no validating occurs.
         * - Concurrency is guarded by tokens; only the latest validation result is applied.
         * - Exact vs. prefix subscribers receive masks for their respective keys.
         */
        console.log('changedFields', changedFields);
      }}
    >
      <FormField
        label="Username"
        name="username"
        rules={[{ message: 'Username must be at least 3 characters', minLength: 3 }]}
      >
        <Input placeholder="Please input username" />
      </FormField>

      <FormField
        label="Age"
        name="age"
        rules={[
          { message: 'Age is required', required: true },
          { message: 'Age must be at least 18', min: 18 }
        ]}
      >
        <Input placeholder="Please input age" />
      </FormField>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default FieldChange;
