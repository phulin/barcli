import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { Global } from '@emotion/react';
import GcliDisplay from './GcliDisplay';
import useInterval from '../hooks/useInterval';
import GcliInput from './GcliInput';

const App = () => {
  const [gcliContents, setGcliContents] = useState([] as { id: number; text: string }[]);
  const displayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pwd = useMemo(() => document.getElementsByTagName('body')[0]?.getAttribute('data-pwd') || '', []);

  const updateContents = useCallback(async () => {
    try {
      const response = await fetch(`/KoLmafia/messageUpdate?pwd=${pwd}`);
      const html = await response.text();
      if (html.trim().length > 0) {
        setGcliContents(gcliContents => [...gcliContents, { id: new Date().getTime(), text: html }]);
        displayRef.current?.scrollTo(0, displayRef.current?.scrollHeight);
        if (inputRef.current !== null) inputRef.current.value = '';
      }
    } catch (e) {
      console.log(e);
    }
  }, [displayRef]);

  const handleCommand = useCallback(
    async command => {
      try {
        await fetch(`/KoLmafia/submitCommand?pwd=${pwd}&cmd=${command}`, {
          method: 'GET',
        });
        for (const delayMs of [100, 200, 400, 800, 1600, 3200]) {
          setTimeout(updateContents, delayMs);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [pwd]
  );

  useInterval(updateContents, 500);

  return (
    <Fragment>
      <Global
        styles={{
          '#react-root': {
            height: 'calc(100% - 33px - 0.5rem)',
          },
          '#react-root *': {
            boxSizing: 'border-box',
          },
          '#awesome': {
            overflow: 'visible',
            height: '100%',
          },
        }}
      />
      <div
        css={{
          margin: '0.5rem -3px 0 -3px',
          padding: '0 6px',
          width: '100vw',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <GcliDisplay contents={gcliContents} innerRef={displayRef} />
        <GcliInput onCommand={handleCommand} innerRef={inputRef} />
      </div>
    </Fragment>
  );
};

export default App;
