import { createRef, forwardRef } from 'react';
import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Checkbox, CheckboxCard, CheckboxGroup, CheckboxGroupCard } from '../src/preset/checkbox';
import {
  CheckboxGroupProvider,
  useCheckboxGroup
} from '../src/components/checkbox/CheckboxGroupContext';
import type {
  CheckboxCardProps,
  CheckboxProps
} from '../src/components/checkbox/types';

const checkboxMocks = vi.hoisted(() => ({
  emitCardIndeterminate: false,
  emitControlIndeterminate: false
}));

interface MockCheckboxProps extends CheckboxProps {
  /** Checkbox label content used to identify the mocked control. */
  children?: ReactNode;

  /** Group callback that receives the simulated checked state. */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
}

interface MockCheckboxCardProps extends CheckboxCardProps {
  /** Card label content used to identify the mocked card control. */
  label?: ReactNode;

  /** Group callback that receives the simulated checked state. */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
}

vi.mock('../src/components/checkbox/CheckboxUI', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/components/checkbox/CheckboxUI')>();
  const ActualCheckbox = actual.default;

  const MockCheckbox = forwardRef<HTMLDivElement, MockCheckboxProps>((props, ref) => {
    const { children, onCheckedChange } = props;

    if (checkboxMocks.emitControlIndeterminate) {
      return (
        <button type="button" onClick={() => onCheckedChange?.('indeterminate')}>
          {children}
        </button>
      );
    }

    return <ActualCheckbox {...props} ref={ref} />;
  });

  return {
    ...actual,
    default: MockCheckbox
  };
});

vi.mock('../src/components/checkbox/CheckboxCard', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/components/checkbox/CheckboxCard')>();
  const ActualCheckboxCard = actual.default;

  const MockCheckboxCard = forwardRef<HTMLLabelElement, MockCheckboxCardProps>((props, ref) => {
    const { label, onCheckedChange } = props;

    if (checkboxMocks.emitCardIndeterminate) {
      return (
        <button type="button" onClick={() => onCheckedChange?.('indeterminate')}>
          {label}
        </button>
      );
    }

    return <ActualCheckboxCard {...props} ref={ref} />;
  });

  return {
    ...actual,
    default: MockCheckboxCard
  };
});

interface CheckboxGroupConsumerProps {
  /** Test id used to expose the current context value in assertions. */
  testId: string;
}

const CheckboxGroupConsumer = (props: CheckboxGroupConsumerProps) => {
  const { testId } = props;
  const context = useCheckboxGroup();

  return <span data-testid={testId}>{context ? context.value.join(',') : 'none'}</span>;
};

beforeEach(() => {
  checkboxMocks.emitCardIndeterminate = false;
  checkboxMocks.emitControlIndeterminate = false;
});

describe('Checkbox', () => {
  it('associates label content with the checkbox control', () => {
    render(
      <Checkbox
        checked
        checkedIcon={<span>Checked icon</span>}
        forceMountIndicator
      >
        Accept terms
      </Checkbox>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    expect(checkbox).toBeChecked();
    expect(screen.getByText('Checked icon')).toBeInTheDocument();
  });

  it('renders the indeterminate state with the configured indicator', () => {
    render(
      <Checkbox
        checked="indeterminate"
        forceMountIndicator
        indeterminateIcon={<span>Partial icon</span>}
      >
        Select all
      </Checkbox>
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });

    expect(checkbox).toBePartiallyChecked();
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    expect(screen.getByText('Partial icon')).toBeInTheDocument();
  });

  it('applies slot class names, root props and forwards refs without label content', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Checkbox
        ref={ref}
        className="custom-checkbox-root"
        classNames={{
          control: 'custom-control',
          indicator: 'custom-indicator',
          label: 'custom-label',
          root: 'configured-root'
        }}
        id="custom-checkbox"
        rootProps={{ 'aria-label': 'Checkbox root' }}
      />
    );

    const root = screen.getByLabelText('Checkbox root');

    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-slot', 'checkbox-root');
    expect(root).toHaveClass('custom-checkbox-root');
    expect(root).not.toHaveClass('configured-root');
    expect(screen.getByRole('checkbox')).toHaveClass('custom-control');
    expect(document.querySelector('[data-slot="checkbox-indicator"]')).not.toBeInTheDocument();
    expect(document.querySelector('label')).not.toBeInTheDocument();
  });
});

describe('CheckboxGroup', () => {
  it('updates uncontrolled values and emits the selected value list', async () => {
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup
        defaultValue={['read']}
        items={[
          { label: 'Read', value: 'read' },
          { label: 'Write', value: 'write' }
        ]}
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Read' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Write' })).not.toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Write' }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Write' })).toBeChecked();
    });
    expect(onValueChange).toHaveBeenLastCalledWith(['read', 'write']);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Read' }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Read' })).not.toBeChecked();
    });
    expect(onValueChange).toHaveBeenLastCalledWith(['write']);
  });

  it('honors controlled values and disables group items', () => {
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup
        disabled
        className="custom-checkbox-group"
        classNames={{ groupRoot: 'configured-group-root' }}
        items={[
          { label: 'Read', value: 'read' },
          { label: 'Write', value: 'write' }
        ]}
        orientation="vertical"
        value={['read']}
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('group');
    const read = screen.getByRole('checkbox', { name: 'Read' });
    const write = screen.getByRole('checkbox', { name: 'Write' });

    expect(group).toHaveAttribute('data-slot', 'checkbox-group');
    expect(group).toHaveClass('custom-checkbox-group', 'flex-col');
    expect(group).not.toHaveClass('configured-group-root');
    expect(read).toBeChecked();
    expect(read).toBeDisabled();
    expect(write).toBeDisabled();

    fireEvent.click(write);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('emits next values from controlled groups without mutating DOM state', () => {
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup
        items={[
          { label: 'Read', value: 'read' },
          { label: 'Write', value: 'write' }
        ]}
        value={['read']}
        onValueChange={onValueChange}
      />
    );

    const write = screen.getByRole('checkbox', { name: 'Write' });

    fireEvent.click(write);

    expect(onValueChange).toHaveBeenLastCalledWith(['read', 'write']);
    expect(write).not.toBeChecked();
  });

  it('supports empty string item values in group selection state', () => {
    render(
      <CheckboxGroup
        defaultValue={['']}
        items={[
          { label: 'Empty value', value: '' },
          { label: 'Named value', value: 'named' }
        ]}
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Empty value' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Named value' })).not.toBeChecked();
  });

  it('ignores indeterminate change payloads from item controls', () => {
    const onValueChange = vi.fn();

    checkboxMocks.emitControlIndeterminate = true;

    render(
      <CheckboxGroup
        items={[{ label: 'Mixed permission', value: 'mixed' }]}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mixed permission' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('exposes the selected values through checkbox group context', () => {
    const onValueChange = vi.fn();

    render(
      <>
        <CheckboxGroupConsumer testId="empty-context" />
        <CheckboxGroupProvider
          value={{
            onValueChange,
            value: ['read', 'write']
          }}
        >
          <CheckboxGroupConsumer testId="filled-context" />
        </CheckboxGroupProvider>
      </>
    );

    expect(screen.getByTestId('empty-context')).toHaveTextContent('none');
    expect(screen.getByTestId('filled-context')).toHaveTextContent('read,write');
  });
});

describe('CheckboxCard', () => {
  it('renders checked card content with icon, description and right-positioned control', () => {
    const ref = createRef<HTMLLabelElement>();

    render(
      <CheckboxCard
        ref={ref}
        checked
        checkboxPosition="right"
        checkedIcon={<span>Checked card icon</span>}
        className="custom-card"
        classNames={{
          card: 'configured-card',
          cardContent: 'custom-card-content',
          cardDescription: 'custom-card-description',
          cardLabel: 'custom-card-label',
          control: 'custom-card-control',
          indicator: 'custom-card-indicator'
        }}
        description="Receive product updates."
        forceMountIndicator
        icon={<span aria-label="mail icon">M</span>}
        label="Email"
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Email/ });

    expect(ref.current).toHaveAttribute('data-slot', 'checkbox-card');
    expect(ref.current).toHaveAttribute('data-state', 'checked');
    expect(ref.current).toHaveClass('custom-card');
    expect(ref.current).not.toHaveClass('configured-card');
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveClass('custom-card-control');
    expect(screen.getByText('Checked card icon').parentElement).toHaveClass('custom-card-indicator');
    expect(screen.getByLabelText('mail icon')).toHaveTextContent('M');
    expect(screen.getByText('Email')).toHaveClass('custom-card-label');
    expect(screen.getByText('Receive product updates.')).toHaveClass('custom-card-description');
  });

  it('renders indeterminate and disabled card states', () => {
    render(
      <CheckboxCard
        checked="indeterminate"
        disabled
        checkboxPosition="left"
        description="Partial selection."
        forceMountIndicator
        indeterminateIcon={<span>Partial card icon</span>}
        label="Partial"
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Partial/ });

    expect(checkbox).toBePartiallyChecked();
    expect(checkbox).toBeDisabled();
    expect(screen.getByText('Partial').closest('[data-slot="checkbox-card"]')).toHaveAttribute(
      'data-state',
      'indeterminate'
    );
    expect(screen.getByText('Partial card icon')).toBeInTheDocument();
  });

  it('renders card controls without label or description content', () => {
    render(<CheckboxCard aria-label="Standalone card" />);

    expect(screen.getByRole('checkbox', { name: 'Standalone card' })).not.toBeChecked();
    expect(document.querySelector('[data-slot="checkbox-card-content"]')).not.toBeInTheDocument();
  });
});

describe('CheckboxGroupCard', () => {
  it('updates uncontrolled card values and emits the selected list', async () => {
    const onValueChange = vi.fn();

    render(
      <CheckboxGroupCard
        checkboxPosition="right"
        classNames={{ groupRoot: 'custom-card-group' }}
        defaultValue={['email']}
        items={[
          { icon: <span aria-label="email icon">E</span>, label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' }
        ]}
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByRole('group')).toHaveAttribute('data-slot', 'checkbox-group-card');
    expect(screen.getByRole('group')).toHaveClass('custom-card-group');
    expect(screen.getByLabelText('email icon')).toHaveTextContent('E');
    expect(screen.getByRole('checkbox', { name: /Email/ })).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: /SMS/ }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /SMS/ })).toBeChecked();
    });
    expect(onValueChange).toHaveBeenLastCalledWith(['email', 'sms']);

    fireEvent.click(screen.getByRole('checkbox', { name: /Email/ }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /Email/ })).not.toBeChecked();
    });
    expect(onValueChange).toHaveBeenLastCalledWith(['sms']);
  });

  it('honors controlled card values and disabled card items', () => {
    const onValueChange = vi.fn();

    render(
      <CheckboxGroupCard
        disabled
        items={[
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' }
        ]}
        value={['email']}
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByRole('checkbox', { name: /Email/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /Email/ })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: /SMS/ })).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox', { name: /SMS/ }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('emits next values from controlled card groups without mutating DOM state', () => {
    const onValueChange = vi.fn();

    render(
      <CheckboxGroupCard
        items={[
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' }
        ]}
        value={['email']}
        onValueChange={onValueChange}
      />
    );

    const sms = screen.getByRole('checkbox', { name: /SMS/ });

    fireEvent.click(sms);

    expect(onValueChange).toHaveBeenLastCalledWith(['email', 'sms']);
    expect(sms).not.toBeChecked();
  });

  it('ignores indeterminate change payloads from card controls', () => {
    const onValueChange = vi.fn();

    checkboxMocks.emitCardIndeterminate = true;

    render(
      <CheckboxGroupCard
        items={[{ label: 'Mixed card', value: 'mixed' }]}
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mixed card' }));

    expect(onValueChange).not.toHaveBeenCalled();
  });
});
