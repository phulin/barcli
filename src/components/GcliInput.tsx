import { RefObject, useCallback } from 'react';

const GcliInput = ({
  onCommand,
  innerRef,
}: {
  onCommand: (command: string) => void;
  innerRef: RefObject<HTMLInputElement>;
}) => {
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      if (innerRef.current?.value) {
        onCommand(innerRef.current.value);
      }
    },
    [onCommand]
  );
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" css={{ width: '100%', margin: '0.5rem 0' }} ref={innerRef} />
    </form>
  );
};

export default GcliInput;
