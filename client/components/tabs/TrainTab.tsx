import * as React from "react";

import IconButton from "material-ui/IconButton";
import LinearProgress from "material-ui/LinearProgress";

import LogSlider from "../LogSlider";

import Trainer from "som/Trainer";

const style = require("./TrainTab.scss");


export interface IProps {
  trainer: Trainer;

  quantizationError: number;
  topographicError: number;

  isTraining: boolean;

  animationSpeed: number;
  setAnimationSpeed(value: number): void;

  startTraining(): void;
  endTraining(): void;
  iterateSingle(): void;

  reset(): void;
}

export default class TrainTab extends React.Component<IProps, void> {
  protected renderProgress() {
    let percentCompleted = Math.round(this.props.trainer.progress * 100);
    
    return <div className="progress">
      <LinearProgress
        mode="determinate"
        value={percentCompleted}
      />
      <div style={{
        marginTop: 5,
        textAlign: "center"
      }}>
        #{this.props.trainer.currentIteration}
        <span style={{
          paddingLeft: 5,
          opacity: 0.5
        }}>
          ({percentCompleted} %)
        </span>
      </div>
    </div>;
  }

  protected renderControls() {
    let toggleTraining = this.props.isTraining ? this.props.endTraining : this.props.startTraining;
    
    return <div className="controls">
      <IconButton
        iconClassName="material-icons"
        tooltip={this.props.isTraining ? "Stop training" : "Start training"}
        onClick={toggleTraining}
        disabled={this.props.trainer.hasFinished}
      >
        {this.props.isTraining ? "pause" : "play_arrow"}
      </IconButton>
      <IconButton
        iconClassName="material-icons"
        tooltip="One iteration"
        onClick={this.props.iterateSingle}
        disabled={this.props.trainer.hasFinished}
      >
        skip_next
      </IconButton>
      <IconButton
        iconClassName="material-icons"
        tooltip="Reset"
        onClick={this.props.reset}
      >
        replay
      </IconButton>
    </div>;
  }

  protected renderSpeedControl() {
    return <div className="speed-control">
      <LogSlider
        step={1}
        min={-1}
        max={3}
        value={this.props.animationSpeed}
        sliderStyle={{
          margin: 0
        }}
        onChange={(event, animationSpeed) =>
          this.props.setAnimationSpeed(animationSpeed)
        }
      />
      <b>Speed:</b> {this.props.animationSpeed}&times;
    </div>;
  }

  protected renderStatus() {
    return <div className="status">
      <b>LF:</b> {this.props.trainer.learningRate.toFixed(5)}<br />
      <b>NS:</b> {this.props.trainer.neighborSize.toFixed(5)}<br />
      <b>Eq:</b> {this.props.isTraining ? "~" : ""} {this.props.quantizationError.toFixed(3)}<br />
      <b>Et:</b> {this.props.isTraining ? "~" : ""} {this.props.topographicError.toFixed(3)}
    </div>;
  }

  render() {
    return <div className={style["train-tab"]}>
      {this.renderControls()}
      {this.renderSpeedControl()}

      {this.renderProgress()}

      <hr />

      {this.renderStatus()}
    </div>;
  }
}