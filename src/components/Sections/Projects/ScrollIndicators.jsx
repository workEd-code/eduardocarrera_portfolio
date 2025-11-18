import './ScrollIndicators.css';

const ScrollIndicators = ({ scrollProgress }) => {
  return (
    <div className="scroll-indicators">
      <div className="scroll-progress">
        <div
          className="progress-bar"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>
      <div className="scroll-hint">
        <span>Scroll to navigate</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  );
};

export default ScrollIndicators;
