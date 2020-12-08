import { RefObject } from 'react';

const GcliDisplay = ({
  contents,
  innerRef,
}: {
  contents: { id: number; text: string }[];
  innerRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      css={{
        width: '100%',
        border: '1px solid black',
        padding: '3px',
        textAlign: 'left',
        fontSize: 'small',
        flex: '1 1 auto',
        overflow: 'scroll',
      }}
      ref={innerRef}
      id="gcli-display"
    >
      {contents.map(chunk => (
        <div key={chunk.id} dangerouslySetInnerHTML={{ __html: chunk.text }} />
      ))}
    </div>
  );
};

export default GcliDisplay;
