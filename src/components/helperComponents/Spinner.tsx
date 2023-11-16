interface SpinnerProps {
  light?: boolean;
  h100?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ light, h100 }) => {
  return (
    <div className={`spinner-container${h100 ? " h100" : ""}`}>
      <div className={`spinner${light ? " light" : ""}`}></div>
    </div>
  );
};

export default Spinner;
