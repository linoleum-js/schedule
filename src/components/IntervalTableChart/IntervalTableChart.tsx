
import { Line, ResponsiveContainer, Area, ComposedChart, Bar, Cell } from 'recharts';

import { IntervalTableGrid } from '../IntervalTableGrid/IntervalTableGrid';

import { useAppSelector } from '@/hooks';
import { AppState } from '@/redux/store';
import { STEP_SIZE_IN_MINUTES, SCHEDULE_LENGTH } from '@/constants';

import styles from './IntervalTableChart.module.css';

interface GraphDataPoint {
  time: number;
  capacity: number;
  load: number;
  lowDot?: number;
  highDot?: number;
}

const colorGreen = '#50BF4C';
const colorRed = '#FF5319';

const getDiffFillColor = (data: GraphDataPoint) => {
  const { capacity, load, time } = data;
  let fillColor = 'transparent';
  if (time % 30 === 0 && time % 60 !== 0) {
    fillColor = capacity - load > 0 ? colorGreen : colorRed;
  }
  return fillColor;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const fillColor = getDiffFillColor(payload);
  return (
    <circle cx={cx - 1} cy={cy} r={3} stroke="transparent" strokeWidth={3} fill={fillColor} />
  );
};

// TODO optimize performance
export const IntervalTableChart = () => {
  const data = useAppSelector((state: AppState) => state.scheduleLists.present);
  const activities = useAppSelector((state: AppState) => state.activityTypes.list);
  const callLoad = useAppSelector((state: AppState) => state.callLoad.list);
  const { list } = data;

  const animationDuration = 200;
  const interpolation = 'basis';

  const isWorkingType = (type: string) => {
    return activities.find(({ name }) => name === type)?.isWorking;
  };

  // TODO refactor
  const calcCapacityTimeline = () => {
    const result = [];
    for (let time = 0; time < SCHEDULE_LENGTH; time += STEP_SIZE_IN_MINUTES) {
      // TODO refactor
      let capacity = list.reduce((acc, item) => {
        if (item.list.some(({ start, end, type }) => start <= time && time <= end && isWorkingType(type))) {
          return acc + 1;
        }
        return acc;
      }, 0);
      result.push({ time, capacity });
    }
    return result;
  };

  const capacityTimeline = calcCapacityTimeline();

  const graphData = capacityTimeline.map((item, index) => {
    return { ...item, load: callLoad[index]?.value };
  });

  // gradient through gradientOffset 

  return (
    <div className={styles.intervalChartWrapper}>
      <div className={styles.intervalChartGridWrapper}>
        <IntervalTableGrid />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={graphData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8EEFF0" stopOpacity={0.7}/>
              <stop offset="10%" stopColor="#8EEFF0" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.5}/>
            </linearGradient>
          </defs>
          <Area
            type={interpolation}
            dataKey="load"
            stroke="#8EEFF0"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUv)"
            animationDuration={animationDuration}
          />
          <Line
            type={interpolation}
            dataKey="capacity"
            stroke="#cccccc"
            animationDuration={animationDuration}
            dot={false}
          />
          <Bar dataKey="capacity" barSize={1} fill="green">
            {graphData.map((item, index) => {
              const fillColor = getDiffFillColor(item);
              return (
                <Cell key={index} fill={fillColor} />
              );
            })}
          </Bar>

          <Line
            type={interpolation}
            dataKey="capacity"
            stroke="transparent"
            animationDuration={animationDuration}
            dot={<CustomDot />}
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};