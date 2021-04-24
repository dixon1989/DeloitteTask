import React, { Component } from 'react';

import './assets/styles/base.scss';

import Header from './components/Header';
import Footer from './components/Footer';
import Launches from './components/Launches';

/**
 * Base component for the application
 */
class App extends Component {

  constructor(props){
    super(props)
    //creates a reference for your element to use
    this.myMainContent = React.createRef()
 }

  /**
   * The header component contains a scroll down button that when clicked
   * should scroll the page down to where the main content starts
   */
  handleScrollClick = () => {
    alert('Implement scroll down logic');
      // This function will define where the ref is and scroll to the ref
      this.handleReusableComponent(this.myMainContent)
  };

  /**
   * The footer contains a back to top button that should scrool
   * the page back up to where the results start
   */
  handleBackToTopClick = () => {
    alert('Implement back to top logic');
    this.handleReusableComponent(this.myMainContent)
  };

  handleReusableComponent = (content) => {
    if(content.current){
      content.current.scrollIntoView({ 
          behavior: "smooth"
      })
  }
  }

  render() {
    return (
      <div className="App">
        <Header onScrollClick={this.handleScrollClick} />
        <main ref={this.myMainContent}>
          <Launches />
        </main>
        <Footer onBackToTopClick={this.handleBackToTopClick} />
      </div>
    );
  }
}

export default App;
