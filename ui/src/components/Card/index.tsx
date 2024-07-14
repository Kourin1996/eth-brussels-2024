import classes from "./index.module.css";

type Props = {
  src1: string;
  src2: string;
  width?: string;
  height?: string;
};

export const Card = (props: Props) => {
  const { src1, src2, width, height } = props;

  return (
    <div className={classes.content} style={{ width, height }}>
      <div className={classes.back}>
        <img src={src2} style={{ width, height }} />
      </div>
      <div className={classes.front}>
        <img src={src1} style={{ width, height }} />
      </div>
    </div>
  );
};
