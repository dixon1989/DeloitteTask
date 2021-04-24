import React from 'react';
import PropTypes from 'prop-types';

import Select from '../Select';
import TextInput from '../TextInput';
import Button, { TYPES as BUTTON_TYPES } from '../Button';
import styles from './launch-filter.module.scss';

// Example static option value
// the real options will need to come from the api
const options = [{ value: null, label: 'Any' }];

/**
 * Launch filter holds the filter state and writes the changes to the filters
 * back up to the parent element on click of the apply button
 */
class LaunchFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
      launchPad: 'Any',
      minYear: 'Any',
      maxYear: 'Any',
      // example state you will need to remove
      selectedOption: options[0],
      exampleInput: '',
    };
  }

  // some change handlers ready for you
  handleKeywordChange = value => {
    this.setState({ exampleInput: value });
  };
  handleLaunchPadChange = selectedOption => {
    this.setState({ launchPad: selectedOption });
  };
  handleMinYearChange = selectedOption => {
    this.setState({ minYear: selectedOption });
  };
  handleMaxYearChange = selectedOption => {
    this.setState({ maxYear: selectedOption });
  };

  // and example change handler for a <Select /> element
  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  // an example change handler for a <TextInput /> element
  handleInputChange = value => {
    this.setState({ exampleInput: value });
  };

  // handler for calling the filter update
  handleFilterUpdate = () => {
    //alert('Implement filter update logic');
    const { exampleInput, launchPad, minYear, maxYear } = this.state

    if(minYear.value !== undefined && maxYear.value !== undefined) {
      if(minYear.value > maxYear.value) {
        alert("min Year cannot be more than max Year")
        return
      }
    }

    let filter = {
      minYear: minYear.value !== undefined ? minYear.value : minYear,
      maxYear: maxYear.value !== undefined ? maxYear.value : maxYear,
      keywords: exampleInput,
      launchPad: launchPad.value !== undefined ? launchPad.value : launchPad,
    }
     this.props.onFilterChange(filter)
  };

  render() {
    const { exampleInput, launchPad, minYear, maxYear } = this.state;
    const { filterOptions } = this.props;
    if (filterOptions.minYear !== null) {
    return (
      <section className={styles.launchFilter}>
        <TextInput
          placeholder="eg Falcon"
          label="Keywords"
          value={exampleInput}
          onChange={this.handleInputChange}
          uid="example-text-input"
        />
        <Select
          label="Launch Pad"
          value={launchPad !== 'Any' ? launchPad : filterOptions.launchPad[0]}
          onChange={this.handleLaunchPadChange}
          options={filterOptions.launchPad}
          uid="example-select"
        />
        <Select
          label="Min Year"
          value={minYear !== 'Any' ? minYear : filterOptions.minYear[0]}
          onChange={this.handleMinYearChange}
          options={filterOptions.minYear}
          uid="example-select"
        />
        <Select
          label="Max Year"
          value={maxYear !== 'Any' ? maxYear : filterOptions.minYear[0]}
          onChange={this.handleMaxYearChange}
          options={filterOptions.maxYear}
          uid="example-select"
        />
        <Button onClick={this.handleFilterUpdate} type={BUTTON_TYPES.PRIMARY}>
          Apply
        </Button>
      </section>
    );
  } else {
    return null
  }
  }
}

LaunchFilter.propTypes = {

  // used to let parent component know about changes
  // to the filters
  onFilterChange: PropTypes.func,
  filterOptions: PropTypes.object
}

LaunchFilter.defaultProps = {
  onFilterChange: () => {},
  filterOptions: {}
}

export default LaunchFilter;
