/** The common type namespace */
declare global {
  namespace Common {
    /** The strategic pattern */
    interface StrategicPattern {
      /** If the condition is true, then call the action function */
      callback: () => void;
      /** The condition */
      condition: boolean;
    }

    /**
     * The option type
     *
     * @property value: The option value
     * @property label: The option label
     */
    type Option<K = string, M = string> = { label: M; value: K };

    type YesOrNo = 'N' | 'Y';

    type EnableStatus = '1' | '2';

    /** Add null to all properties */
    type RecordNullable<T> = {
      [K in keyof T]?: T[K] | null;
    };
  }
}

export {};
