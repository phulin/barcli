import { RefObject, useCallback, useState } from 'react';

const GcliInput = ({
  onCommand,
  innerRef,
}: {
  onCommand: (command: string) => void;
  innerRef: RefObject<HTMLInputElement>;
}) => {
  const [commandHistory, setCommandHistory] = useState([] as string[]);
  const [commandHistoryPosition, setCommandHistoryPosition] = useState(0);
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      if (innerRef.current?.value) {
        setCommandHistory([...commandHistory, innerRef.current.value]);
        setCommandHistoryPosition(commandHistory.length + 1);
        onCommand(innerRef.current.value);
      }
    },
    [onCommand, commandHistory]
  );

  const handleKeyDown = useCallback(
    event => {
      if (event.key === 'ArrowUp' && commandHistoryPosition > 0) {
        setCommandHistoryPosition(commandHistoryPosition - 1);
        if (innerRef.current) innerRef.current.value = commandHistory[commandHistoryPosition - 1];
      } else if (event.key === 'ArrowDown' && commandHistoryPosition < commandHistory.length) {
        setCommandHistoryPosition(Math.min(commandHistoryPosition + 1, commandHistory.length));
        if (innerRef.current) {
          if (commandHistoryPosition + 1 < commandHistory.length) {
            innerRef.current.value = commandHistory[commandHistoryPosition + 1];
          } else {
            innerRef.current.value = '';
          }
        }
      }
    },
    [commandHistory, commandHistoryPosition]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" css={{ width: '100%', margin: '0.5rem 0' }} onKeyDown={handleKeyDown} ref={innerRef} />
    </form>
  );
};

export default GcliInput;
