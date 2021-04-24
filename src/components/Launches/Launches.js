import React from 'react';
import LaunchFilter from '../LaunchFilter';
import LaunchItem from '../LaunchItem';

import styles from './launches.module.scss';

/**
 * Launches component responsible for showing the filter component,
 * handling the fetching and filtering of the launch data and rendering
 * the launches that match the selected filters
 */
class Launches extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      error: null,
      launches: [],
      filter: {
        minYear: null,
        maxYear: null,
        keywords: null,
        launchPad: null,
      },
    };
  }

  handleFilterChange = filter => {};

  /**
   * Responsible for transforming the data from the launch and launchpad api's
   * into a usable and consistent format for the LaunchItem component
   */
  _launchDataTransform = (launchResp, launchPads) => {
    const resultObj = {
      rocketName: null,
      payloadId: null,
      launchDate: null,
      launchSiteName: null,
      flightNumber: null,
      missionFailed: null,
      missionPatchLink: null,
      redditCampaignLink: null,
      redditLaunchLink: null,
      redditMediaLink: null,
      pressKitLink: null,
      articleLink: null,
      videoLink: null,
    };

    return resultObj;
  };

  _renderLaunches = () => {
    const { launches } = this.state;

    const launchPadData = [];

    const launchFilter = () => {
      // do something with the filter obj
      return true;
    };

    const filteredLaunches = launches
      .map(l => this._launchDataTransform(l, launchPadData))
      .filter(launchFilter);

    return filteredLaunches.map(l => <LaunchItem {...l} />);
  };

  render() {
    return (
      <section className={`${styles.launches} layout-l`}>
        <LaunchFilter onFilterChange={this.handleFilterChange} />
        <div className={styles.summary}>
          <p>Showing 2 Missions</p>
        </div>
        {this._renderLaunches()}

        {/* 
            Example launch items, you should remove these once you have
            implemented the rendering logic 
        */}
        <LaunchItem />
        <LaunchItem />
      </section>
    );
  }
}

export default Launches;
