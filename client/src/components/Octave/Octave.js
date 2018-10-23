import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import "./Alert.css"

const modalHeader = {
    backgroundColor: "mediumslateblue"
}

const modalBody = {
    backgroundColor: "lavender"
}

const btnStyle = {
    backgroundColor: 'white',
    borderColor: 'white',
    color: 'black',
    width: '100%',
    fontSize: "80%",
    marginBottom: "-3%",
    marginTop: "-4%"
}

const textStyle = {
    textAlign: 'center',
}

const ascendStyle = {
    textAlign: 'center',
    color: 'seagreen'
}

const descStyle = {
    color: 'royalblue',
    textAlign: 'center',
    marginTop: '5%',
}

class ModalExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
        {/* Octave */}
        <Button onClick={this.toggle} style={btnStyle}>{this.props.buttonLabel}Octave</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} style={modalHeader}>Octave</ModalHeader>
          <ModalBody style={modalBody}>
              <h4 style={ascendStyle}>Ascending Octave Songs</h4>
                <h6 style={textStyle}>Singin' in the Rain</h6>
                <h6 style={textStyle}>Let it Snow (Christmas)</h6>
                <h6 style={textStyle}>A Forest (The Cure)</h6>
              <h4 style={descStyle}>Descending Octave Songs</h4>
                <h6 style={textStyle}>Willow Weep for Me</h6>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ModalExample;