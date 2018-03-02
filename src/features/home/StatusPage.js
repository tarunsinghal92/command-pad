import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Icon, Input, Modal, Popover, Row } from 'antd';
import { Link } from 'react-router';
import CmdList from './CmdList';
import { runCmd, stopCmd, deleteCmd, reorderCmds, clearOutput, selectCmd } from './redux/actions';
import { ConsoleOutput, Welcome } from './';

export class StatusPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleBeginEdit = this.handleBeginEdit.bind(this);
    this.handleEndEdit = this.handleEndEdit.bind(this);
  }

  state = {
    editing: false,
  };

  handleBeginEdit() {
    this.setState({
      editing: true,
    });
  }

  handleEndEdit() {
    this.setState({
      editing: false,
    });
  }

  renderLoading() {
    return <div className="home-status-page loading" />;
  }

  render() {
    const { home } = this.props;

    const { runCmd, stopCmd, deleteCmd, reorderCmds, clearOutput, selectCmd } = this.props.actions; /* eslint no-shadow: 0 */
    const { editing } = this.state;
    if (!home.appVersion) return this.renderLoading();

    const allCmds = home.cmdIds.map(id => home.cmdById[id]);
    const currentCmd = home.cmdById[this.props.home.selectedCmd];
    const outputs = currentCmd ? currentCmd.outputs : [];

    return (
      <div className="rekit-page home-status-page">
        <div className="header">
          {!editing && (
            <Link to="/cmd/add">
              <Icon type="plus" />
            </Link>
          )}
          {!editing && (
            <Link to="/about">
              <Icon type="info-circle-o" title="About" />
            </Link>
          )}
          {!editing && (
            <Link to="/settings">
              <Icon type="setting" />
            </Link>
          )}
          {!editing && allCmds.length > 0 && <Icon type="swap" title="Sort" onClick={this.handleBeginEdit} />}
          {editing && (
            <Button type="primary" size="small" onClick={this.handleEndEdit} style={{ float: 'right' }}>
              End Editing
            </Button>
          )}
        </div>
        <div className="page-content" id="status-list-container">
          <div className="cmd-list-container">
            <CmdList
              cmds={allCmds}
              runCmd={runCmd}
              stopCmd={stopCmd}
              deleteCmd={deleteCmd}
              reorderCmds={reorderCmds}
              clearOutput={clearOutput}
              editing={editing}
              selectCmd={selectCmd}
              selectedCmd={this.props.home.selectedCmd}
            />
            {allCmds.length > 0 || editing ? (
              <div className="footer">
                Total {allCmds.length} command{allCmds.length > 1 ? 's' : ''},{' '}
                {allCmds.filter(c => c.status === 'running').length} running.
              </div>
            ) : (
              <Welcome />
            )}
          </div>
          <div className="output-container">
            <ConsoleOutput lines={outputs} onClear={() => clearOutput(this.props.home.selectedCmd)} />;
          </div>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ runCmd, stopCmd, deleteCmd, reorderCmds, clearOutput, selectCmd }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusPage);
