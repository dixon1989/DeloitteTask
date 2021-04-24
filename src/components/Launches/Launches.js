import React from 'react';
import LaunchFilter from '../LaunchFilter';
import LaunchItem from '../LaunchItem';

import styles from './launches.module.scss';
import moment from 'moment';

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
      this.setState({ launches: request })
    } catch (e) {
      console.log(e)
    }
    this.setFilter()
    console.log("AAAAA", this.state.filter)
  }

  setFilter = () => {
    const { launches } = this.state;
    let keyWords = [];
    let flightNumber = [...new Set(launches.map(x => x.flight_number.toString()))]
    let rocketName = [...new Set(launches.map(x => x.rocket.rocket_name))]
    let payLoads = [...new Set(launches.map(x => x.payloads[0].payload_id))]
    let distinctYear = [...new Set(launches.map(x => moment(x.launch_date_local).format('YYYY')))]
    let launchPad = [...new Set(launches.map(x => x.launch_site.site_name))]
    keyWords.push(...flightNumber, ...rocketName, ...payLoads)
    this.setState({
      filter: {
        ...this.state.filter,
        minYear: distinctYear,
        maxYear: distinctYear,
        keywords: keyWords,
        launchPad
      }
    })
  }

  handleFilterChange = filter => {};

  /**
   * Responsible for transforming the data from the launch and launchpad api's
   * into a usable and consistent format for the LaunchItem component
   */
  _launchDataTransform = (launchResp, launchPads) => {
    console.log("launchResp", launchResp)
    // console.log("launchPads", launchPads)
    let isMissionFailed = false
    
    if(launchResp.launch_success || launchResp.land_success !== undefined) {
      if (launchResp.launch_success === false || launchResp.land_success === false) {
        isMissionFailed = true
      } else {
        isMissionFailed = false
      }
    } else {
      isMissionFailed = false
    }

    const resultObj = {
      rocketName: launchResp.rocket.rocket_name,
      payloadId: launchResp.payloads[0].payload_id,
      launchDate: launchResp.launch_date_local,
      launchSiteName: launchResp.launch_site.site_name,
      flightNumber: launchResp.flight_number,
      missionFailed: isMissionFailed,
      missionPatchLink: launchResp.links.mission_patch ? launchResp.links.mission_patch : null,
      redditCampaignLink: launchResp.links.reddit_campaign ? launchResp.links.reddit_campaign : null,
      redditLaunchLink: launchResp.links.reddit_launch ? launchResp.links.reddit_launch : null,
      redditMediaLink: launchResp.links.reddit_media ? launchResp.links.reddit_media : null,
      pressKitLink: launchResp.links.presskit ? launchResp.links.presskit : null,
      articleLink: launchResp.links.article_link ? launchResp.links.article_link : null,
      videoLink: launchResp.links.video_link ? launchResp.links.video_link : null,
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
