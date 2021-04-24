import React from 'react';
import LaunchFilter from '../LaunchFilter';
import LaunchItem from '../LaunchItem';

import styles from './launches.module.scss';

import { getRocketData } from '../../api';


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

  componentDidMount = async () => {
    try {
      let request = await getRocketData();
      this.setState({ launches: request.results })
    } catch (e) {
      console.log(e)
    }
  }

  handleFilterChange = filter => {};

  /**
   * Responsible for transforming the data from the launch and launchpad api's
   * into a usable and consistent format for the LaunchItem component
   */
  _launchDataTransform = (launchResp, launchPads) => {
    console.log("launchResp", launchResp)
    // console.log("launchPads", launchPads)
    const resultObj = {
      rocketName: launchResp.rocketName,
      payloadId: launchResp.payloadId,
      launchDate: launchResp.launchDate,
      launchSiteName: launchResp.launchSiteName,
      flightNumber: launchResp.flightNumber,
      missionFailed: launchResp.missionFailed.toString(),
      missionPatchLink: launchResp.missionPatchLink,
      redditCampaignLink: launchResp.redditCampaignLink,
      redditLaunchLink: launchResp.redditLaunchLink,
      redditMediaLink: launchResp.redditMediaLink,
      pressKitLink: launchResp.pressKitLink,
      articleLink: launchResp.articleLink,
      videoLink: launchResp.videoLink,
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

    return filteredLaunches.map(l => <LaunchItem key={l.payloadId} {...l} />);
  };

  render() {
    const { launches } = this.state;
    return (
      <section className={`${styles.launches} layout-l`}>
        <LaunchFilter onFilterChange={this.handleFilterChange} />
        <div className={styles.summary}>
          <p>Showing {launches.length} Missions</p>
        </div>
        {this._renderLaunches()}

        {/* 
            Example launch items, you should remove these once you have
            implemented the rendering logic 
        */}
        {/* <LaunchItem />
        <LaunchItem /> */}
      </section>
    );
  }
}

export default Launches;
