import React from 'react';
import Header from './Header';
import TicketList from './TicketList';
import NewTicketControl from './NewTicketControl';
import Error404 from './Error404';
import { Switch, Route } from 'react-router-dom';
import Moment from 'moment';
import Admin from './Admin';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      masterTicketList: {},
      selectedTicket: null
    };
    this.handleAddingNewTicketToList = this.handleAddingNewTicketToList.bind(this);
    this.handleChangingSelectedTicket = this.handleChangingSelectedTicket.bind(this);
  }

  handleChangingSelectedTicket(ticketId) {
    this.setState({ selectedTicket: ticketId });
  }

  handleAddingNewTicketToList(newTicket) {
    var newMasterTicketList = Object.assign({}, this.state.masterTicketList, {
      [newTicket.id]: newTicket
    });
    newMasterTicketList[newTicket.id].formattedWaitTime = newMasterTicketList[newTicket.id].timeOpen.fromNow(true);
    this.setState({masterTicketList: newMasterTicketList});
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(),
      5000
      );
  }

  componentWillUnmount() {
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateTicketElapsedWaitTime() {
    // console.log(this.state);
    let newMasterTicketList = Object.assign({}, this.state.masterTicketList);
    Object.keys(newMasterTicketList).forEach(ticketId => {
      newMasterTicketList[ticketId].formattedWaitTime = (newMasterTicketList[ticketId].timeOpen).fromNow(true);
    });
    this.setState({ masterTicketList: newMasterTicketList });
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' render={() => <TicketList ticketList={this.state.masterTicketList} />} />
          <Route path='/newticket' render={() => <NewTicketControl onNewTicketCreation={this.handleAddingNewTicketToList} />} />
          <Route path='/admin' render={(props) => <Admin 
            ticketList={this.state.masterTicketList} 
            currentRouterPath={props.location.pathname} 
            onTicketSelection={this.handleChangingSelectedTicket} 
            selectedTicket={this.state.selectedTicket} />} />
          <Route component={Error404} />
        </Switch>
      </div>
    );
  }
}

export default App;
