import { useEffect, useRef, useState } from 'react';
import styles from './bdrsGenerator.module.css';

function handleGetBetweenValue(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export default function BorderRadiusGenerator() {
  const [xBdrs, setXBdrs] = useState({
    xT: 30,
    xR: 70,
    xB: 70,
    xL: 30,
  });
  const [yBdrs, setYBdrs] = useState({
    yT: 30,
    yR: 30,
    yB: 70,
    yL: 70,
  });

  const { xT, xR, xB, xL } = xBdrs;
  const { yT, yR, yB, yL } = yBdrs;

  const [isDragging, setIsDragging] = useState(false);

  const draggingElementRef = useRef(null);
  const wrapperRef = useRef(null);
  const codeRef = useRef(null);
  const alarmRef = useRef(null);

  function handleOnMouseDown(e) {
    e.preventDefault();

    draggingElementRef.current = e.target;

    setIsDragging(true);
  }

  function handleMouseMove(e) {
    if (isDragging) {
      const dir = draggingElementRef.current.id.includes('x') ? 'x' : 'y';

      if (dir === 'x') {
        const currentMouseCoord = { x: e.clientX };
        const { width: wrapperWidth, left: WrapperLeft } =
          wrapperRef.current.getBoundingClientRect();

        const LeftPercent = handleGetBetweenValue(
          (
            ((currentMouseCoord.x - WrapperLeft).toFixed(0) * 100) /
            wrapperWidth
          ).toFixed(0),
          0,
          100
        );

        draggingElementRef.current.style.left = `${LeftPercent}%`;

        handleBdrs(dir);
      }

      if (dir === 'y') {
        const currentMouseCoord = { y: e.clientY };
        const { height: wrapperHeight, top: wrapperTop } =
          wrapperRef.current.getBoundingClientRect();

        const topPercent = handleGetBetweenValue(
          (
            ((currentMouseCoord.y - wrapperTop).toFixed(0) * 100) /
            wrapperHeight
          ).toFixed(0),
          0,
          100
        );

        draggingElementRef.current.style.top = `${topPercent}%`;

        handleBdrs(dir);
      }
    }
  }

  function handleOnMouseUp(e) {
    if (isDragging) {
      draggingElementRef.current.removeEventListener(
        'mousedown',
        handleOnMouseDown
      );
      setIsDragging(false);
    }
  }

  function handleBdrs() {
    const [dir, angle1, angle2] = draggingElementRef.current.id.split('');

    if (dir === 'x') {
      const { clientWidth: wrapperWidth } = wrapperRef.current;
      const { offsetLeft } = draggingElementRef.current;

      let key1, key2, percent1, percent2;
      if (angle1 === 'L' || angle1 === 'T') {
        percent1 = ((100 * offsetLeft) / wrapperWidth).toFixed(0);
        key1 = dir + angle1;
      }

      if (angle2 === 'R' || angle2 === 'B') {
        percent2 = ((100 * (wrapperWidth - offsetLeft)) / wrapperWidth).toFixed(
          0
        );
        key2 = dir + angle2;
      }
      setXBdrs((prev) => ({ ...prev, [key1]: percent1, [key2]: percent2 }));
    }

    if (dir === 'y') {
      const { clientHeight: wrapperHeight } = wrapperRef.current;
      const { offsetTop } = draggingElementRef.current;

      let key1, key2, percent1, percent2;

      if (angle1 === 'L' || angle1 === 'B') {
        percent1 = (
          (100 * (wrapperHeight - offsetTop)) /
          wrapperHeight
        ).toFixed(0);
        key1 = dir + angle1;
      }

      if (angle2 === 'R' || angle2 === 'T') {
        percent2 = ((100 * offsetTop) / wrapperHeight).toFixed(0);
        key2 = dir + angle2;
      }

      setYBdrs((prev) => ({ ...prev, [key1]: percent1, [key2]: percent2 }));
    }
  }

  async function handleCopyClipboard(e) {
    e.stopPropagation();
    let content = codeRef.current.innerHTML;

    try {
      await navigator.clipboard.writeText(content);
      alarmRef.current.style.opacity = '1';
      alarmRef.current.style.visibility = 'visible';

      setTimeout(() => {
        alarmRef.current.style.opacity = '0';
        alarmRef.current.style.visibility = 'hidden';
      }, 2000);
    } catch (err) {
      console.err('failed to copy', err);
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleOnMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleOnMouseUp);
    };
  });

  return (
    <div className={styles.bdrs_generator_app}>
      <h1 className={styles.title}>FANCY-BORDER-RADIUS</h1>
      <div className={styles.radius_generator} ref={wrapperRef}>
        <div
          className={styles.shape}
          style={{
            borderRadius: `${xT}% ${xR}% ${xB}% ${xL}% / ${yT}% ${yR}% ${yB}% ${yL}%`,
          }}
        />
        <div
          className={`${styles.handler} ${styles.top}`}
          id='xTR'
          onMouseDown={handleOnMouseDown}
        />
        <div
          className={`${styles.handler} ${styles.right}`}
          id='yBR'
          onMouseDown={handleOnMouseDown}
        />
        <div
          className={`${styles.handler} ${styles.bottom}`}
          id='xLB'
          onMouseDown={handleOnMouseDown}
        />
        <div
          className={`${styles.handler} ${styles.left}`}
          id='yLT'
          onMouseDown={handleOnMouseDown}
        />
      </div>
      <div className={styles.output}>
        <div className={styles.output_alarm} ref={alarmRef}>
          Copied to Clipboard
        </div>
        <span className={styles.output_label}>border-radius:</span>
        <div className={styles.output_group}>
          <span className={styles.output_code} ref={codeRef}>
            {xT}% {xR}% {xB}% {xL}% / {yT}% {yR}% {yB}% {yL}%
          </span>
          <button
            className={styles.output_handler}
            onClick={(e) => handleCopyClipboard(e)}
          >
            COPY
          </button>
        </div>
      </div>
    </div>
  );
}
