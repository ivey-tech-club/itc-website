export const ANIMATION_CYCLE_SECONDS = 8.6;

export interface GridConfiguration {
  columns: number;
  rows: number;
  rowGap: number;
  leftFocus: readonly [number, number];
  rightFocus: readonly [number, number];
}

export interface GridLayout extends GridConfiguration {
  width: number;
  height: number;
  cellSize: number;
  top: number;
}

export interface GridCell {
  x: number;
  y: number;
  restingOpacity: number;
  phaseOffset: number;
}

export interface GridRenderModel extends GridLayout {
  cells: GridCell[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getGridConfiguration(compact: boolean): GridConfiguration {
  return compact
    ? {
        columns: 6,
        rows: 12,
        rowGap: 12,
        leftFocus: [1.5, 4],
        rightFocus: [4.5, 8.5],
      }
    : {
        columns: 24,
        rows: 12,
        rowGap: 10,
        leftFocus: [5, 2],
        rightFocus: [19, 9],
      };
}

export function getGridLayout({
  width,
  height,
  viewportWidth,
  compact,
}: {
  width: number;
  height: number;
  viewportWidth: number;
  compact: boolean;
}): GridLayout {
  const configuration = getGridConfiguration(compact);
  const idealCellSize = compact
    ? clamp(viewportWidth * 0.115, 36, 92)
    : clamp(viewportWidth * 0.03, 22, 52);
  const cellSize = compact
    ? Math.min(
        idealCellSize,
        width / configuration.columns,
        Math.max(0, (height - 90) / configuration.rows),
      )
    : idealCellSize;
  const rows = compact
    ? configuration.rows
    : Math.max(
        configuration.rows,
        Math.floor((height + configuration.rowGap) / (cellSize + configuration.rowGap)),
      );
  const contentHeight =
    cellSize * rows + configuration.rowGap * (rows - 1);

  return {
    ...configuration,
    width,
    height,
    cellSize,
    rows,
    top: Math.max(1, (height - contentHeight) / 2),
  };
}

export function getCellRect(layout: GridLayout, column: number, row: number) {
  const columnStep =
    layout.columns > 1 ? (layout.width - layout.cellSize) / (layout.columns - 1) : 0;

  return {
    x: column * columnStep,
    y: layout.top + row * (layout.cellSize + layout.rowGap),
    width: layout.cellSize,
    height: layout.cellSize,
  };
}

function getFocusWeight(
  column: number,
  row: number,
  focus: readonly [number, number],
  rowRadius: number,
) {
  return Math.exp(
    -((column - focus[0]) ** 2 / (2 * 4.5 ** 2) +
      (row - focus[1]) ** 2 / (2 * rowRadius ** 2)),
  );
}

type Keyframe = { offset: number; value: number };

const OPACITY_KEYFRAMES: readonly Keyframe[] = [
  { offset: 0, value: 0 },
  { offset: 0.42, value: 0.08 },
  { offset: 0.58, value: 0.17 },
  { offset: 0.76, value: 0.04 },
  { offset: 1, value: 0 },
];

const SPECKLE_KEYFRAMES: readonly Keyframe[] = [
  { offset: 0, value: 0 },
  { offset: 0.24, value: 0 },
  { offset: 0.42, value: 0.08 },
  { offset: 0.54, value: 0.36 },
  { offset: 0.67, value: 0.1 },
  { offset: 1, value: 0 },
];

function sampleKeyframes(progress: number, keyframes: readonly Keyframe[]) {
  for (let index = 1; index < keyframes.length; index += 1) {
    const previous = keyframes[index - 1];
    const next = keyframes[index];

    if (progress <= next.offset) {
      const segmentProgress =
        (progress - previous.offset) / (next.offset - previous.offset);
      return previous.value + (next.value - previous.value) * clamp(segmentProgress, 0, 1);
    }
  }

  return keyframes[keyframes.length - 1].value;
}

function getRestingOpacity(
  column: number,
  row: number,
  configuration: GridConfiguration,
) {
  const leftWeight = getFocusWeight(column, row, configuration.leftFocus, 2.8);
  const rightWeight = getFocusWeight(column, row, configuration.rightFocus, 3.4);

  return 0.1 + Math.max(leftWeight, rightWeight) * 0.26;
}

function getAnimationProgress(phaseOffset: number, elapsedSeconds: number) {
  const remainder =
    ((elapsedSeconds + phaseOffset) % ANIMATION_CYCLE_SECONDS +
      ANIMATION_CYCLE_SECONDS) %
    ANIMATION_CYCLE_SECONDS;

  return remainder / ANIMATION_CYCLE_SECONDS;
}

function getCellVisualStateForValues(
  restingOpacity: number,
  phaseOffset: number,
  elapsedSeconds: number,
) {
  const progress = getAnimationProgress(phaseOffset, elapsedSeconds);

  return {
    opacity: clamp(
      restingOpacity + sampleKeyframes(progress, OPACITY_KEYFRAMES),
      0,
      1,
    ),
    speckleOpacity: clamp(sampleKeyframes(progress, SPECKLE_KEYFRAMES), 0, 1),
  };
}

export function getGridRenderModel({
  width,
  height,
  viewportWidth,
  compact,
}: {
  width: number;
  height: number;
  viewportWidth: number;
  compact: boolean;
}): GridRenderModel {
  const layout = getGridLayout({ width, height, viewportWidth, compact });
  const configuration = getGridConfiguration(compact);
  const cells: GridCell[] = [];

  for (let row = 0; row < layout.rows; row += 1) {
    for (let column = 0; column < layout.columns; column += 1) {
      const { x, y } = getCellRect(layout, column, row);

      cells.push({
        x,
        y,
        restingOpacity: getRestingOpacity(column, row, configuration),
        phaseOffset: (column * 0.11 + row * 0.17) % ANIMATION_CYCLE_SECONDS,
      });
    }
  }

  return { ...layout, cells };
}

export function getCellVisualStateFromModel(
  cell: GridCell,
  elapsedSeconds: number,
) {
  return getCellVisualStateForValues(
    cell.restingOpacity,
    cell.phaseOffset,
    elapsedSeconds,
  );
}

export function getCellVisualState(
  column: number,
  row: number,
  elapsedSeconds: number,
  compact: boolean,
) {
  const configuration = getGridConfiguration(compact);
  const phaseOffset = (column * 0.11 + row * 0.17) % ANIMATION_CYCLE_SECONDS;
  return getCellVisualStateForValues(
    getRestingOpacity(column, row, configuration),
    phaseOffset,
    elapsedSeconds,
  );
}
