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
      filterLaunches: [],
      filter: {
        minYear: 'Any',
        maxYear: 'Any',
        keywords: '',
        launchPad: 'Any',
      },
      filterOptions: {
        minYear: null,
        maxYear: null,
        launchPad: null,
      }
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
  }


  // Set distict data for data filtering
  setFilter = () => {
    const { launches } = this.state;
    let distinctYearOptions = [{ value: 'Any', label: 'Any' }];
    let launchPadOptions = [{ value: 'Any', label: 'Any' }];
    let distinctYear = [...new Set(launches.map(x => moment(x.launch_date_local).format('YYYY')))]
    let launchPad = [...new Set(launches.map(x => x.launch_site.site_name))]
    distinctYear.forEach(element => distinctYearOptions.push({value: element, label: element}));
    launchPad.forEach(element => launchPadOptions.push({value: element, label: element}));

    this.setState({
      filterOptions: {
        ...this.state.filterOptions,
        minYear: distinctYearOptions,
        maxYear: distinctYearOptions,
        launchPad: launchPadOptions
      }
    })
  }

  // Filtered launches for either a flight number / rocket name / payload id

  filteredLaunches = function (search, keys) {
    const { launches } = this.state;
    var lowSearch = search.toLowerCase();
      return launches.filter(function(element){
        return keys.some(key => {
          if(key === "flight_number") return String(element[key]).toLowerCase().includes(lowSearch) 
          if(key === "rocket") return String(element[key]['rocket_name']).toLowerCase().includes(lowSearch)
          if(key === "payloads") return String(element[key][0]['payload_id']).toLowerCase().includes(lowSearch)
          return element
        }
        );
    });
  }

  handleFilterChange = filter => {

    // Begin Filtering
    const { launches } = this.state;

    let searchFilter = this.filteredLaunches(filter.keywords, ['flight_number', 'rocket', 'payloads'])

    let isKeyword = searchFilter ? searchFilter : launches

    let filterLaunches = isKeyword.filter((element) => {

      if (filter.minYear !== "Any" && moment(element.launch_date_local).format('YYYY') < filter.minYear) {
        return false;
      }
      if (filter.maxYear !== "Any" && moment(element.launch_date_local).format('YYYY') > filter.maxYear) {
        return false;
      }
      if (filter.launchPad !== "Any" && element.launch_site.site_name.indexOf(filter.launchPad) === -1) {
        return false;
      }
      // Passes all filters
      return true;
    })
      this.setState({ filter, filterLaunches})
  };

  /**
   * Responsible for transforming the data from the launch and launchpad api's
   * into a usable and consistent format for the LaunchItem component
   */
  _launchDataTransform = (launchResp, launchPads) => {

    // Transform Data

    let isMissionFailed = false
    
    // Valiate if either both landing and launch has failed or success
    if(launchResp.launch_success || launchResp.land_success !== undefined) {
      if (launchResp.launch_success === false || launchResp.land_success === false) {
        isMissionFailed = true
      } else {
        isMissionFailed = false
      }
    } else {
      isMissionFailed = false
    }
    // Assigning Params to respective Objects
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

  // Object filtering wehther to use filtered if not filtered return all data
  objFilter = () => {
    const { launches, filterLaunches, filter } = this.state;
  if (filter.minYear === 'Any' && filter.maxYear === 'Any' && filter.launchPad === 'Any' && filter.keywords === '') {
    return launches
  } else {
    return filterLaunches
  }
}

  _renderLaunches = () => {
    
    const launchPadData = [];

    const launchFilter = () => {
      // do something with the filter obj
      return true;
    };

    const filteredLaunches = this.objFilter()
      .map(l => this._launchDataTransform(l, launchPadData))
      .filter(launchFilter);

    return filteredLaunches.map(l => <LaunchItem key={l.payloadId} {...l} />);
  };

  render() {
    const { filterOptions } = this.state;

    return (
      <section className={`${styles.launches} layout-l`}>
        <LaunchFilter filterOptions={filterOptions} onFilterChange={this.handleFilterChange} />
        <div className={styles.summary}>
          <p>Showing { this.objFilter().length } Missions</p>
        </div>
        {this.objFilter().length !== 0 ? this._renderLaunches() : <div className={styles.summary}><p>No Result has been found</p></div>}
      </section>
    );
  }
}

export default Launches;
